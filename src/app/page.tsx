
'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { CommandBrowser } from '@/components/powershell-forge/command-browser';
import { ScriptEditorColumn } from '@/components/powershell-forge/script-editor-column';
import { ActionsPanel } from '@/components/powershell-forge/actions-panel';
import { ResizableHandle } from '@/components/powershell-forge/resizable-handle';
import { mockCommands as initialMockCommands } from '@/data/mock-commands';
import type { BasePowerShellCommand, ScriptElement, ScriptType, RawScriptLine, ScriptPowerShellCommand, PowerShellCommandParameter, LoopScriptElement } from '@/types/powershell';
import { PlusSquare, PlaySquare, MinusSquare, TerminalSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateUniqueId } from '@/lib/utils';

const NUM_COLUMNS = 5;
const MIN_COLUMN_WIDTH_PERCENT = 5; // Minimum 5% width for any column
// Adjusted default widths: Command Browser (28%), Editors (20% each), Actions (12%)
const DEFAULT_COLUMN_WIDTHS_PERCENT = [28, 20, 20, 20, 12]; 

function stringifyScriptElements(elements: ScriptElement[], indentLevel = 0): string {
  const indent = '  '.repeat(indentLevel);
  return elements.map(el => {
    if (el.type === 'raw') {
      return `${indent}${el.content}`;
    }
    if (el.type === 'command') {
      const commandElement = el as ScriptPowerShellCommand;

      if (commandElement.baseCommandId === 'internal-add-comment') {
        const commentText = commandElement.parameterValues['CommentText'] || '';
        const formattedComment = commentText.split('\n').map(line => `${indent}# ${line}`).join('\n');
        const prependBlankLine = commandElement.parameterValues['_prependBlankLine'] !== 'false';
        return (prependBlankLine && indentLevel === 0 ? '\n' : '') + formattedComment; // Only add top-level blank line if not nested
      }

      if (commandElement.baseCommandId === 'internal-user-prompt') {
        return ''; // User Prompts are not rendered into the PowerShell script
      }

      const paramsString = commandElement.parameters
        .map(param => {
          const value = commandElement.parameterValues[param.name];
          // Only include parameters that have a non-empty value
          // or are boolean-like common parameters that should always be present if set (e.g. -Verbose if its value is '$true')
          // For simplicity, we'll just check for non-empty string value.
          return value ? `-${param.name} "${value.replace(/"/g, '`"')}"` : '';
        })
        .filter(Boolean)
        .join(' ');
      return `${indent}${commandElement.name}${paramsString ? ' ' + paramsString : ''}`;

    } else if (el.type === 'loop') {
      const loopEl = el as LoopScriptElement;
      let loopStart = '';
      const collection = loopEl.parameterValues['InputObject'] || '$null'; // Default to $null if not specified

      switch (loopEl.baseCommandId) {
        case 'internal-foreach-loop':
          const itemVar = loopEl.parameterValues['ItemVariable'] || '_'; // Default to $_
          loopStart = `${indent}foreach ($${itemVar.replace(/^\$/, '')} in ${collection}) {`;
          break;
        case 'internal-for-loop':
          const initializer = loopEl.parameterValues['Initializer'] || '';
          const condition = loopEl.parameterValues['Condition'] || '$false'; // Loop won't run if condition is empty
          const iterator = loopEl.parameterValues['Iterator'] || '';
          loopStart = `${indent}for (${initializer}; ${condition}; ${iterator}) {`;
          break;
        case 'internal-while-loop':
          const whileCondition = loopEl.parameterValues['Condition'] || '$false'; // Loop won't run if condition is empty
          loopStart = `${indent}while (${whileCondition}) {`;
          break;
        default:
          // Should not happen if types are correct
          loopStart = `${indent}# Unsupported loop type: ${loopEl.name}`;
      }
      const childrenString = stringifyScriptElements(loopEl.children, indentLevel + 1);
      const loopEnd = `${indent}}`;
      return `${loopStart}\n${childrenString}\n${loopEnd}`;
    }
    return ''; // Should not happen
  }).join('\n');
}


function parseTextToRawScriptLines(text: string): ScriptElement[] {
  if (!text || typeof text !== 'string') return [];
  return text.split('\n').map(line => {
    if (line.trim().startsWith('#')) {
      return {
        instanceId: generateUniqueId(),
        type: 'command',
        name: 'Comment',
        baseCommandId: 'internal-add-comment',
        parameters: [{ name: 'CommentText' }],
        parameterValues: { 
          'CommentText': line.trim().substring(1).trim(),
          '_prependBlankLine': 'true'
        }
      } as ScriptPowerShellCommand;
    }
    return {
      instanceId: generateUniqueId(),
      type: 'raw',
      content: line,
    } as RawScriptLine;
  });
}

function processLoadedElementsRecursive(elements: any[] | undefined): ScriptElement[] {
  if (!elements || !Array.isArray(elements)) return [];
  return elements.map((el: any) => {
    const newEl = { ...el };
    if (newEl.type === 'command' && newEl.baseCommandId === 'internal-add-comment') {
      if (newEl.parameterValues['_prependBlankLine'] === undefined) {
        newEl.parameterValues = { ...newEl.parameterValues, '_prependBlankLine': 'true' };
      }
    }
    if (newEl.type === 'command' && newEl.baseCommandId === 'internal-user-prompt') {
      if (newEl.parameterValues['PromptText'] === undefined) {
         newEl.parameterValues = { ...newEl.parameterValues, 'PromptText': 'ACTION NEEDED: [Your prompt text here]' };
      }
    }
    if (newEl.type === 'loop') {
      // Ensure children array exists and is processed
      newEl.children = processLoadedElementsRecursive(newEl.children || []);
      // Initialize default parameter values if missing for loops from older saves
      const loopBaseCommand = initialMockCommands.find(cmd => cmd.id === newEl.baseCommandId && cmd.isLoop);
      if (loopBaseCommand) {
        newEl.parameters = loopBaseCommand.parameters; // Ensure parameters definition is up-to-date
        const defaultValues: { [key: string]: string } = {};
        if (newEl.baseCommandId === 'internal-foreach-loop') {
          defaultValues['ItemVariable'] = newEl.parameterValues?.['ItemVariable'] || 'item';
          defaultValues['InputObject'] = newEl.parameterValues?.['InputObject'] || '';
        } else if (newEl.baseCommandId === 'internal-for-loop') {
          defaultValues['Initializer'] = newEl.parameterValues?.['Initializer'] || '';
          defaultValues['Condition'] = newEl.parameterValues?.['Condition'] || '';
          defaultValues['Iterator'] = newEl.parameterValues?.['Iterator'] || '';
        } else if (newEl.baseCommandId === 'internal-while-loop') {
          defaultValues['Condition'] = newEl.parameterValues?.['Condition'] || '';
        }
        newEl.parameterValues = { ...defaultValues, ...newEl.parameterValues };
      }
    }
    return newEl as ScriptElement;
  });
}


export default function PowerShellForgePage() {
  const [mockCommands, setMockCommands] = useState<BasePowerShellCommand[]>([]);
  const [customCommands, setCustomCommands] = useState<BasePowerShellCommand[]>([]);

  const [addScriptElements, setAddScriptElements] = useState<ScriptElement[]>([]);
  const [launchScriptElements, setLaunchScriptElements] = useState<ScriptElement[]>([]);
  const [removeScriptElements, setRemoveScriptElements] = useState<ScriptElement[]>([]);
  
  const [columnWidths, setColumnWidths] = useState<number[]>(DEFAULT_COLUMN_WIDTHS_PERCENT);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);


  const { toast } = useToast();

  useEffect(() => {
    setMockCommands(initialMockCommands);

    const savedCustomCommands = localStorage.getItem('powershellForge_customCommands');
    if (savedCustomCommands) {
      try {
        const parsed = JSON.parse(savedCustomCommands);
        if (Array.isArray(parsed) && parsed.every(cmd => cmd.id && cmd.name && Array.isArray(cmd.parameters))) {
          setCustomCommands(parsed);
        }
      } catch (e) {
        console.error("Failed to parse custom commands from localStorage", e);
        setCustomCommands([]);
      }
    }
     const savedWidths = localStorage.getItem('powershellForge_columnWidths');
    if (savedWidths) {
      try {
        const parsedWidths = JSON.parse(savedWidths) as number[];
        if (Array.isArray(parsedWidths) && parsedWidths.length === NUM_COLUMNS && parsedWidths.every(w => typeof w === 'number')) {
          const sum = parsedWidths.reduce((acc, w) => acc + w, 0);
          if (Math.abs(sum - 100) < 1) {
            setColumnWidths(parsedWidths);
          } else {
            setColumnWidths(DEFAULT_COLUMN_WIDTHS_PERCENT); 
            localStorage.removeItem('powershellForge_columnWidths'); 
          }
        } else {
          setColumnWidths(DEFAULT_COLUMN_WIDTHS_PERCENT); 
        }
      } catch (e) {
        console.error("Failed to parse column widths from localStorage", e);
        setColumnWidths(DEFAULT_COLUMN_WIDTHS_PERCENT); 
      }
    } else {
       setColumnWidths(DEFAULT_COLUMN_WIDTHS_PERCENT); 
    }
  }, []);

  useEffect(() => {
    const loadFromLocalStorage = (key: string, setter: React.Dispatch<React.SetStateAction<ScriptElement[]>>) => {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData) as any[]; // Load as any[] first for processing
          if (Array.isArray(parsed)) {
            setter(processLoadedElementsRecursive(parsed));
          } else if (typeof savedData === 'string' && !savedData.startsWith('[')) { // Old format, just text
            setter(parseTextToRawScriptLines(savedData));
          }
        } catch (e) {
          if (typeof savedData === 'string') { // Fallback for corrupted JSON or old string format
            setter(parseTextToRawScriptLines(savedData));
          }
        }
      }
    };

    loadFromLocalStorage('powershellForge_addScriptElements', setAddScriptElements);
    loadFromLocalStorage('powershellForge_launchScriptElements', setLaunchScriptElements);
    loadFromLocalStorage('powershellForge_removeScriptElements', setRemoveScriptElements);

  }, []);

  useEffect(() => {
    localStorage.setItem('powershellForge_addScriptElements', JSON.stringify(addScriptElements));
  }, [addScriptElements]);
  useEffect(() => {
    localStorage.setItem('powershellForge_launchScriptElements', JSON.stringify(launchScriptElements));
  }, [launchScriptElements]);
  useEffect(() => {
    localStorage.setItem('powershellForge_removeScriptElements', JSON.stringify(removeScriptElements));
  }, [removeScriptElements]);
  useEffect(() => {
    localStorage.setItem('powershellForge_customCommands', JSON.stringify(customCommands));
  }, [customCommands]);
  
  const firstRenderDone = useRef(false);
  useEffect(() => {
    if (firstRenderDone.current) { 
        const currentWidthsString = JSON.stringify(columnWidths);
        const defaultWidthsString = JSON.stringify(DEFAULT_COLUMN_WIDTHS_PERCENT);
        if (currentWidthsString !== defaultWidthsString) {
            localStorage.setItem('powershellForge_columnWidths', currentWidthsString);
        }
    } else {
        firstRenderDone.current = true;
    }
  }, [columnWidths]);


  const scriptElementSetters: Record<ScriptType, React.Dispatch<React.SetStateAction<ScriptElement[]>>> = {
    add: setAddScriptElements,
    launch: setLaunchScriptElements,
    remove: setRemoveScriptElements,
  };

  const scriptElementContents: Record<ScriptType, ScriptElement[]> = {
    add: addScriptElements,
    launch: launchScriptElements,
    remove: removeScriptElements,
  };

  const handleSaveScript = (type: ScriptType) => {
    const elements = scriptElementContents[type];
    if (elements.length === 0) {
      toast({ title: 'Empty Script', description: `The ${type} script is empty. Nothing to save.`, variant: 'default' });
      return;
    }
    const content = stringifyScriptElements(elements);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${type}_script.ps1`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: 'Script Saved', description: `${type.charAt(0).toUpperCase() + type.slice(1)} script saved as ${type}_script.ps1` });
  };

  const handleLoadScript = (type: ScriptType, textContent: string) => {
    scriptElementSetters[type](parseTextToRawScriptLines(textContent));
    toast({ title: 'Script Loaded', description: `${type.charAt(0).toUpperCase() + type.slice(1)} script loaded. Comments starting with '#' are parsed as editable comment objects.` });
  };

  const handleSaveAllScripts = () => {
    const allScripts = {
      add: addScriptElements,
      launch: launchScriptElements,
      remove: removeScriptElements,
    };
    const content = JSON.stringify(allScripts, null, 2);
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'powershell_forge_scripts.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: 'All Scripts Saved', description: 'All scripts saved to powershell_forge_scripts.json' });
  };

  const handleLoadAllScripts = (loadedScripts: { add: any[]; launch: any[]; remove: any[] }) => {
    setAddScriptElements(processLoadedElementsRecursive(loadedScripts.add));
    setLaunchScriptElements(processLoadedElementsRecursive(loadedScripts.launch));
    setRemoveScriptElements(processLoadedElementsRecursive(loadedScripts.remove));
    toast({ title: 'All Scripts Loaded', description: 'All scripts have been loaded successfully.' });
  };

  const handleAddNewCustomCommand = useCallback((commandData: { name: string; description?: string; parameters: PowerShellCommandParameter[] }) => {
    const newCustomCommand: BasePowerShellCommand = {
      ...commandData,
      id: `custom-${generateUniqueId()}`,
      isCustom: true,
      category: commandData.category || 'Custom', // Ensure category
    };
    setCustomCommands(prev => [...prev, newCustomCommand]);
    toast({ title: 'Custom Command Added', description: `Command "${newCustomCommand.name}" has been added.` });
  }, [toast]);

  const allAvailableCommands = useMemo(() => [...mockCommands, ...customCommands], [mockCommands, customCommands]);

  const handleResize = useCallback((handleIndex: number, deltaX: number) => {
    if (!mainContentRef.current) return;
    isResizingRef.current = true;
    document.body.classList.add('select-none', 'cursor-col-resize');


    setColumnWidths(prevWidths => {
      const newWidths = [...prevWidths];
      const containerWidth = mainContentRef.current!.offsetWidth;
      if (containerWidth === 0) return prevWidths; 

      let deltaPercent = (deltaX / containerWidth) * 100;

      const leftColumnIndex = handleIndex;
      const rightColumnIndex = handleIndex + 1;

      if (rightColumnIndex === newWidths.length -1 && newWidths[rightColumnIndex] === -1) { 
         let newLeftWidth = newWidths[leftColumnIndex] + deltaPercent;
         if (newLeftWidth < MIN_COLUMN_WIDTH_PERCENT) {
            deltaPercent = MIN_COLUMN_WIDTH_PERCENT - newWidths[leftColumnIndex];
            newLeftWidth = MIN_COLUMN_WIDTH_PERCENT;
         }
         newWidths[leftColumnIndex] = newLeftWidth;
      } else {
        let newLeftWidth = newWidths[leftColumnIndex] + deltaPercent;
        if (newLeftWidth < MIN_COLUMN_WIDTH_PERCENT) {
          deltaPercent = MIN_COLUMN_WIDTH_PERCENT - newWidths[leftColumnIndex];
          newLeftWidth = MIN_COLUMN_WIDTH_PERCENT;
        }
        
        let newRightWidth = newWidths[rightColumnIndex] - deltaPercent;
        if (newRightWidth < MIN_COLUMN_WIDTH_PERCENT) {
          deltaPercent = newWidths[rightColumnIndex] - MIN_COLUMN_WIDTH_PERCENT;
          newRightWidth = MIN_COLUMN_WIDTH_PERCENT;
          newLeftWidth = newWidths[leftColumnIndex] + deltaPercent; 
        }

        if (newLeftWidth < MIN_COLUMN_WIDTH_PERCENT) {
          newRightWidth += (MIN_COLUMN_WIDTH_PERCENT - newLeftWidth);
          newLeftWidth = MIN_COLUMN_WIDTH_PERCENT;
        }

        newWidths[leftColumnIndex] = newLeftWidth;
        newWidths[rightColumnIndex] = newRightWidth;
      }

      const percentageColumns = newWidths.filter((w, i) => i < newWidths.length -1 || (i === newWidths.length -1 && w !== -1) );
      const currentSum = percentageColumns.reduce((sum, w) => sum + w, 0);

      if (Math.abs(currentSum - 100) > 0.01 && percentageColumns.length === newWidths.length) {
        const scaleFactor = 100 / currentSum;
        for (let i = 0; i < newWidths.length; i++) {
          newWidths[i] *= scaleFactor;
          if (newWidths[i] < MIN_COLUMN_WIDTH_PERCENT) newWidths[i] = MIN_COLUMN_WIDTH_PERCENT;
        }
        const finalSum = newWidths.reduce((sum, w) => sum + w, 0);
        if (Math.abs(finalSum - 100) > 0.01) {
            const finalScaleFactor = 100 / finalSum;
            for (let i = 0; i < newWidths.length; i++) {
                newWidths[i] *= finalScaleFactor;
            }
        }
      }
      return newWidths;
    });
  }, []);
  
  const handleResizeEnd = useCallback(() => {
    if (isResizingRef.current) {
      isResizingRef.current = false;
      document.body.classList.remove('select-none', 'cursor-col-resize');
    }
  }, []);


  const columnsData = [
    {
      id: 'command-browser',
      component: <CommandBrowser mockCommands={mockCommands} customCommands={customCommands} onSaveCustomCommand={handleAddNewCustomCommand} />,
    },
    {
      id: 'add-script',
      component: <ScriptEditorColumn title="Add" icon={PlusSquare} scriptType="add" scriptElements={addScriptElements} setScriptElements={setAddScriptElements} baseCommands={allAvailableCommands} />,
    },
    {
      id: 'launch-script',
      component: <ScriptEditorColumn title="Launch" icon={PlaySquare} scriptType="launch" scriptElements={launchScriptElements} setScriptElements={setLaunchScriptElements} baseCommands={allAvailableCommands} />,
    },
    {
      id: 'remove-script',
      component: <ScriptEditorColumn title="Remove" icon={MinusSquare} scriptType="remove" scriptElements={removeScriptElements} setScriptElements={setRemoveScriptElements} baseCommands={allAvailableCommands} />,
    },
    {
      id: 'actions-panel',
      component: <ActionsPanel onSaveScript={handleSaveScript} onLoadScript={handleLoadScript} onSaveAllScripts={handleSaveAllScripts} onLoadAllScripts={handleLoadAllScripts} />,
    },
  ];

  return (
    <div className="flex flex-col h-screen p-4 bg-background gap-4">
      <header className="pb-2 mb-0 border-b">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2 font-headline">
          <TerminalSquare className="h-8 w-8" />
          PowerShell Forge
        </h1>
        <p className="text-xs text-muted-foreground">
          Create and manage PowerShell scripts for applications.
        </p>
      </header>
      <main ref={mainContentRef} className="flex-grow flex flex-col md:flex-row overflow-hidden md:gap-0 gap-4">
        <div className="md:hidden flex flex-col gap-4">
          {columnsData.map(col => (
            <div key={col.id} className="h-auto min-h-[300px] max-h-[50vh] md:max-h-full overflow-y-auto">
              {col.component}
            </div>
          ))}
        </div>

        <div className="hidden md:flex flex-row flex-grow w-full">
          {columnsData.map((col, index) => {
            const isLastColumn = index === columnsData.length - 1;
            const columnStyle: React.CSSProperties = isLastColumn
              ? { 
                  flexGrow: 0,
                  flexShrink: 0, 
                  flexBasis: 'auto',
                  overflowX: 'auto', 
                }
              : { 
                  flexGrow: columnWidths[index], 
                  flexShrink: 1,
                  flexBasis: `${columnWidths[index]}%`, 
                  minWidth: `${MIN_COLUMN_WIDTH_PERCENT}%`,
                };
            
            return (
              <React.Fragment key={col.id}>
                <div
                  className="h-full overflow-y-auto"
                  style={columnStyle}
                >
                  {col.component}
                </div>
                {index < columnsData.length - 1 && ( 
                  <ResizableHandle
                    onResize={(deltaX) => handleResize(index, deltaX)}
                    onResizeEnd={handleResizeEnd}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </main>
    </div>
  );
}

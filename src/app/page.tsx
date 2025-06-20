
'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { CommandBrowser } from '@/components/powershell-forge/command-browser';
import { ScriptEditorColumn } from '@/components/powershell-forge/script-editor-column';
import { ActionsPanel } from '@/components/powershell-forge/actions-panel';
import { ResizableHandle } from '@/components/powershell-forge/resizable-handle';
import { mockCommands as initialMockCommands } from '@/data/mock-commands';
import type { BasePowerShellCommand, ScriptElement, ScriptType, RawScriptLine, ScriptPowerShellCommand, PowerShellCommandParameter } from '@/types/powershell';
import { PlusSquare, PlaySquare, MinusSquare, TerminalSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateUniqueId } from '@/lib/utils';

const NUM_COLUMNS = 5;
const MIN_COLUMN_WIDTH_PERCENT = 5; // Minimum 5% width for any column
// Adjusted default widths: Command Browser (28%), Editors (20% each), Actions (12%)
const DEFAULT_COLUMN_WIDTHS_PERCENT = [28, 20, 20, 20, 12]; 

function stringifyScriptElements(elements: ScriptElement[]): string {
  return elements.map(el => {
    if (el.type === 'raw') {
      return el.content;
    }
    const commandElement = el as ScriptPowerShellCommand;

    if (commandElement.baseCommandId === 'internal-add-comment') {
      const commentText = commandElement.parameterValues['CommentText'] || '';
      const formattedComment = commentText.split('\n').map(line => `# ${line}`).join('\n');
      const prependBlankLine = commandElement.parameterValues['_prependBlankLine'] !== 'false';
      return (prependBlankLine ? '\n' : '') + formattedComment;
    }

    const paramsString = commandElement.parameters
      .map(param => {
        const value = commandElement.parameterValues[param.name];
        return value ? `-${param.name} "${value.replace(/"/g, '`"')}"` : '';
      })
      .filter(Boolean)
      .join(' ');
    return `${commandElement.name}${paramsString ? ' ' + paramsString : ''}`;
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
          // Basic validation: ensure sum is close to 100
          const sum = parsedWidths.reduce((acc, w) => acc + w, 0);
          if (Math.abs(sum - 100) < 1) { // Allow for small floating point inaccuracies
            setColumnWidths(parsedWidths);
          } else {
            console.warn("Loaded column widths do not sum to 100, resetting to default.");
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
          const parsed = JSON.parse(savedData) as ScriptElement[];
          if (Array.isArray(parsed) && parsed.every(el => el.instanceId && el.type &&
            (el.type === 'raw' || (el.type === 'command' && (el as ScriptPowerShellCommand).baseCommandId))
          )) {
            const processedParsed = parsed.map(el => {
              if (el.type === 'command' && el.baseCommandId === 'internal-add-comment') {
                const cmdEl = el as ScriptPowerShellCommand;
                if (cmdEl.parameterValues['_prependBlankLine'] === undefined) {
                  return { ...cmdEl, parameterValues: { ...cmdEl.parameterValues, '_prependBlankLine': 'true' }};
                }
              }
              return el;
            });
            setter(processedParsed);
          } else if (typeof savedData === 'string' && !savedData.startsWith('[')) {
            setter(parseTextToRawScriptLines(savedData));
          }
        } catch (e) {
          if (typeof savedData === 'string') {
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

  const handleLoadAllScripts = (loadedScripts: { add: ScriptElement[]; launch: ScriptElement[]; remove: ScriptElement[] }) => {
     const processLoadedElements = (elements: ScriptElement[] | undefined) => {
      if (!elements) return [];
      return elements.map(el => {
        if (el.type === 'command' && el.baseCommandId === 'internal-add-comment') {
          const cmdEl = el as ScriptPowerShellCommand;
          if (cmdEl.parameterValues['_prependBlankLine'] === undefined) {
            return { ...cmdEl, parameterValues: { ...cmdEl.parameterValues, '_prependBlankLine': 'true' }};
          }
        }
        return el;
      });
    };
    setAddScriptElements(processLoadedElements(loadedScripts.add));
    setLaunchScriptElements(processLoadedElements(loadedScripts.launch));
    setRemoveScriptElements(processLoadedElements(loadedScripts.remove));
    toast({ title: 'All Scripts Loaded', description: 'All scripts have been loaded successfully.' });
  };

  const handleAddNewCustomCommand = useCallback((commandData: { name: string; description?: string; parameters: PowerShellCommandParameter[] }) => {
    const newCustomCommand: BasePowerShellCommand = {
      ...commandData,
      id: `custom-${generateUniqueId()}`,
      isCustom: true,
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

      // Do not attempt to resize the last column (ActionsPanel) if it's set to 'auto' width
      // The resize handle before it will adjust the column to its left.
      if (rightColumnIndex === newWidths.length -1 && newWidths[rightColumnIndex] === -1) { // -1 can signify 'auto' for internal logic
        // Apply all delta to the left column if the right one is auto/fixed
         let newLeftWidth = newWidths[leftColumnIndex] + deltaPercent;
         if (newLeftWidth < MIN_COLUMN_WIDTH_PERCENT) {
            deltaPercent = MIN_COLUMN_WIDTH_PERCENT - newWidths[leftColumnIndex];
            newLeftWidth = MIN_COLUMN_WIDTH_PERCENT;
         }
         newWidths[leftColumnIndex] = newLeftWidth;
         // The "auto" column will adjust naturally. We just need to ensure other percentages are okay.
         const resizableCols = newWidths.slice(0, -1);
         const currentSumResizable = resizableCols.reduce((sum, w) => sum + w, 0);
         // This logic might need to be more sophisticated if other columns are also auto or fixed.
         // For now, assuming only the last one can be special.
         // If sum is off, it might be due to minWidth constraints, try to re-distribute or cap.

      } else {
        // Original logic for two percentage-based columns
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


      // Normalize widths to sum to 100% for percentage-based columns
      const percentageColumns = newWidths.filter((w, i) => i < newWidths.length -1 || (i === newWidths.length -1 && w !== -1) ); // Exclude 'auto' from sum if marked as -1
      const currentSum = percentageColumns.reduce((sum, w) => sum + w, 0);

      if (Math.abs(currentSum - 100) > 0.01 && percentageColumns.length === newWidths.length) { // Only normalize if all are percentage
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
              ? { // Actions Panel - shrinks to content
                  flexGrow: 0,
                  flexShrink: 0, 
                  flexBasis: 'auto',
                  overflowX: 'auto', // Handle potential overflow if content is wider than viewport allows
                }
              : { // Other resizable columns
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
                {index < columnsData.length - 1 && ( // Add resizer for all but the very last column
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



'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CommandBrowser } from '@/components/powershell-forge/command-browser';
import { ScriptEditorColumn } from '@/components/powershell-forge/script-editor-column';
import { ActionsPanel } from '@/components/powershell-forge/actions-panel';
import { mockCommands as initialMockCommands } from '@/data/mock-commands';
import type { BasePowerShellCommand, ScriptElement, ScriptType, RawScriptLine, ScriptPowerShellCommand, PowerShellCommandParameter } from '@/types/powershell';
import { PlusSquare, PlaySquare, MinusSquare, TerminalSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateUniqueId } from '@/lib/utils';

// Helper function to stringify ScriptElements for .ps1 export
function stringifyScriptElements(elements: ScriptElement[]): string {
  return elements.map(el => {
    if (el.type === 'raw') {
      return el.content;
    }
    // el.type === 'command' (this now includes comments)
    const commandElement = el as ScriptPowerShellCommand;

    if (commandElement.baseCommandId === 'internal-add-comment') {
      const commentText = commandElement.parameterValues['CommentText'] || '';
      // Ensure each line of a multi-line comment input starts with #
      // User input in textarea for multiple lines will have '\n'
      const formattedComment = commentText.split('\n').map(line => `# ${line}`).join('\n');
      return '\n' + formattedComment; // Prepend newline here
    }

    const paramsString = commandElement.parameters
      .map(param => {
        const value = commandElement.parameterValues[param.name];
        // Only include parameter if value is not empty or undefined
        // Basic quoting, PowerShell uses backtick to escape quotes within double-quoted strings
        return value ? `-${param.name} "${value.replace(/"/g, '`"')}"` : '';
      })
      .filter(Boolean) // Remove empty strings
      .join(' ');
    return `${commandElement.name}${paramsString ? ' ' + paramsString : ''}`;
  }).join('\n'); // Use actual newline character for joining lines
}

// Helper function to parse plain text script into ScriptElement[]
function parseTextToRawScriptLines(text: string): ScriptElement[] {
  if (!text || typeof text !== 'string') return [];
  return text.split('\n').map(line => { // Split by actual newline character
    // Basic check if it's a comment, convert to our comment command structure
    if (line.trim().startsWith('#')) {
      return {
        instanceId: generateUniqueId(),
        type: 'command',
        name: 'Comment', // Matches the name in mock-commands.ts
        baseCommandId: 'internal-add-comment',
        parameters: [{ name: 'CommentText' }],
        parameterValues: { 'CommentText': line.trim().substring(1).trim() } // Store text without leading #
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
            setter(parsed);
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
    setAddScriptElements(loadedScripts.add || []);
    setLaunchScriptElements(loadedScripts.launch || []);
    setRemoveScriptElements(loadedScripts.remove || []);
    toast({ title: 'All Scripts Loaded', description: 'All scripts have been loaded successfully.' });
  };

  const handleAddNewCustomCommand = useCallback((commandData: { name: string; description?: string; parameters: PowerShellCommandParameter[] }) => {
    const newCustomCommand: BasePowerShellCommand = {
      ...commandData,
      id: `custom-${generateUniqueId()}`, // Ensure a unique ID for custom commands
      isCustom: true,
    };
    setCustomCommands(prev => [...prev, newCustomCommand]);
    toast({ title: 'Custom Command Added', description: `Command "${newCustomCommand.name}" has been added.` });
  }, [toast]);

  const allAvailableCommands = useMemo(() => [...mockCommands, ...customCommands], [mockCommands, customCommands]);


  return (
    <div className="flex flex-col h-screen p-4 bg-background gap-4">
      <header className="pb-2 mb-0 border-b">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2 font-headline">
          <TerminalSquare className="h-8 w-8" />
          PowerShell Forge
        </h1>
        <p className="text-sm text-muted-foreground">
          Create and manage PowerShell scripts for applications.
        </p>
      </header>
      <main className="flex-grow grid grid-cols-1 md:grid-cols-10 gap-4 overflow-hidden">
        <div className="md:col-span-2 h-full overflow-y-auto">
          <CommandBrowser
            mockCommands={mockCommands}
            customCommands={customCommands}
            onSaveCustomCommand={handleAddNewCustomCommand}
          />
        </div>
        <div className="md:col-span-2 h-full overflow-y-auto">
          <ScriptEditorColumn
            title="Add"
            icon={PlusSquare}
            scriptType="add"
            scriptElements={addScriptElements}
            setScriptElements={setAddScriptElements}
            baseCommands={allAvailableCommands}
          />
        </div>
        <div className="md:col-span-2 h-full overflow-y-auto">
          <ScriptEditorColumn
            title="Launch"
            icon={PlaySquare}
            scriptType="launch"
            scriptElements={launchScriptElements}
            setScriptElements={setLaunchScriptElements}
            baseCommands={allAvailableCommands}
          />
        </div>
        <div className="md:col-span-2 h-full overflow-y-auto">
          <ScriptEditorColumn
            title="Remove"
            icon={MinusSquare}
            scriptType="remove"
            scriptElements={removeScriptElements}
            setScriptElements={setRemoveScriptElements}
            baseCommands={allAvailableCommands}
          />
        </div>
        <div className="md:col-span-2 h-full overflow-y-auto">
          <ActionsPanel
            onSaveScript={handleSaveScript}
            onLoadScript={handleLoadScript}
            onSaveAllScripts={handleSaveAllScripts}
            onLoadAllScripts={handleLoadAllScripts}
          />
        </div>
      </main>
    </div>
  );
}

    

    
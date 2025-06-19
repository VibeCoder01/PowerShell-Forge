'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CommandBrowser } from '@/components/powershell-forge/command-browser';
import { ScriptEditorColumn } from '@/components/powershell-forge/script-editor-column';
import { ActionsPanel } from '@/components/powershell-forge/actions-panel';
import { mockCommands } from '@/data/mock-commands';
import type { BasePowerShellCommand, ScriptElement, ScriptType, RawScriptLine, ScriptPowerShellCommand } from '@/types/powershell';
import { PlusSquare, PlaySquare, MinusSquare, TerminalSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateUniqueId } from '@/lib/utils';

// Helper function to stringify ScriptElements for .ps1 export
function stringifyScriptElements(elements: ScriptElement[]): string {
  return elements.map(el => {
    if (el.type === 'raw') {
      return el.content;
    }
    // el.type === 'command'
    const commandElement = el as ScriptPowerShellCommand;
    const paramsString = commandElement.parameters
      .map(param => {
        const value = commandElement.parameterValues[param.name];
        // Only include parameter if value is not empty or undefined
        return value ? `-${param.name} "${value.replace(/"/g, '`"')}"` : ''; // Basic quoting, PowerShell uses backtick to escape quotes
      })
      .filter(Boolean) // Remove empty strings
      .join(' ');
    return `${commandElement.name}${paramsString ? ' ' + paramsString : ''}`;
  }).join('\n');
}

// Helper function to parse plain text script into RawScriptLine[]
function parseTextToRawScriptLines(text: string): RawScriptLine[] {
  if (!text || typeof text !== 'string') return [];
  return text.split('\n').map(line => ({
    instanceId: generateUniqueId(),
    type: 'raw',
    content: line,
  }));
}


export default function PowerShellForgePage() {
  const [commands, setCommands] = useState<BasePowerShellCommand[]>([]);
  const [addScriptElements, setAddScriptElements] = useState<ScriptElement[]>([]);
  const [launchScriptElements, setLaunchScriptElements] = useState<ScriptElement[]>([]);
  const [removeScriptElements, setRemoveScriptElements] = useState<ScriptElement[]>([]);
  const [isAiSuggestionsEnabled, setIsAiSuggestionsEnabled] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setCommands(mockCommands);
  }, []);
  
  useEffect(() => {
    const loadFromLocalStorage = (key: string, setter: React.Dispatch<React.SetStateAction<ScriptElement[]>>) => {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          // Basic validation: check if it's an array and elements have instanceId and type
          if (Array.isArray(parsed) && parsed.every(el => el.instanceId && el.type)) {
            setter(parsed);
          } else if (typeof savedData === 'string') { // Legacy: treat as plain text
            setter(parseTextToRawScriptLines(savedData));
          }
        } catch (e) { // If JSON parsing fails, treat as plain text
          setter(parseTextToRawScriptLines(savedData));
        }
      }
    };

    loadFromLocalStorage('powershellForge_addScriptElements', setAddScriptElements);
    loadFromLocalStorage('powershellForge_launchScriptElements', setLaunchScriptElements);
    loadFromLocalStorage('powershellForge_removeScriptElements', setRemoveScriptElements);
    
    const savedAiToggle = localStorage.getItem('powershellForge_aiSuggestionsEnabled');
    if (savedAiToggle) setIsAiSuggestionsEnabled(savedAiToggle === 'true');
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
    localStorage.setItem('powershellForge_aiSuggestionsEnabled', String(isAiSuggestionsEnabled));
  }, [isAiSuggestionsEnabled]);


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
    toast({ title: 'Script Loaded', description: `${type.charAt(0).toUpperCase() + type.slice(1)} script loaded successfully. Each line is treated as raw text.` });
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
  
  const handleAiSuggestionToggle = useCallback(() => {
    setIsAiSuggestionsEnabled(prev => !prev);
  }, []);


  return (
    <div className="flex flex-col h-screen p-4 bg-background gap-4">
      <header className="pb-2 mb-0 border-b">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2 font-headline">
          <TerminalSquare className="h-8 w-8" />
          PowerShell Forge
        </h1>
        <p className="text-sm text-muted-foreground">
          AI-assisted PowerShell script creation for managing applications.
        </p>
      </header>
      <main className="flex-grow grid grid-cols-1 md:grid-cols-10 gap-4 overflow-hidden">
        <div className="md:col-span-2 h-full overflow-y-auto">
          <CommandBrowser commands={commands} />
        </div>
        <div className="md:col-span-2 h-full overflow-y-auto">
          <ScriptEditorColumn
            title="Add Script"
            icon={PlusSquare}
            scriptType="add"
            scriptElements={addScriptElements}
            setScriptElements={setAddScriptElements}
            isAiSuggestionsGloballyEnabled={isAiSuggestionsEnabled}
            baseCommands={commands}
          />
        </div>
        <div className="md:col-span-2 h-full overflow-y-auto">
          <ScriptEditorColumn
            title="Launch Script"
            icon={PlaySquare}
            scriptType="launch"
            scriptElements={launchScriptElements}
            setScriptElements={setLaunchScriptElements}
            isAiSuggestionsGloballyEnabled={isAiSuggestionsEnabled}
            baseCommands={commands}
          />
        </div>
        <div className="md:col-span-2 h-full overflow-y-auto">
          <ScriptEditorColumn
            title="Remove Script"
            icon={MinusSquare}
            scriptType="remove"
            scriptElements={removeScriptElements}
            setScriptElements={setRemoveScriptElements}
            isAiSuggestionsGloballyEnabled={isAiSuggestionsEnabled}
            baseCommands={commands}
          />
        </div>
        <div className="md:col-span-2 h-full overflow-y-auto">
          <ActionsPanel
            onSaveScript={handleSaveScript}
            onLoadScript={handleLoadScript} // This now expects plain text content
            onSaveAllScripts={handleSaveAllScripts}
            onLoadAllScripts={handleLoadAllScripts} // This expects ScriptElement[] structure
            isAiSuggestionsEnabled={isAiSuggestionsEnabled}
            onAiSuggestionToggle={handleAiSuggestionToggle}
          />
        </div>
      </main>
    </div>
  );
}

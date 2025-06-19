'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CommandBrowser } from '@/components/powershell-forge/command-browser';
import { ScriptEditorColumn } from '@/components/powershell-forge/script-editor-column';
import { ActionsPanel } from '@/components/powershell-forge/actions-panel';
import { mockCommands } from '@/data/mock-commands';
import type { PowerShellCommand, ScriptType } from '@/types/powershell';
import { PlusSquare, PlaySquare, MinusSquare, TerminalSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PowerShellForgePage() {
  const [commands, setCommands] = useState<PowerShellCommand[]>([]);
  const [addScript, setAddScript] = useState('');
  const [launchScript, setLaunchScript] = useState('');
  const [removeScript, setRemoveScript] = useState('');
  const [isAiSuggestionsEnabled, setIsAiSuggestionsEnabled] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    // In a real app, you might fetch commands here
    setCommands(mockCommands);
  }, []);
  
  // Load scripts from localStorage on initial mount
  useEffect(() => {
    const savedAddScript = localStorage.getItem('powershellForge_addScript');
    const savedLaunchScript = localStorage.getItem('powershellForge_launchScript');
    const savedRemoveScript = localStorage.getItem('powershellForge_removeScript');
    const savedAiToggle = localStorage.getItem('powershellForge_aiSuggestionsEnabled');

    if (savedAddScript) setAddScript(savedAddScript);
    if (savedLaunchScript) setLaunchScript(savedLaunchScript);
    if (savedRemoveScript) setRemoveScript(savedRemoveScript);
    if (savedAiToggle) setIsAiSuggestionsEnabled(savedAiToggle === 'true');
  }, []);

  // Save scripts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('powershellForge_addScript', addScript);
  }, [addScript]);
  useEffect(() => {
    localStorage.setItem('powershellForge_launchScript', launchScript);
  }, [launchScript]);
  useEffect(() => {
    localStorage.setItem('powershellForge_removeScript', removeScript);
  }, [removeScript]);
  useEffect(() => {
    localStorage.setItem('powershellForge_aiSuggestionsEnabled', String(isAiSuggestionsEnabled));
  }, [isAiSuggestionsEnabled]);


  const scriptSetters: Record<ScriptType, React.Dispatch<React.SetStateAction<string>>> = {
    add: setAddScript,
    launch: setLaunchScript,
    remove: setRemoveScript,
  };

  const scriptContents: Record<ScriptType, string> = {
    add: addScript,
    launch: launchScript,
    remove: removeScript,
  };

  const handleSaveScript = (type: ScriptType) => {
    const content = scriptContents[type];
    if (!content.trim()) {
      toast({ title: 'Empty Script', description: `The ${type} script is empty. Nothing to save.`, variant: 'default' });
      return;
    }
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

  const handleLoadScript = (type: ScriptType, content: string) => {
    scriptSetters[type](content);
    toast({ title: 'Script Loaded', description: `${type.charAt(0).toUpperCase() + type.slice(1)} script loaded successfully.` });
  };

  const handleSaveAllScripts = () => {
    const allScripts = {
      add: addScript,
      launch: launchScript,
      remove: removeScript,
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

  const handleLoadAllScripts = (loadedScripts: { add: string; launch: string; remove: string }) => {
    setAddScript(loadedScripts.add || '');
    setLaunchScript(loadedScripts.launch || '');
    setRemoveScript(loadedScripts.remove || '');
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
            scriptContent={addScript}
            setScriptContent={setAddScript}
            isAiSuggestionsGloballyEnabled={isAiSuggestionsEnabled}
            onAiSuggestionToggle={handleAiSuggestionToggle}
          />
        </div>
        <div className="md:col-span-2 h-full overflow-y-auto">
          <ScriptEditorColumn
            title="Launch Script"
            icon={PlaySquare}
            scriptType="launch"
            scriptContent={launchScript}
            setScriptContent={setLaunchScript}
            isAiSuggestionsGloballyEnabled={isAiSuggestionsEnabled}
            onAiSuggestionToggle={handleAiSuggestionToggle}
          />
        </div>
        <div className="md:col-span-2 h-full overflow-y-auto">
          <ScriptEditorColumn
            title="Remove Script"
            icon={MinusSquare}
            scriptType="remove"
            scriptContent={removeScript}
            setScriptContent={setRemoveScript}
            isAiSuggestionsGloballyEnabled={isAiSuggestionsEnabled}
            onAiSuggestionToggle={handleAiSuggestionToggle}
          />
        </div>
        <div className="md:col-span-2 h-full overflow-y-auto">
          <ActionsPanel
            scripts={{ add: addScript, launch: launchScript, remove: removeScript }}
            onSaveScript={handleSaveScript}
            onLoadScript={handleLoadScript}
            onSaveAllScripts={handleSaveAllScripts}
            onLoadAllScripts={handleLoadAllScripts}
            isAiSuggestionsEnabled={isAiSuggestionsEnabled}
            onAiSuggestionToggle={handleAiSuggestionToggle}
          />
        </div>
      </main>
    </div>
  );
}

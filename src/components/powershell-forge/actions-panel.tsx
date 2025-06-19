'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Save, FolderOpen, Settings2, Download, Upload, FileText, Brain } from 'lucide-react';
import React, { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { ScriptType, ScriptElement } from '@/types/powershell'; // Updated import

interface ActionsPanelProps {
  onSaveScript: (type: ScriptType) => void;
  onLoadScript: (type: ScriptType, content: string) => void; // Expects plain text for .ps1
  onSaveAllScripts: () => void;
  onLoadAllScripts: (scripts: { add: ScriptElement[]; launch: ScriptElement[]; remove: ScriptElement[] }) => void; // Expects structured data
  isAiSuggestionsEnabled: boolean;
  onAiSuggestionToggle: () => void;
}

export function ActionsPanel({ 
  onSaveScript, 
  onLoadScript,
  onSaveAllScripts,
  onLoadAllScripts,
  isAiSuggestionsEnabled,
  onAiSuggestionToggle
}: ActionsPanelProps) {
  const fileInputRefs = {
    add: useRef<HTMLInputElement>(null),
    launch: useRef<HTMLInputElement>(null),
    remove: useRef<HTMLInputElement>(null),
    all: useRef<HTMLInputElement>(null),
  };

  const handleFileLoad = (type: ScriptType | 'all', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (type === 'all') {
          try {
            const parsedScripts = JSON.parse(content);
            // Basic validation for the structure of loaded 'all scripts' data
            if (
              parsedScripts &&
              typeof parsedScripts === 'object' &&
              Array.isArray(parsedScripts.add) && // Check if 'add' is an array (further checks can be added for ScriptElement structure)
              Array.isArray(parsedScripts.launch) &&
              Array.isArray(parsedScripts.remove)
            ) {
              onLoadAllScripts(parsedScripts as { add: ScriptElement[]; launch: ScriptElement[]; remove: ScriptElement[] });
            } else {
              alert('Invalid format for "all scripts" file. Expected JSON with add, launch, remove arrays of script elements.');
            }
          } catch (error) {
            alert('Error parsing "all scripts" file. Ensure it is a valid JSON.');
          }
        } else {
          // For individual .ps1 files, pass raw text content
          onLoadScript(type as ScriptType, content);
        }
      };
      reader.readAsText(file);
      event.target.value = ''; 
    }
  };

  const triggerFileInput = (type: ScriptType | 'all') => {
    fileInputRefs[type].current?.click();
  };

  return (
    <Card className="h-full flex flex-col shadow-xl">
      <CardHeader className="py-4 px-4 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings2 className="h-6 w-6 text-primary" />
          Actions & Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-6">
        <div>
          <h3 className="text-md font-semibold mb-3 flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />Script Management</h3>
          {(['add', 'launch', 'remove'] as ScriptType[]).map((type) => (
            <div key={type} className="mb-3 p-3 border rounded-md bg-background/50">
              <p className="capitalize font-medium mb-2 text-sm">{type} Script (.ps1)</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onSaveScript(type)} className="flex-1">
                  <Download className="mr-2 h-4 w-4" /> Save {type}
                </Button>
                <Button variant="outline" size="sm" onClick={() => triggerFileInput(type)} className="flex-1">
                  <Upload className="mr-2 h-4 w-4" /> Load {type}
                </Button>
                <input
                  type="file"
                  accept=".ps1,.txt" // Individual scripts are ps1 or txt
                  ref={fileInputRefs[type]}
                  onChange={(e) => handleFileLoad(type, e)}
                  className="hidden"
                  aria-label={`Load ${type} script file`}
                />
              </div>
            </div>
          ))}
          <Separator className="my-4" />
           <div className="mb-3 p-3 border rounded-md bg-background/50">
              <p className="font-medium mb-2 text-sm">All Scripts (.json)</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onSaveAllScripts} className="flex-1">
                  <Download className="mr-2 h-4 w-4" /> Save All
                </Button>
                <Button variant="outline" size="sm" onClick={() => triggerFileInput('all')} className="flex-1">
                  <Upload className="mr-2 h-4 w-4" /> Load All
                </Button>
                 <input
                  type="file"
                  accept=".json" // All scripts are saved/loaded as JSON
                  ref={fileInputRefs.all}
                  onChange={(e) => handleFileLoad('all', e)}
                  className="hidden"
                  aria-label="Load all scripts file"
                />
              </div>
            </div>
        </div>
        
        <Separator className="my-4" />

        <div>
          <h3 className="text-md font-semibold mb-3 flex items-center gap-2"><Brain className="h-5 w-5 text-primary" />AI Settings</h3>
          <div className="flex items-center justify-between p-3 border rounded-md bg-background/50">
            <Label htmlFor="global-ai-suggestions" className="text-sm font-medium">
              Enable AI Suggestions
            </Label>
            <Switch
              id="global-ai-suggestions"
              checked={isAiSuggestionsEnabled}
              onCheckedChange={onAiSuggestionToggle}
              aria-label="Toggle AI suggestions globally"
            />
          </div>
           <p className="text-xs text-muted-foreground mt-2 px-1">
            When enabled, the "Suggest with AI" button in script editors will become active.
          </p>
        </div>

      </CardContent>
    </Card>
  );
}


'use client';

import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Settings2, Download, Upload, FileText } from 'lucide-react';
import type { ScriptType, ScriptElement } from '@/types/powershell';

interface ActionsPanelProps {
  onSaveScript: (type: ScriptType) => void;
  onLoadScript: (type: ScriptType, content: string) => void;
  onSaveAllScripts: () => void;
  onLoadAllScripts: (scripts: { add: ScriptElement[]; launch: ScriptElement[]; remove: ScriptElement[] }) => void;
}

export function ActionsPanel({
  onSaveScript,
  onLoadScript,
  onSaveAllScripts,
  onLoadAllScripts,
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
            if (
              parsedScripts &&
              typeof parsedScripts === 'object' &&
              Array.isArray(parsedScripts.add) &&
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
          onLoadScript(type as ScriptType, content);
        }
      };
      reader.readAsText(file);
      if (event.target) event.target.value = '';
    }
  };

  const triggerFileInput = (type: ScriptType | 'all') => {
    fileInputRefs[type].current?.click();
  };

  return (
    <Card className="h-full flex flex-col shadow-xl w-fit">
      <CardHeader className="py-3 px-4 pr-4 pl-4 border-b">
        <CardTitle className="text-base flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" />
          Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pr-2 pt-2 pb-2 flex-grow space-y-2">
        <div>
          <h3 className="text-xs font-semibold mb-1 flex items-center gap-2"><FileText className="h-3.5 w-3.5 text-primary" />Script Management</h3>
          {(['add', 'launch', 'remove'] as ScriptType[]).map((type) => (
            <div key={type} className="mb-1 p-1 border rounded-md bg-primary/10">
              <p className="capitalize font-medium mb-1 text-xs">{type} Script (.ps1)</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onSaveScript(type)} className="text-xs">
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Save
                </Button>
                <Button variant="outline" size="sm" onClick={() => triggerFileInput(type)} className="text-xs">
                  <Upload className="mr-1.5 h-3.5 w-3.5" /> Load
                </Button>
                <input
                  type="file"
                  accept=".ps1,.txt"
                  ref={fileInputRefs[type]}
                  onChange={(e) => handleFileLoad(type, e)}
                  className="hidden"
                  aria-label={`Load ${type} script file`}
                />
              </div>
            </div>
          ))}
          <Separator className="my-1" />
           <div className="mb-1 p-1 border rounded-md bg-accent/20">
              <p className="font-medium mb-1 text-xs">All Scripts (.json)</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onSaveAllScripts} className="text-xs">
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Save
                </Button>
                <Button variant="outline" size="sm" onClick={() => triggerFileInput('all')} className="text-xs">
                  <Upload className="mr-1.5 h-3.5 w-3.5" /> Load
                </Button>
                 <input
                  type="file"
                  accept=".json"
                  ref={fileInputRefs.all}
                  onChange={(e) => handleFileLoad('all', e)}
                  className="hidden"
                  aria-label="Load all scripts file"
                />
              </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

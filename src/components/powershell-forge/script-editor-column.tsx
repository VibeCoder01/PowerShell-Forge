'use client';

import React, { useState } from 'react';
import type { BasePowerShellCommand, ScriptElement, ScriptType, ScriptPowerShellCommand, RawScriptLine } from '@/types/powershell';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import type { LucideIcon } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { ParameterEditDialog } from './parameter-edit-dialog'; 
import { ScriptCommandChip } from './script-command-chip'; 
import { generateUniqueId } from '@/lib/utils';

interface ScriptEditorColumnProps {
  title: string;
  icon: LucideIcon;
  scriptType: ScriptType;
  scriptElements: ScriptElement[];
  setScriptElements: (elements: ScriptElement[] | ((prevElements: ScriptElement[]) => ScriptElement[])) => void;
  baseCommands: BasePowerShellCommand[]; 
}

export function ScriptEditorColumn({
  title,
  icon: Icon,
  scriptType,
  scriptElements,
  setScriptElements,
  baseCommands,
}: ScriptEditorColumnProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const { toast } = useToast();
  
  const [editingCommand, setEditingCommand] = useState<ScriptPowerShellCommand | null>(null);
  const [showParameterDialog, setShowParameterDialog] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    try {
      const commandJson = e.dataTransfer.getData('application/json');
      if (!commandJson) return;
      const baseCommand = JSON.parse(commandJson) as BasePowerShellCommand;
      
      const newScriptCommand: ScriptPowerShellCommand = {
        instanceId: generateUniqueId(),
        type: 'command',
        name: baseCommand.name,
        parameters: baseCommand.parameters, 
        parameterValues: baseCommand.parameters.reduce((acc, param) => {
          acc[param.name] = ''; 
          return acc;
        }, {} as { [key: string]: string }),
        baseCommandId: baseCommand.id,
      };

      setScriptElements(prev => [...prev, newScriptCommand]);
      toast({
        title: 'Command Added',
        description: `${baseCommand.name} added to ${title} script. Click to edit parameters.`,
      });
    } catch (error) {
      console.error('Failed to parse dropped data:', error);
      toast({
        variant: 'destructive',
        title: 'Drop Error',
        description: 'Could not add the command. Invalid data.',
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleEditCommand = (command: ScriptPowerShellCommand) => {
    const fullBaseCommand = baseCommands.find(bc => bc.id === command.baseCommandId);
    if (fullBaseCommand) {
      setEditingCommand({
        ...command,
        parameters: fullBaseCommand.parameters, 
      });
      setShowParameterDialog(true);
    } else {
      // Fallback for custom commands or commands not in baseCommands (should ideally not happen for non-custom)
      setEditingCommand(command); 
      setShowParameterDialog(true);
      toast({variant: 'default', title: 'Editing Command', description: `Editing parameters for ${command.name}. Base command details might be limited if it's a fully custom entry not in the library.`});
    }
  };

  const handleSaveEditedCommand = (updatedCommand: ScriptPowerShellCommand) => {
    setScriptElements(prevElements => 
      prevElements.map(el => 
        el.instanceId === updatedCommand.instanceId ? updatedCommand : el
      )
    );
    setShowParameterDialog(false);
    setEditingCommand(null);
    toast({title: 'Command Updated', description: `${updatedCommand.name} parameters saved.`});
  };

  const handleRemoveElement = (instanceId: string) => {
    setScriptElements(prevElements => prevElements.filter(el => el.instanceId !== instanceId));
    toast({title: 'Element Removed', description: 'Script element removed.'});
  };

  return (
    <Card 
      className={`h-full flex flex-col shadow-xl transition-all duration-200 ${isDraggingOver ? 'ring-2 ring-primary ring-offset-2' : ''}`}
      aria-dropeffect="copy"
    >
      <CardHeader className="py-4 px-4 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className="h-6 w-6 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent 
        className="p-0 flex-grow flex flex-col relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <ScrollArea className="h-full w-full">
          <div className="p-4 space-y-2 min-h-[200px] font-mono text-sm">
            {scriptElements.length === 0 && (
              <p className="text-muted-foreground text-center py-10">Drag commands here...</p>
            )}
            {scriptElements.map((element) => {
              let hasUnsetParameters = false;
              if (element.type === 'command') {
                const cmdElement = element as ScriptPowerShellCommand;
                const hasDefinedParams = cmdElement.parameters && cmdElement.parameters.length > 0;
                const allValuesAreEmpty = Object.values(cmdElement.parameterValues).every(val => val === '');
                if (hasDefinedParams && allValuesAreEmpty) {
                  hasUnsetParameters = true;
                }
              }

              return (
                <div key={element.instanceId} className="group relative flex items-center">
                  {element.type === 'command' ? (
                    <ScriptCommandChip
                      command={element}
                      onClick={() => handleEditCommand(element)}
                      hasUnsetParameters={hasUnsetParameters}
                    />
                  ) : (
                    <div className="p-2 border border-transparent rounded hover:border-muted-foreground/50 flex-grow break-all">
                      {(element as RawScriptLine).content || <span className="text-muted-foreground">[Empty line]</span>}
                    </div>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-1/2 -translate-y-1/2 bg-card hover:bg-destructive/20"
                    onClick={() => handleRemoveElement(element.instanceId)}
                    aria-label="Remove script element"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t flex flex-col sm:flex-row justify-end items-center gap-4">
        {/* Footer can be used for other actions in the future if needed */}
      </CardFooter>
      {editingCommand && (
        <ParameterEditDialog
          key={editingCommand.instanceId} 
          isOpen={showParameterDialog}
          onOpenChange={setShowParameterDialog}
          command={editingCommand}
          onSave={handleSaveEditedCommand}
        />
      )}
    </Card>
  );
}

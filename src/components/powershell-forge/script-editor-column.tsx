'use client';

import React, { useState, useCallback } from 'react';
import type { BasePowerShellCommand, ScriptElement, ScriptType, ScriptPowerShellCommand, RawScriptLine } from '@/types/powershell';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { generateScriptFromDescription as generateScriptFlow } from '@/ai/flows/generate-script-from-description';
import { suggestScript as suggestScriptFlow } from '@/ai/flows/suggest-script';
import type { LucideIcon } from 'lucide-react';
import { Wand2, Sparkles, Loader2, Trash2 } from 'lucide-react';
import { AiScriptGeneratorDialog } from './ai-script-generator-dialog';
import { ParameterEditDialog } from './parameter-edit-dialog'; // To be created
import { ScriptCommandChip } from './script-command-chip'; // To be created
import { generateUniqueId } from '@/lib/utils';

interface ScriptEditorColumnProps {
  title: string;
  icon: LucideIcon;
  scriptType: ScriptType;
  scriptElements: ScriptElement[];
  setScriptElements: (elements: ScriptElement[] | ((prevElements: ScriptElement[]) => ScriptElement[])) => void;
  isAiSuggestionsGloballyEnabled: boolean;
  baseCommands: BasePowerShellCommand[]; // For rehydrating command details if needed
}

// Helper to stringify ScriptElements for AI context
function stringifyScriptElementsForAI(elements: ScriptElement[]): string {
  return elements.map(el => {
    if (el.type === 'raw') {
      return el.content;
    }
    const commandElement = el as ScriptPowerShellCommand;
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


export function ScriptEditorColumn({
  title,
  icon: Icon,
  scriptType,
  scriptElements,
  setScriptElements,
  isAiSuggestionsGloballyEnabled,
  baseCommands,
}: ScriptEditorColumnProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const { toast } = useToast();
  const [isGeneratingFullScript, setIsGeneratingFullScript] = useState(false);
  const [isSuggestingScript, setIsSuggestingScript] = useState(false);
  const [showAiGeneratorDialog, setShowAiGeneratorDialog] = useState(false);
  
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
        parameters: baseCommand.parameters, // Keep original parameters for structure
        parameterValues: baseCommand.parameters.reduce((acc, param) => {
          acc[param.name] = ''; // Initialize with empty values
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

  const handleGenerateScript = async (description: string) => {
    setIsGeneratingFullScript(true);
    try {
      const result = await generateScriptFlow({ description });
      const newElements: RawScriptLine[] = result.script.split('\n').map(line => ({
        instanceId: generateUniqueId(),
        type: 'raw',
        content: line,
      }));
      setScriptElements(newElements);
      toast({
        title: 'AI Script Generated',
        description: `${title} script has been populated by AI as raw text.`,
      });
    } catch (error) {
      console.error('AI script generation failed:', error);
      toast({
        variant: 'destructive',
        title: 'AI Generation Error',
        description: 'Failed to generate script. Please try again.',
      });
    } finally {
      setIsGeneratingFullScript(false);
    }
  };
  
  const handleSuggestScript = async () => {
    if (scriptElements.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Cannot Suggest',
        description: 'Script editor is empty. Type something or add commands first.',
      });
      return;
    }
    setIsSuggestingScript(true);
    try {
      const scriptContext = stringifyScriptElementsForAI(scriptElements);
      const result = await suggestScriptFlow({ 
        context: scriptContext, 
        objective: `Refine or complete a PowerShell script for ${scriptType}ing an application, based on the provided context.` 
      });
      const newElements: RawScriptLine[] = result.suggestion.split('\n').map(line => ({
        instanceId: generateUniqueId(),
        type: 'raw',
        content: line,
      }));
      setScriptElements(newElements); // Replace current content with AI suggestion as raw lines
      toast({
        title: 'AI Suggestion Applied',
        description: `AI has updated the ${title} script with new content (as raw text).`,
      });
    } catch (error) {
      console.error('AI script suggestion failed:', error);
      toast({
        variant: 'destructive',
        title: 'AI Suggestion Error',
        description: 'Failed to get AI suggestion. Please try again.',
      });
    } finally {
      setIsSuggestingScript(false);
    }
  };

  const handleEditCommand = (command: ScriptPowerShellCommand) => {
    const fullBaseCommand = baseCommands.find(bc => bc.id === command.baseCommandId);
    if (fullBaseCommand) {
      setEditingCommand({
        ...command,
        parameters: fullBaseCommand.parameters, // Ensure full parameter list for dialog
      });
      setShowParameterDialog(true);
    } else {
       // Fallback or error: command details not found
      setEditingCommand(command); // Use existing parameters if base not found
      setShowParameterDialog(true);
      toast({variant: 'destructive', title: 'Warning', description: `Base command details for ${command.name} not found. Editing with current parameters.`});
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
              <p className="text-muted-foreground text-center py-10">Drag commands here or use AI to generate script...</p>
            )}
            {scriptElements.map((element, index) => (
              <div key={element.instanceId} className="group relative flex items-center">
                {element.type === 'command' ? (
                  <ScriptCommandChip
                    command={element}
                    onClick={() => handleEditCommand(element)}
                  />
                ) : (
                  <div className="p-2 border border-transparent rounded hover:border-muted-foreground/50 flex-grow break-all">
                    {element.content || <span className="text-muted-foreground">[Empty line]</span>}
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
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
           <Switch
            id={`ai-suggestions-${scriptType}`}
            checked={isAiSuggestionsGloballyEnabled}
            disabled
            aria-label="Enable AI suggestions (controlled globally)"
          />
          <Label htmlFor={`ai-suggestions-${scriptType}`} className="text-sm">AI Suggestions</Label>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAiGeneratorDialog(true)}
            disabled={isGeneratingFullScript || isSuggestingScript}
          >
            {isGeneratingFullScript ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate with AI
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSuggestScript}
            disabled={!isAiSuggestionsGloballyEnabled || isSuggestingScript || isGeneratingFullScript || scriptElements.length === 0}
            title={!isAiSuggestionsGloballyEnabled ? "Enable AI Suggestions globally to use this feature" : "Get AI suggestion for current script"}
          >
             {isSuggestingScript ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Suggest with AI
          </Button>
        </div>
      </CardFooter>
      <AiScriptGeneratorDialog
        open={showAiGeneratorDialog}
        onOpenChange={setShowAiGeneratorDialog}
        onGenerate={handleGenerateScript}
        scriptTypeTitle={title}
      />
      {editingCommand && (
        <ParameterEditDialog
          key={editingCommand.instanceId} // Force re-mount to reset dialog state if command changes
          isOpen={showParameterDialog}
          onOpenChange={setShowParameterDialog}
          command={editingCommand}
          onSave={handleSaveEditedCommand}
        />
      )}
    </Card>
  );
}

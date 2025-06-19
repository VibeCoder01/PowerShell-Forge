'use client';

import React, { useState, useCallback } from 'react';
import type { PowerShellCommand, ScriptType } from '@/types/powershell';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { generateScriptFromDescription as generateScriptFlow } from '@/ai/flows/generate-script-from-description';
import { suggestScript as suggestScriptFlow } from '@/ai/flows/suggest-script';
import type { LucideIcon } from 'lucide-react';
import { Wand2, Sparkles, Loader2 } from 'lucide-react';
import { AiScriptGeneratorDialog } from './ai-script-generator-dialog';

interface ScriptEditorColumnProps {
  title: string;
  icon: LucideIcon;
  scriptType: ScriptType;
  scriptContent: string;
  setScriptContent: (content: string) => void;
  isAiSuggestionsGloballyEnabled: boolean;
  onAiSuggestionToggle: () => void;
}

export function ScriptEditorColumn({
  title,
  icon: Icon,
  scriptType,
  scriptContent,
  setScriptContent,
  isAiSuggestionsGloballyEnabled,
}: ScriptEditorColumnProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const { toast } = useToast();
  const [isGeneratingFullScript, setIsGeneratingFullScript] = useState(false);
  const [isSuggestingScript, setIsSuggestingScript] = useState(false);
  const [showAiGeneratorDialog, setShowAiGeneratorDialog] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    try {
      const commandJson = e.dataTransfer.getData('application/json');
      if (!commandJson) return;
      const command = JSON.parse(commandJson) as PowerShellCommand;
      
      let commandText = command.name;
      if (command.parameters.length > 0) {
        const paramsText = command.parameters.map(p => `-${p.name} <value>`).join(' ');
        commandText += ` ${paramsText}`;
      }

      const currentText = scriptContent;
      // For simplicity, append to new line. Could be improved to insert at cursor.
      const newText = currentText ? `${currentText}\n${commandText}` : commandText;
      setScriptContent(newText);
      toast({
        title: 'Command Added',
        description: `${command.name} added to ${title} script.`,
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
      setScriptContent(result.script);
      toast({
        title: 'AI Script Generated',
        description: `${title} script has been populated by AI.`,
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
    if (!scriptContent.trim()) {
      toast({
        variant: 'destructive',
        title: 'Cannot Suggest',
        description: 'Script editor is empty. Type something first or use "Generate with AI".',
      });
      return;
    }
    setIsSuggestingScript(true);
    try {
      const result = await suggestScriptFlow({ 
        context: scriptContent, 
        objective: `Refine or complete a PowerShell script for ${scriptType}ing an application.` 
      });
      // For now, replace the content. Could be improved to offer choices.
      setScriptContent(result.suggestion);
      toast({
        title: 'AI Suggestion Applied',
        description: `AI has updated the ${title} script.`,
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


  return (
    <Card 
      className={`h-full flex flex-col shadow-xl transition-all duration-200 ${isDraggingOver ? 'ring-2 ring-primary ring-offset-2' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      aria-dropeffect="copy"
    >
      <CardHeader className="py-4 px-4 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className="h-6 w-6 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <Textarea
          placeholder={`Drag commands here or type your ${title.toLowerCase()} script...`}
          value={scriptContent}
          onChange={(e) => setScriptContent(e.target.value)}
          className="flex-grow text-sm font-mono resize-none h-full min-h-[200px]"
          aria-label={`${title} script editor`}
        />
      </CardContent>
      <CardFooter className="p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
           <Switch
            id={`ai-suggestions-${scriptType}`}
            checked={isAiSuggestionsGloballyEnabled}
            disabled // This switch is now controlled globally from ActionsPanel
            aria-label="Enable AI suggestions"
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
            disabled={!isAiSuggestionsGloballyEnabled || isSuggestingScript || isGeneratingFullScript || !scriptContent.trim()}
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
    </Card>
  );
}

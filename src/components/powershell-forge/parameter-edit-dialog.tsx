
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ScriptPowerShellCommand, PowerShellCommandParameter, LoopScriptElement } from '@/types/powershell';
import { FolderOpen, PlusCircle, MinusCircle, Settings2, ChevronsUpDown, MessageSquareText, AlertTriangle, Repeat, IterationCcw, ListTree } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from "@/components/ui/checkbox";
import { generateUniqueId } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';


// Heuristic list of parameter names that typically expect a file path.
const pathParamNames = [
  'Path', 'FilePath', 'LiteralPath', 'PSPath',
  'SourcePath', 'DestinationPath', 'TargetPath',
  'LogPath', 'OutFile', 'AppendPath', 'FullName'
];

// Parameter names that typically expect just a filename.
const fileNameParamNames = ['Name', 'FileName'];

const COMMON_PARAMETERS_LIST: PowerShellCommandParameter[] = [
  { name: 'Verbose' }, { name: 'Debug' }, { name: 'ErrorAction' }, 
  { name: 'WarningAction' }, { name: 'InformationAction' }, { name: 'ErrorVariable' }, 
  { name: 'WarningVariable' }, { name: 'InformationVariable' }, { name: 'OutVariable' }, 
  { name: 'OutBuffer' }, { name: 'PipelineVariable' }, { name: 'WhatIf' }, { name: 'Confirm' }
];


interface ParameterEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  command: ScriptPowerShellCommand | LoopScriptElement; // Can be either a command or a loop
  onSave: (updatedCommand: ScriptPowerShellCommand | LoopScriptElement) => void;
}

interface AdHocParam {
  id: string;
  name: string;
}

export function ParameterEditDialog({
  isOpen,
  onOpenChange,
  command,
  onSave,
}: ParameterEditDialogProps) {
  const [currentParameterValues, setCurrentParameterValues] = useState<{ [key: string]: string }>({});
  const [adHocParams, setAdHocParams] = useState<AdHocParam[]>([]);
  const [newAdHocName, setNewAdHocName] = useState('');
  const [newAdHocValue, setNewAdHocValue] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [paramNameForFileBrowse, setParamNameForFileBrowse] = useState<string | null>(null);
  const { toast } = useToast();

  const isCommentCommand = command && command.type ==='command' && command.baseCommandId === 'internal-add-comment';
  const isUserPromptCommand = command && command.type ==='command' && command.baseCommandId === 'internal-user-prompt';
  const isLoopCommand = command && command.type === 'loop';


  useEffect(() => {
    if (command) {
      const initialValues = { ...command.parameterValues };
      if (isCommentCommand && initialValues['_prependBlankLine'] === undefined) {
        initialValues['_prependBlankLine'] = 'true';
      }
      if (isUserPromptCommand && initialValues['PromptText'] === undefined) {
        initialValues['PromptText'] = 'ACTION NEEDED: [Your prompt text here]';
      }
      if (isLoopCommand) {
        const loopCmd = command as LoopScriptElement;
        if (loopCmd.baseCommandId === 'internal-foreach-loop') {
            initialValues['ItemVariable'] = initialValues['ItemVariable'] || 'item'; // Default to 'item'
            initialValues['InputObject'] = initialValues['InputObject'] || '$collection';
        } else if (loopCmd.baseCommandId === 'internal-for-loop') {
            initialValues['Initializer'] = initialValues['Initializer'] || '$i = 0';
            initialValues['Condition'] = initialValues['Condition'] || '$i -lt 10';
            initialValues['Iterator'] = initialValues['Iterator'] || '$i++';
        } else if (loopCmd.baseCommandId === 'internal-while-loop') {
            initialValues['Condition'] = initialValues['Condition'] || '$true';
        }
      }
      setCurrentParameterValues(initialValues);
      
      if (!isCommentCommand && !isUserPromptCommand && !isLoopCommand) {
        const regularCmd = command as ScriptPowerShellCommand;
        const definedParamNames = regularCmd.parameters.map(p => p.name);
        const commonParamNames = COMMON_PARAMETERS_LIST.map(p => p.name);

        const existingAdHoc = Object.keys(regularCmd.parameterValues)
          .filter(key => 
            !definedParamNames.includes(key) && 
            !commonParamNames.includes(key) &&
            key !== 'CommentText' && 
            key !== '_prependBlankLine' &&
            key !== 'PromptText'
          )
          .map(name => ({ id: generateUniqueId(), name }));
        setAdHocParams(existingAdHoc);
      } else {
        setAdHocParams([]); 
      }
    }
  }, [command, isCommentCommand, isUserPromptCommand, isLoopCommand]);

  const handleValueChange = (paramName: string, value: string) => {
    setCurrentParameterValues(prev => ({ ...prev, [paramName]: value }));
  };

  const handlePrependBlankLineChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === 'boolean') {
      setCurrentParameterValues(prev => ({ ...prev, ['_prependBlankLine']: checked ? 'true' : 'false' }));
    }
  };

  const handleSubmit = () => {
    onSave({ ...command, parameterValues: currentParameterValues });
    onOpenChange(false);
    setNewAdHocName('');
    setNewAdHocValue('');
  };

  const handleBrowseClick = (paramName: string) => {
    setParamNameForFileBrowse(paramName);
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && paramNameForFileBrowse) {
      handleValueChange(paramNameForFileBrowse, file.name);
    }
    if (event.target) {
      event.target.value = '';
    }
    setParamNameForFileBrowse(null);
  };

  const handleAddAdHocParam = () => {
    if (!newAdHocName.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Parameter name cannot be empty.' });
      return;
    }
    if (command.parameters.some(p => p.name === newAdHocName.trim()) || 
        COMMON_PARAMETERS_LIST.some(p => p.name === newAdHocName.trim()) ||
        adHocParams.some(p => p.name === newAdHocName.trim())) {
      toast({ variant: 'destructive', title: 'Error', description: `Parameter "${newAdHocName.trim()}" already exists or is a common parameter.` });
      return;
    }
    setAdHocParams(prev => [...prev, { id: generateUniqueId(), name: newAdHocName.trim() }]);
    setCurrentParameterValues(prev => ({ ...prev, [newAdHocName.trim()]: newAdHocValue }));
    setNewAdHocName('');
    setNewAdHocValue('');
  };

  const handleRemoveAdHocParam = (idToRemove: string) => {
    const paramToRemove = adHocParams.find(p => p.id === idToRemove);
    if (paramToRemove) {
      setAdHocParams(prev => prev.filter(p => p.id !== idToRemove));
      setCurrentParameterValues(prev => {
        const updated = { ...prev };
        delete updated[paramToRemove.name];
        return updated;
      });
    }
  };


  if (!command) return null;

  const specificParameters = command.type === 'loop' 
    ? command.parameters // For loops, all defined parameters are specific to the loop construct
    : (command as ScriptPowerShellCommand).parameters.filter(
        param => !COMMON_PARAMETERS_LIST.some(commonParam => commonParam.name.toLowerCase() === param.name.toLowerCase())
      );

  const getDialogTitle = () => {
    if (isCommentCommand) return 'Edit Comment';
    if (isUserPromptCommand) return 'Edit User Prompt';
    if (isLoopCommand) return `Edit Parameters for: ${command.name}`;
    return `Edit Parameters for: ${command.name}`;
  };

  const getDialogIcon = () => {
    if (isCommentCommand) return <MessageSquareText className="h-5 w-5 text-primary" />;
    if (isUserPromptCommand) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    if (isLoopCommand) {
        const loopCmd = command as LoopScriptElement;
        if (loopCmd.baseCommandId === 'internal-foreach-loop') return <Repeat className="h-5 w-5 text-blue-500" />;
        if (loopCmd.baseCommandId === 'internal-for-loop') return <IterationCcw className="h-5 w-5 text-blue-500" />;
        if (loopCmd.baseCommandId === 'internal-while-loop') return <ListTree className="h-5 w-5 text-blue-500" />;
    }
    return <Settings2 className="h-5 w-5 text-primary" />;
  };
  
  const getDialogDescription = () => {
    if (isCommentCommand) return 'Edit the text content of the comment. Each new line in the text box will be a new comment line prefixed with #.';
    if (isUserPromptCommand) return 'Edit the text for this user prompt. This prompt is for your reference and will not be included in the generated PowerShell script.';
    if (isLoopCommand) {
        const loopCmd = command as LoopScriptElement;
        if (loopCmd.baseCommandId === 'internal-foreach-loop') return 'Define the collection to iterate over and the variable for each item.';
        if (loopCmd.baseCommandId === 'internal-for-loop') return 'Define the initializer, condition, and iterator for the For loop.';
        if (loopCmd.baseCommandId === 'internal-while-loop') return 'Define the condition that must be true for the While loop to continue.';
    }
    return 'Modify specific, common, or add custom parameters for this command instance. For path parameters, use Browse to get the filename, then edit the path manually.';
  }


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            {getDialogIcon()}
            {getDialogTitle()}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {getDialogDescription()}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-2">
          <div className="space-y-6 py-4 pr-4">

            {isCommentCommand && (
              <div className="space-y-4">
                <Label htmlFor="CommentText" className="text-sm font-semibold text-foreground">Comment Text</Label>
                <Textarea
                  id="CommentText"
                  value={currentParameterValues['CommentText'] || ''}
                  onChange={(e) => handleValueChange('CommentText', e.target.value)}
                  className="flex-grow"
                  placeholder="Enter comment text"
                  rows={4}
                />
                <div className="flex items-center space-x-2 mt-4 pl-1">
                  <Checkbox
                    id="prepend-blank-line"
                    checked={currentParameterValues['_prependBlankLine'] !== 'false'} 
                    onCheckedChange={handlePrependBlankLineChange}
                    aria-label="Prepend blank line before comment"
                  />
                  <Label htmlFor="prepend-blank-line" className="text-xs font-normal text-muted-foreground">
                    Prepend blank line before comment in script output
                  </Label>
                </div>
              </div>
            )}

            {isUserPromptCommand && (
              <div className="space-y-4">
                <Label htmlFor="PromptText" className="text-sm font-semibold text-foreground">Prompt Text</Label>
                <Textarea
                  id="PromptText"
                  value={currentParameterValues['PromptText'] || ''}
                  onChange={(e) => handleValueChange('PromptText', e.target.value)}
                  className="flex-grow"
                  placeholder="ACTION NEEDED: [Your prompt text here]"
                  rows={4}
                />
              </div>
            )}
            
            {isLoopCommand && (
                <div className="space-y-4">
                    {(command as LoopScriptElement).parameters.map((param) => (
                        <div key={param.name} className="grid grid-cols-1 md:grid-cols-5 items-start gap-x-4 gap-y-1">
                            <Label htmlFor={`loop-${param.name}`} className="md:text-right col-span-1 whitespace-nowrap pr-2 pl-1 pt-2 text-xs">
                                {param.name}
                            </Label>
                            <div className="flex items-center gap-2 md:col-span-4 py-1 pr-1">
                                <Input
                                    id={`loop-${param.name}`}
                                    value={currentParameterValues[param.name] || ''}
                                    onChange={(e) => handleValueChange(param.name, e.target.value)}
                                    className="flex-grow"
                                    placeholder={`Value for ${param.name}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}


            {!isCommentCommand && !isUserPromptCommand && !isLoopCommand && specificParameters.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Specific Parameters</h3>
                {specificParameters.map((param) => {
                  const isPotentiallyPathOrFileName = 
                    (pathParamNames.some(name => name.toLowerCase() === param.name.toLowerCase()) ||
                    fileNameParamNames.some(name => name.toLowerCase() === param.name.toLowerCase()));

                  return (
                    <div key={param.name} className="grid grid-cols-1 md:grid-cols-5 items-start gap-x-4 gap-y-1">
                      <Label htmlFor={param.name} className="md:text-right col-span-1 whitespace-nowrap pr-2 pl-1 pt-2 text-xs">
                        {param.name}
                      </Label>
                      <div className={`flex items-center gap-2 ${isPotentiallyPathOrFileName ? 'md:col-span-3' : 'md:col-span-4'} py-1 pr-1`}>
                        <Input
                          id={param.name}
                          value={currentParameterValues[param.name] || ''}
                          onChange={(e) => handleValueChange(param.name, e.target.value)}
                          className="flex-grow"
                          placeholder={`Value for ${param.name}`}
                        />
                      </div>
                      {isPotentiallyPathOrFileName && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBrowseClick(param.name)}
                          className="md:col-span-1 w-full md:w-auto mt-1 md:mt-0 self-center text-xs"
                          aria-label={`Browse for ${param.name}`}
                        >
                          <FolderOpen className="mr-2 h-4 w-4" /> Browse
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {!isCommentCommand && !isUserPromptCommand && !isLoopCommand && specificParameters.length === 0 && !adHocParams.length && (
                 <p className="text-xs text-muted-foreground pl-1">This command has no specific or custom parameters defined. You can add custom parameters below or use common parameters.</p>
            )}

            {/* Common Parameters and Ad-hoc Parameters are not applicable to Loop constructs in this simplified dialog */}
            {!isCommentCommand && !isUserPromptCommand && !isLoopCommand && (
              <Accordion type="single" collapsible className="w-full pt-2">
                <AccordionItem value="common-parameters">
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline pl-1">
                    <div className="flex items-center gap-2">
                      <ChevronsUpDown className="h-4 w-4" /> Common Parameters
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 space-y-4">
                    {COMMON_PARAMETERS_LIST.map((param) => (
                      <div key={param.name} className="grid grid-cols-1 md:grid-cols-5 items-center gap-x-4 gap-y-1">
                        <Label htmlFor={`common-${param.name}`} className="md:text-right col-span-1 whitespace-nowrap pr-2 pl-1 text-xs">
                          {param.name}
                        </Label>
                        <div className="md:col-span-4 py-1 pr-1">
                          <Input
                            id={`common-${param.name}`}
                            value={currentParameterValues[param.name] || ''}
                            onChange={(e) => handleValueChange(param.name, e.target.value)}
                            placeholder={`Value for ${param.name} (e.g., $true, SilentlyContinue)`}
                          />
                        </div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="adhoc-parameters">
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline pl-1">
                    <div className="flex items-center gap-2">
                      <ChevronsUpDown className="h-4 w-4" /> Additional Custom Parameters ({adHocParams.length})
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 space-y-4">
                    {adHocParams.map((param) => (
                      <div key={param.id} className="grid grid-cols-1 md:grid-cols-5 items-center gap-x-4 gap-y-1">
                        <Label htmlFor={`adhoc-${param.id}`} className="md:text-right col-span-1 whitespace-nowrap pr-2 pl-1 text-xs">
                          {param.name}
                        </Label>
                        <div className="md:col-span-3 py-1 pr-1">
                          <Input
                            id={`adhoc-${param.id}`}
                            value={currentParameterValues[param.name] || ''}
                            onChange={(e) => handleValueChange(param.name, e.target.value)}
                            placeholder={`Value for ${param.name}`}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAdHocParam(param.id)}
                          className="md:col-span-1 text-destructive hover:text-destructive-foreground hover:bg-destructive/90"
                          aria-label={`Remove parameter ${param.name}`}
                        >
                          <MinusCircle className="h-5 w-5" />
                        </Button>
                      </div>
                    ))}
                    <div className="pt-4 space-y-2 border-t mt-4 pl-1">
                      <Label className="text-xs font-medium">Add New Custom Parameter</Label>
                      <div className="flex flex-col sm:flex-row items-stretch gap-2">
                        <Input
                          value={newAdHocName}
                          onChange={(e) => setNewAdHocName(e.target.value)}
                          placeholder="Parameter Name"
                          className="flex-grow"
                        />
                        <Input
                          value={newAdHocValue}
                          onChange={(e) => setNewAdHocValue(e.target.value)}
                          placeholder="Parameter Value"
                          className="flex-grow"
                        />
                        <Button onClick={handleAddAdHocParam} variant="outline" size="sm" className="shrink-0 text-xs">
                          <PlusCircle className="mr-2 h-4 w-4" /> Add
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            
          </div>
        </ScrollArea>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelected}
          className="hidden"
          aria-hidden="true"
        />
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-xs">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="text-xs">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

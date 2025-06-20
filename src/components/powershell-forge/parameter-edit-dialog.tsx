
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
import type { ScriptPowerShellCommand, PowerShellCommandParameter } from '@/types/powershell';
import { FolderOpen, PlusCircle, MinusCircle, Settings2, ChevronsUpDown, MessageSquareText, AlertTriangle, Repeat, IterationCcw, ListTree, CornerRightDown, CornerLeftUp } from 'lucide-react';
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
  command: ScriptPowerShellCommand; 
  onSave: (updatedCommand: ScriptPowerShellCommand) => void;
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

  const isCommentCommand = command && command.baseCommandId === 'internal-add-comment';
  const isUserPromptCommand = command && command.baseCommandId === 'internal-user-prompt';
  const isStartLoopCommand = command && command.baseCommandId.startsWith('internal-start-');
  const isEndLoopCommand = command && command.baseCommandId.startsWith('internal-end-');


  useEffect(() => {
    if (command) {
      const initialValues = { ...command.parameterValues };
      if (isCommentCommand && initialValues['_prependBlankLine'] === undefined) {
        initialValues['_prependBlankLine'] = 'true';
      }
      if (isUserPromptCommand && initialValues['PromptText'] === undefined) {
        initialValues['PromptText'] = 'ACTION NEEDED: [Your prompt text here]';
      }
      if (isStartLoopCommand) {
        if (command.baseCommandId === 'internal-start-foreach-loop') {
            initialValues['ItemVariable'] = initialValues['ItemVariable'] || 'item';
            initialValues['InputObject'] = initialValues['InputObject'] || '$collection';
        } else if (command.baseCommandId === 'internal-start-for-loop') {
            initialValues['Initializer'] = initialValues['Initializer'] || '$i = 0';
            initialValues['Condition'] = initialValues['Condition'] || '$i -lt 10';
            initialValues['Iterator'] = initialValues['Iterator'] || '$i++';
        } else if (command.baseCommandId === 'internal-start-while-loop') {
            initialValues['Condition'] = initialValues['Condition'] || '$true';
        }
      }
      setCurrentParameterValues(initialValues);
      
      if (!isCommentCommand && !isUserPromptCommand && !isStartLoopCommand && !isEndLoopCommand) {
        const definedParamNames = command.parameters.map(p => p.name);
        const commonParamNames = COMMON_PARAMETERS_LIST.map(p => p.name);

        const existingAdHoc = Object.keys(command.parameterValues)
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
  }, [command, isCommentCommand, isUserPromptCommand, isStartLoopCommand, isEndLoopCommand]);

  const handleValueChange = (paramName: string, value: string) => {
    setCurrentParameterValues(prev => ({ ...prev, [paramName]: value }));
  };

  const handlePrependBlankLineChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === 'boolean') {
      setCurrentParameterValues(prev => ({ ...prev, ['_prependBlankLine']: checked ? 'true' : 'false' }));
    }
  };

  const handleSubmit = () => {
    // For End-Loop commands, there are no parameters to save.
    if (isEndLoopCommand) {
        onOpenChange(false);
        return;
    }
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
  // If it's an End-Loop command, no parameters are editable, effectively making the dialog a no-op or just for confirmation.
  // We could also prevent opening it, but this keeps the click handler consistent.
  if (isEndLoopCommand && isOpen) {
    // Auto-close or show a minimal "No parameters to edit" message if desired.
    // For now, it will just show an empty dialog which the user can cancel.
    // Or better, close it immediately.
    // useEffect(() => { if (isEndLoopCommand && isOpen) onOpenChange(false); }, [isEndLoopCommand, isOpen, onOpenChange]);
  }


  const specificParameters = command.parameters.filter(
        param => !COMMON_PARAMETERS_LIST.some(commonParam => commonParam.name.toLowerCase() === param.name.toLowerCase())
      );

  const getDialogTitle = () => {
    if (isCommentCommand) return 'Edit Comment';
    if (isUserPromptCommand) return 'Edit User Prompt';
    if (isStartLoopCommand || isEndLoopCommand) return `Editing: ${command.name}`;
    return `Edit Parameters for: ${command.name}`;
  };

  const getDialogIcon = () => {
    if (isCommentCommand) return <MessageSquareText className="h-5 w-5 text-primary" />;
    if (isUserPromptCommand) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    if (command.baseCommandId === 'internal-start-foreach-loop') return <Repeat className="h-5 w-5 text-blue-500" />;
    if (command.baseCommandId === 'internal-start-for-loop') return <IterationCcw className="h-5 w-5 text-blue-500" />;
    if (command.baseCommandId === 'internal-start-while-loop') return <ListTree className="h-5 w-5 text-blue-500" />;
    if (command.baseCommandId.startsWith('internal-end-')) return <CornerLeftUp className="h-5 w-5 text-gray-500" />;
    return <Settings2 className="h-5 w-5 text-primary" />;
  };
  
  const getDialogDescription = () => {
    if (isCommentCommand) return 'Edit the text content of the comment. Each new line in the text box will be a new comment line prefixed with #.';
    if (isUserPromptCommand) return 'Edit the text for this user prompt. This prompt is for your reference and will not be included in the generated PowerShell script.';
    if (command.baseCommandId === 'internal-start-foreach-loop') return 'Define the collection to iterate over and the variable for each item.';
    if (command.baseCommandId === 'internal-start-for-loop') return 'Define the initializer, condition, and iterator for the For loop.';
    if (command.baseCommandId === 'internal-start-while-loop') return 'Define the condition that must be true for the While loop to continue.';
    if (isEndLoopCommand) return 'This command marks the end of a loop. It has no configurable parameters.';
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
            
            {isStartLoopCommand && (
                <div className="space-y-4">
                    {command.parameters.map((param) => (
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

            {isEndLoopCommand && (
                <p className="text-sm text-muted-foreground pl-1">This loop-ending command has no parameters to configure.</p>
            )}


            {!isCommentCommand && !isUserPromptCommand && !isStartLoopCommand && !isEndLoopCommand && specificParameters.length > 0 && (
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
            {!isCommentCommand && !isUserPromptCommand && !isStartLoopCommand && !isEndLoopCommand && specificParameters.length === 0 && !adHocParams.length && (
                 <p className="text-xs text-muted-foreground pl-1">This command has no specific or custom parameters defined. You can add custom parameters below or use common parameters.</p>
            )}

            {!isCommentCommand && !isUserPromptCommand && !isStartLoopCommand && !isEndLoopCommand && (
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
          {!isEndLoopCommand && <Button onClick={handleSubmit} className="text-xs">Save Changes</Button>}
          {isEndLoopCommand && <Button onClick={handleSubmit} className="text-xs">Close</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

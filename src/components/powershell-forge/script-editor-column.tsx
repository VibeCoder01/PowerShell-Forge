
'use client';

import React, { useState } from 'react';
import type { BasePowerShellCommand, ScriptElement, ScriptType, ScriptPowerShellCommand, RawScriptLine } from '@/types/powershell';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import type { LucideIcon } from 'lucide-react';
import { Trash2, GripVertical } from 'lucide-react';
import { ParameterEditDialog } from './parameter-edit-dialog';
import { ScriptCommandChip } from './script-command-chip';
import { generateUniqueId } from '@/lib/utils';
import { cn } from '@/lib/utils';

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
  const [isDraggingOverColumn, setIsDraggingOverColumn] = useState(false);
  const { toast } = useToast();

  const [editingCommand, setEditingCommand] = useState<ScriptPowerShellCommand | null>(null);
  const [showParameterDialog, setShowParameterDialog] = useState(false);

  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [dropTargetInfo, setDropTargetInfo] = useState<{ targetId: string; position: 'before' | 'after' } | null>(null);
  const [isDraggingOverItem, setIsDraggingOverItem] = useState<string | null>(null);
  const [dragOperationType, setDragOperationType] = useState<'copy' | 'move' | null>(null);


  const handleDragStartReorder = (e: React.DragEvent<HTMLDivElement>, instanceId: string) => {
    const element = scriptElements.find(el => el.instanceId === instanceId);
    if (element) {
      e.dataTransfer.setData('application/json', JSON.stringify(element)); // For copying to other columns
    }
    e.dataTransfer.setData('text/x-powershell-forge-reorder-item', instanceId);
    e.dataTransfer.setData('text/x-powershell-forge-reorder-source-type', scriptType);
    e.dataTransfer.effectAllowed = 'copyMove'; // Allow both copy (to other columns) and move (within this column)
    setDraggingItemId(instanceId);
  };

  const handleDragOverReorderTarget = (e: React.DragEvent<HTMLDivElement>, targetInstanceId: string) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const isTopHalf = e.clientY < rect.top + rect.height / 2;
    const position = isTopHalf ? 'before' : 'after';

    let currentDropEffect: 'copy' | 'move' = 'move'; // Default for reorder target
    
    if (draggingItemId) { // Item from a script column is being dragged
        const tempSourceType = e.dataTransfer.getData('text/x-powershell-forge-reorder-source-type') as ScriptType;
        if (tempSourceType && tempSourceType !== scriptType) {
            currentDropEffect = 'copy';
        } else {
            currentDropEffect = 'move';
        }
    } else if (e.dataTransfer.types.includes('application/json')) { // New item from command browser
        currentDropEffect = 'copy';
    }
    
    e.dataTransfer.dropEffect = currentDropEffect;
    setDragOperationType(currentDropEffect);
    setDropTargetInfo({ targetId: targetInstanceId, position });
    setIsDraggingOverItem(targetInstanceId);
  };

  const handleDragLeaveReorderTarget = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      if (dropTargetInfo && dropTargetInfo.targetId === (e.currentTarget.dataset.instanceId || isDraggingOverItem)) {
        setDropTargetInfo(null);
      }
      setIsDraggingOverItem(null);
      // Don't reset dragOperationType here, it's for the column
    }
  };

  const handleDropOnItem = (e: React.DragEvent<HTMLDivElement>, targetInstanceId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const sourceInstanceId = e.dataTransfer.getData('text/x-powershell-forge-reorder-item');
    const sourceScriptType = e.dataTransfer.getData('text/x-powershell-forge-reorder-source-type') as ScriptType;
    const draggedElementJson = e.dataTransfer.getData('application/json');

    if (sourceInstanceId && sourceScriptType && draggedElementJson) { // Item dragged from a script column
        if (sourceScriptType === scriptType && dropTargetInfo && dropTargetInfo.targetId === targetInstanceId) {
            // Reordering within the same column
            const sourceIndex = scriptElements.findIndex(el => el.instanceId === sourceInstanceId);
            let targetElementIndex = scriptElements.findIndex(el => el.instanceId === targetInstanceId);

            if (sourceIndex === -1 || targetElementIndex === -1 || sourceInstanceId === targetInstanceId) {
              // Reset and return if invalid state
            } else {
                const newElements = [...scriptElements];
                const [draggedElement] = newElements.splice(sourceIndex, 1);
                if (sourceIndex < targetElementIndex) {
                  targetElementIndex--;
                }
                if (dropTargetInfo.position === 'before') {
                  newElements.splice(targetElementIndex, 0, draggedElement);
                } else {
                  newElements.splice(targetElementIndex + 1, 0, draggedElement);
                }
                setScriptElements(newElements);
            }
        } else if (sourceScriptType !== scriptType && dropTargetInfo && dropTargetInfo.targetId === targetInstanceId) {
            // Copying from another column and dropping relative to an item in this column
            try {
                const originalElement = JSON.parse(draggedElementJson) as ScriptElement;
                const newCopiedElement: ScriptElement = {
                    ...originalElement,
                    instanceId: generateUniqueId(),
                };
                let targetElementIndex = scriptElements.findIndex(el => el.instanceId === targetInstanceId);
                 const newElements = [...scriptElements];
                if (dropTargetInfo.position === 'before') {
                    newElements.splice(targetElementIndex, 0, newCopiedElement);
                } else { 
                    newElements.splice(targetElementIndex + 1, 0, newCopiedElement);
                }
                setScriptElements(newElements);
                toast({
                    title: 'Element Copied',
                    description: `${(newCopiedElement as ScriptPowerShellCommand).name || 'Element'} copied to ${title} script.`,
                });
            } catch (error) {
                console.error('Failed to parse dropped JSON for copy onto item:', error);
                toast({ variant: 'destructive', title: 'Copy Error', description: 'Could not copy the element.' });
            }
        }
    } else if (!sourceInstanceId && draggedElementJson && dropTargetInfo && dropTargetInfo.targetId === targetInstanceId) {
        // New command from Command Browser dropped onto an existing item (to insert before/after)
        try {
            const baseCommand = JSON.parse(draggedElementJson) as BasePowerShellCommand;
            let initialParameterValues = baseCommand.parameters.reduce((acc, param) => { acc[param.name] = ''; return acc; }, {} as { [key: string]: string });
            if (baseCommand.id === 'internal-add-comment') {
                initialParameterValues['CommentText'] = 'Your comment here';
                initialParameterValues['_prependBlankLine'] = 'true';
            } else if (baseCommand.id === 'internal-user-prompt') {
                initialParameterValues['PromptText'] = 'ACTION NEEDED: [Your prompt text here]';
            }
            const newScriptCommand: ScriptPowerShellCommand = {
                instanceId: generateUniqueId(), type: 'command', name: baseCommand.name,
                parameters: baseCommand.parameters, parameterValues: initialParameterValues, baseCommandId: baseCommand.id,
            };
            let targetElementIndex = scriptElements.findIndex(el => el.instanceId === targetInstanceId);
            const newElements = [...scriptElements];
            if (dropTargetInfo.position === 'before') {
                newElements.splice(targetElementIndex, 0, newScriptCommand);
            } else {
                newElements.splice(targetElementIndex + 1, 0, newScriptCommand);
            }
            setScriptElements(newElements);
            toast({
                title: baseCommand.id === 'internal-add-comment' ? 'Comment Added' : (baseCommand.id === 'internal-user-prompt' ? 'User Prompt Added' : 'Command Added'),
                description: `${baseCommand.name} added to ${title} script. Click to edit.`,
            });
        } catch (error) {
             console.error('Failed to parse dropped data for new command (on item):', error);
             toast({ variant: 'destructive', title: 'Drop Error', description: 'Could not add element.'});
        }
    }

    setDraggingItemId(null);
    setDropTargetInfo(null);
    setIsDraggingOverItem(null);
    setDragOperationType(null);
  };

  const handleDragEndReorder = () => {
    setDraggingItemId(null);
    setDropTargetInfo(null);
    setIsDraggingOverItem(null);
    setDragOperationType(null);
  };

  const handleDropOnColumnContent = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const reorderSourceId = e.dataTransfer.getData('text/x-powershell-forge-reorder-item');
    const reorderSourceType = e.dataTransfer.getData('text/x-powershell-forge-reorder-source-type') as ScriptType;
    const draggedElementJson = e.dataTransfer.getData('application/json');

    if (reorderSourceId && reorderSourceType && draggedElementJson) { // Item dragged from a script column
        if (reorderSourceType === scriptType) { // Reordering within the same column (to the end)
            const sourceIndex = scriptElements.findIndex(el => el.instanceId === reorderSourceId);
            if (sourceIndex !== -1) {
                const newElements = [...scriptElements];
                const [draggedElementItem] = newElements.splice(sourceIndex, 1);
                newElements.push(draggedElementItem);
                setScriptElements(newElements);
                toast({ title: 'Item Moved', description: 'Item moved to the end of the script.' });
            }
        } else { // Copying from another column to the end of this column
            try {
                const originalElement = JSON.parse(draggedElementJson) as ScriptElement;
                const newCopiedElement: ScriptElement = {
                    ...originalElement,
                    instanceId: generateUniqueId(), 
                };
                setScriptElements(prev => [...prev, newCopiedElement]);
                toast({
                    title: 'Element Copied',
                    description: `${(newCopiedElement as ScriptPowerShellCommand).name || 'Element'} copied to ${title} script.`,
                });
            } catch (error) {
                console.error('Failed to parse dropped JSON for copy to column end:', error);
                toast({ variant: 'destructive', title: 'Copy Error', description: 'Could not copy the element.' });
            }
        }
    } else if (draggedElementJson) { // New command dropped from Command Browser
        try {
            const baseCommand = JSON.parse(draggedElementJson) as BasePowerShellCommand;
            let initialParameterValues = baseCommand.parameters.reduce((acc, param) => { acc[param.name] = ''; return acc; }, {} as { [key: string]: string });
            if (baseCommand.id === 'internal-add-comment') {
                initialParameterValues['CommentText'] = 'Your comment here';
                initialParameterValues['_prependBlankLine'] = 'true';
            } else if (baseCommand.id === 'internal-user-prompt') {
                initialParameterValues['PromptText'] = 'ACTION NEEDED: [Your prompt text here]';
            }
            const newScriptCommand: ScriptPowerShellCommand = {
                instanceId: generateUniqueId(), type: 'command', name: baseCommand.name,
                parameters: baseCommand.parameters, parameterValues: initialParameterValues, baseCommandId: baseCommand.id,
            };
            setScriptElements(prev => [...prev, newScriptCommand]);
            toast({
                title: baseCommand.id === 'internal-add-comment' ? 'Comment Added' : (baseCommand.id === 'internal-user-prompt' ? 'User Prompt Added' : 'Command Added'),
                description: `${baseCommand.name} added to ${title} script. Click to edit.`,
            });
        } catch (error) {
            console.error('Failed to parse dropped data for new command (on column):', error);
            toast({ variant: 'destructive', title: 'Drop Error', description: 'Could not add element.'});
        }
    }

    setIsDraggingOverColumn(false);
    setDragOperationType(null);
    setDraggingItemId(null);
    setDropTargetInfo(null);
    setIsDraggingOverItem(null);
  };

  const handleDragOverColumnContent = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const isReorderItemDragged = e.dataTransfer.types.includes('text/x-powershell-forge-reorder-item');
    const isNewCommandDragged = e.dataTransfer.types.includes('application/json') && !isReorderItemDragged;

    let currentOperation: 'copy' | 'move' | null = null;

    if (isNewCommandDragged) {
        e.dataTransfer.dropEffect = 'copy';
        currentOperation = 'copy';
    } else if (isReorderItemDragged) {
        const tempSourceType = e.dataTransfer.getData('text/x-powershell-forge-reorder-source-type') as ScriptType;
        if (tempSourceType && tempSourceType !== scriptType) {
            e.dataTransfer.dropEffect = 'copy';
            currentOperation = 'copy';
        } else if (tempSourceType && tempSourceType === scriptType) {
            e.dataTransfer.dropEffect = 'move';
            currentOperation = 'move';
        } else { 
             if (e.dataTransfer.effectAllowed.includes('copy')) currentOperation = 'copy';
             else if (e.dataTransfer.effectAllowed.includes('move')) currentOperation = 'move';
             e.dataTransfer.dropEffect = currentOperation || 'none';
        }
    } else {
        e.dataTransfer.dropEffect = 'none';
    }
    
    setDragOperationType(currentOperation);
    setIsDraggingOverColumn(currentOperation !== null);

    if (currentOperation === 'move' && !isDraggingOverItem) {
        setDropTargetInfo({ targetId: 'column-end', position: 'after' });
    } else if (currentOperation === 'copy' && !isDraggingOverItem) {
        setDropTargetInfo(null); 
    } else if (!isDraggingOverItem) {
        setDropTargetInfo(null);
    }
  };

  const handleDragLeaveColumnContent = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDraggingOverColumn(false);
      setDragOperationType(null);
      if (dropTargetInfo && dropTargetInfo.targetId === 'column-end') {
        setDropTargetInfo(null);
      }
    }
  };

  const handleEditCommand = (command: ScriptPowerShellCommand) => {
    const fullBaseCommand = baseCommands.find(bc => bc.id === command.baseCommandId);
    if (fullBaseCommand) {
        const commandToEdit = { ...command };
        if (commandToEdit.baseCommandId === 'internal-add-comment' && commandToEdit.parameterValues['_prependBlankLine'] === undefined) {
            commandToEdit.parameterValues = { ...commandToEdit.parameterValues, '_prependBlankLine': 'true' };
        }
        if (commandToEdit.baseCommandId === 'internal-user-prompt' && commandToEdit.parameterValues['PromptText'] === undefined) {
             commandToEdit.parameterValues = { ...commandToEdit.parameterValues, 'PromptText': 'ACTION NEEDED: [Your prompt text here]' };
        }
        setEditingCommand({ ...commandToEdit, parameters: fullBaseCommand.parameters });
        setShowParameterDialog(true);
    } else {
        toast({ variant: 'destructive', title: 'Error', description: `Base command definition for "${command.name}" not found.` });
        setEditingCommand(command); // Allow editing even if base not found, might be an old custom one
        setShowParameterDialog(true);
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
    let title = 'Command Updated';
    if (updatedCommand.baseCommandId === 'internal-add-comment') title = 'Comment Updated';
    else if (updatedCommand.baseCommandId === 'internal-user-prompt') title = 'User Prompt Updated';
    toast({title: title, description: `${updatedCommand.name} details saved.`});
  };

  const handleRemoveElement = (instanceId: string) => {
    setScriptElements(prevElements => prevElements.filter(el => el.instanceId !== instanceId));
    toast({title: 'Element Removed', description: 'Script element removed.'});
  };

  return (
    <Card
      className={cn(
        'h-full flex flex-col shadow-xl transition-all duration-200',
        isDraggingOverColumn ? `ring-2 ${dragOperationType === 'copy' ? 'ring-accent' :  'ring-primary'} ring-offset-2` : ''
      )}
      aria-dropeffect={dragOperationType ?? 'none'}
    >
      <CardHeader className="py-4 px-4 border-b">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent
        className="p-0 flex-grow flex flex-col relative"
        onDrop={handleDropOnColumnContent}
        onDragOver={handleDragOverColumnContent}
        onDragLeave={handleDragLeaveColumnContent}
      >
        <ScrollArea className="h-full w-full">
          <div className="p-4 space-y-1 min-h-[200px] font-mono text-xs">
            {scriptElements.length === 0 && !isDraggingOverColumn && (
              <p className="text-muted-foreground text-center py-10 text-xs">Drag commands or comments here...</p>
            )}
            {scriptElements.length === 0 && isDraggingOverColumn && (
              <div className="h-full flex items-center justify-center">
                <div className={`h-1 w-full ${dragOperationType === 'copy' ? 'bg-accent' : 'bg-primary'} my-1 animate-pulse`}></div>
              </div>
            )}

            {scriptElements.map((element) => {
              const isCurrentDropTarget = dropTargetInfo && dropTargetInfo.targetId === element.instanceId;
              const isBeingDragged = draggingItemId === element.instanceId;

              return (
                <React.Fragment key={element.instanceId}>
                  {isCurrentDropTarget && dropTargetInfo.position === 'before' && (
                    <div className={`h-1.5 ${dragOperationType === 'copy' ? 'bg-accent' : 'bg-primary'} rounded-full my-0.5 mx-2 animate-pulse`}></div>
                  )}
                  <div
                    data-instance-id={element.instanceId}
                    draggable={true}
                    onDragStart={(e) => handleDragStartReorder(e, element.instanceId)}
                    onDragEnd={handleDragEndReorder}
                    onDragOver={(e) => handleDragOverReorderTarget(e, element.instanceId)}
                    onDrop={(e) => handleDropOnItem(e, element.instanceId)}
                    onDragLeave={handleDragLeaveReorderTarget}
                    className={cn(
                        "group relative flex items-center py-1 rounded transition-colors",
                        isDraggingOverItem === element.instanceId && !isCurrentDropTarget && 'bg-muted/30',
                        isBeingDragged && 'opacity-50'
                    )}
                  >
                    <GripVertical className="h-5 w-5 text-muted-foreground mr-1 cursor-grab flex-shrink-0" />
                    <div className="flex-grow">
                      {element.type === 'raw' ? (
                        <div className="p-2 border border-transparent rounded break-all font-mono text-xs">
                          {(element as RawScriptLine).content || <span className="text-muted-foreground">[Empty line]</span>}
                        </div>
                      ) : (
                        (() => {
                          const cmdElement = element as ScriptPowerShellCommand;
                          let hasUnsetParameters = false;
                          if (cmdElement.baseCommandId === 'internal-add-comment') {
                             if (!cmdElement.parameterValues['CommentText'] || cmdElement.parameterValues['CommentText'] === 'Your comment here') {
                                hasUnsetParameters = true;
                             }
                          } else if (cmdElement.baseCommandId === 'internal-user-prompt') {
                            if (!cmdElement.parameterValues['PromptText'] || cmdElement.parameterValues['PromptText'] === 'ACTION NEEDED: [Your prompt text here]') {
                                hasUnsetParameters = true;
                            }
                          } else { // For regular commands
                            const hasDefinedParams = cmdElement.parameters && cmdElement.parameters.length > 0;
                            const allValuesAreEmpty = Object.entries(cmdElement.parameterValues)
                                                        .filter(([key]) => !key.startsWith('_')) // Exclude internal flags like _prependBlankLine
                                                        .every(([,val]) => val === '');
                            if (hasDefinedParams && allValuesAreEmpty) {
                              hasUnsetParameters = true;
                            }
                          }
                          return (
                            <ScriptCommandChip
                              command={cmdElement}
                              onClick={() => handleEditCommand(cmdElement)}
                              hasUnsetParameters={hasUnsetParameters}
                            />
                          );
                        })()
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute right-1 top-1/2 -translate-y-1/2 bg-card hover:bg-destructive/20"
                      onClick={() => handleRemoveElement(element.instanceId)}
                      aria-label="Remove script element"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  {isCurrentDropTarget && dropTargetInfo.position === 'after' && (
                     <div className={`h-1.5 ${dragOperationType === 'copy' ? 'bg-accent' : 'bg-primary'} rounded-full my-0.5 mx-2 animate-pulse`}></div>
                  )}
                </React.Fragment>
              );
            })}
            {dropTargetInfo && dropTargetInfo.targetId === 'column-end' && scriptElements.length > 0 && (
                 <div className={`h-1.5 ${dragOperationType === 'copy' ? 'bg-accent' : 'bg-primary'} rounded-full my-0.5 mx-2 animate-pulse`}></div>
            )}
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


'use client';

import React, { useState, useCallback } from 'react';
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
  const [dropTargetInfo, setDropTargetInfo] = useState<{ targetId: string; position: 'before' | 'after'; } | null>(null);
  const [isDraggingOverItem, setIsDraggingOverItem] = useState<string | null>(null);
  const [dragOperationType, setDragOperationType] = useState<'copy' | 'move' | null>(null);


  const handleDragStartReorder = (e: React.DragEvent<HTMLDivElement>, instanceId: string) => {
    const element = scriptElements.find(el => el.instanceId === instanceId);
    if (element) {
      e.dataTransfer.setData('application/json', JSON.stringify(element));
      e.dataTransfer.setData('text/x-powershell-forge-reorder-item', instanceId);
      e.dataTransfer.setData('text/x-powershell-forge-reorder-source-type', scriptType);
      e.dataTransfer.effectAllowed = 'copyMove';
      setDraggingItemId(instanceId);
    }
  };

  const determineDropEffect = (e: React.DragEvent<HTMLDivElement>): 'copy' | 'move' | 'none' => {
    const isReorderItemDragged = e.dataTransfer.types.includes('text/x-powershell-forge-reorder-item');
    const isNewCommandDragged = e.dataTransfer.types.includes('application/json') && !isReorderItemDragged;

    if (isNewCommandDragged) return 'copy';
    if (isReorderItemDragged) {
      const tempSourceType = e.dataTransfer.getData('text/x-powershell-forge-reorder-source-type') as ScriptType;
      return tempSourceType !== scriptType ? 'copy' : 'move';
    }
    return 'none';
  };

  const handleDragOverItem = (e: React.DragEvent<HTMLDivElement>, targetInstanceId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const currentDropEffect = determineDropEffect(e);
    e.dataTransfer.dropEffect = currentDropEffect;
    setDragOperationType(currentDropEffect);

    const rect = e.currentTarget.getBoundingClientRect();
    const isTopHalf = e.clientY < rect.top + rect.height / 2;
    setDropTargetInfo({ targetId: targetInstanceId, position: isTopHalf ? 'before' : 'after' });
    setIsDraggingOverItem(targetInstanceId);
  };
  
  const handleDragLeaveTarget = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropTargetInfo(null);
      setIsDraggingOverItem(null);
    }
  };

  const addElementAtIndex = (
    elements: ScriptElement[],
    newElement: ScriptElement,
    targetId: string | null,
    position: 'before' | 'after'
  ): ScriptElement[] => {
    const newElements = [...elements];
    if (targetId && targetId !== 'column-end') {
      const targetIndex = newElements.findIndex(el => el.instanceId === targetId);
      if (targetIndex !== -1) {
        newElements.splice(position === 'before' ? targetIndex : targetIndex + 1, 0, newElement);
      } else {
        newElements.push(newElement); // Fallback: add to end if target not found
      }
    } else {
      newElements.push(newElement); // Add to end if no targetId or target is 'column-end'
    }
    return newElements;
  };

  const removeElementById = (elements: ScriptElement[], elementId: string): { newElements: ScriptElement[], removedElement: ScriptElement | null } => {
    let removed: ScriptElement | null = null;
    const newElements = elements.filter(el => {
      if (el.instanceId === elementId) {
        removed = el;
        return false;
      }
      return true;
    });
    return { newElements, removedElement: removed };
  };


  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const sourceInstanceId = e.dataTransfer.getData('text/x-powershell-forge-reorder-item');
    const sourceScriptType = e.dataTransfer.getData('text/x-powershell-forge-reorder-source-type') as ScriptType;
    const draggedElementJson = e.dataTransfer.getData('application/json');
    
    if (!dropTargetInfo && !isDraggingOverColumn) {
      resetDragState();
      return;
    }

    let elementToAdd: ScriptElement | null = null;

    if (sourceInstanceId && draggedElementJson) { 
        try {
            const originalElement = JSON.parse(draggedElementJson) as ScriptElement;
            if (sourceScriptType === scriptType && dragOperationType === 'move') {
                // Element will be removed first, then added.
            } else { 
                elementToAdd = { ...originalElement, instanceId: generateUniqueId() };
            }
        } catch (err) { console.error("Error parsing existing element JSON", err); resetDragState(); return; }
    } else if (draggedElementJson) { 
        try {
            const baseCommand = JSON.parse(draggedElementJson) as BasePowerShellCommand;
            const initialParameterValues = baseCommand.parameters.reduce((acc, param) => { acc[param.name] = ''; return acc; }, {} as { [key: string]: string });
            
            if (baseCommand.id.startsWith('internal-start-')) {
                if (baseCommand.id === 'internal-start-foreach-loop') {
                    initialParameterValues['ItemVariable'] = 'item'; 
                    initialParameterValues['InputObject'] = '$collection';
                } else if (baseCommand.id === 'internal-start-for-loop') {
                    initialParameterValues['Initializer'] = '$i = 0';
                    initialParameterValues['Condition'] = '$i -lt 10';
                    initialParameterValues['Iterator'] = '$i++';
                } else if (baseCommand.id === 'internal-start-while-loop') {
                    initialParameterValues['Condition'] = '$true';
                }
            } else if (baseCommand.id === 'internal-add-comment') {
                initialParameterValues['CommentText'] = 'Your comment here';
                initialParameterValues['_prependBlankLine'] = 'true';
            } else if (baseCommand.id === 'internal-user-prompt') {
                initialParameterValues['PromptText'] = 'ACTION NEEDED: [Your prompt text here]';
            }

            elementToAdd = {
                instanceId: generateUniqueId(), type: 'command', name: baseCommand.name,
                parameters: baseCommand.parameters, parameterValues: initialParameterValues,
                baseCommandId: baseCommand.id,
            } as ScriptPowerShellCommand;
        } catch (err) { console.error("Error parsing new command JSON", err); resetDragState(); return; }
    }

    if (!elementToAdd && !(sourceInstanceId && dragOperationType === 'move')) { resetDragState(); return; }

    setScriptElements(prevElements => {
        let currentElements = [...prevElements];
        let elementBeingMoved: ScriptElement | null = null;

        if (sourceInstanceId && dragOperationType === 'move') {
            const removalResult = removeElementById(currentElements, sourceInstanceId);
            currentElements = removalResult.newElements;
            elementBeingMoved = removalResult.removedElement;
            if (!elementBeingMoved) { console.error("Failed to find element to move"); return prevElements; }
            elementToAdd = elementBeingMoved; 
        }
        
        if (!elementToAdd) { return prevElements; } 

        if (dropTargetInfo) {
            return addElementAtIndex(currentElements, elementToAdd, dropTargetInfo.targetId, dropTargetInfo.position);
        }
        
        currentElements.push(elementToAdd); // Add to end if dropped on column or no specific target
        return currentElements;
    });

    toast({ title: 'Element Dropped', description: `${(elementToAdd as ScriptPowerShellCommand).name || 'Item'} processed.` });
    resetDragState();
  };


  const resetDragState = () => {
    setDraggingItemId(null);
    setDropTargetInfo(null);
    setIsDraggingOverItem(null);
    setIsDraggingOverColumn(false);
    setDragOperationType(null);
  };

  const handleDragEndReorder = () => {
    resetDragState();
  };

  const handleDragOverColumnContent = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const currentDropEffect = determineDropEffect(e);
    e.dataTransfer.dropEffect = currentDropEffect;
    setDragOperationType(currentDropEffect);
    setIsDraggingOverColumn(currentDropEffect !== 'none');
    
    if (!isDraggingOverItem && currentDropEffect !== 'none') {
      setDropTargetInfo({ targetId: 'column-end', position: 'after' });
    }
  };
  
  const handleDragLeaveColumnContent = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDraggingOverColumn(false);
      if (dropTargetInfo?.targetId === 'column-end') {
        setDropTargetInfo(null);
      }
    }
  };


  const handleEditCommand = (command: ScriptPowerShellCommand) => {
    const fullBaseCommand = baseCommands.find(bc => bc.id === command.baseCommandId);
    
    if (fullBaseCommand || command.baseCommandId.startsWith('internal-')) {
        const commandToEdit = { ...command };
        if (command.baseCommandId === 'internal-add-comment' && commandToEdit.parameterValues['_prependBlankLine'] === undefined) {
            commandToEdit.parameterValues = { ...commandToEdit.parameterValues, '_prependBlankLine': 'true' };
        }
        if (command.baseCommandId === 'internal-user-prompt' && commandToEdit.parameterValues['PromptText'] === undefined) {
             commandToEdit.parameterValues = { ...commandToEdit.parameterValues, 'PromptText': 'ACTION NEEDED: [Your prompt text here]' };
        }
        if (command.baseCommandId.startsWith('internal-start-')) {
            const baseLoopCmd = baseCommands.find(bc => bc.id === command.baseCommandId);
            if (baseLoopCmd) commandToEdit.parameters = baseLoopCmd.parameters;

            if (command.baseCommandId === 'internal-start-foreach-loop') {
                commandToEdit.parameterValues['ItemVariable'] = commandToEdit.parameterValues['ItemVariable'] || 'item';
                commandToEdit.parameterValues['InputObject'] = commandToEdit.parameterValues['InputObject'] || '$collection';
            } else if (command.baseCommandId === 'internal-start-for-loop') {
                commandToEdit.parameterValues['Initializer'] = commandToEdit.parameterValues['Initializer'] || '$i = 0';
                commandToEdit.parameterValues['Condition'] = commandToEdit.parameterValues['Condition'] || '$i -lt 10';
                commandToEdit.parameterValues['Iterator'] = commandToEdit.parameterValues['Iterator'] || '$i++';
            } else if (command.baseCommandId === 'internal-start-while-loop') {
                commandToEdit.parameterValues['Condition'] = commandToEdit.parameterValues['Condition'] || '$true';
            }
        } else {
            commandToEdit.parameters = fullBaseCommand?.parameters || command.parameters;
        }
        setEditingCommand(commandToEdit);
        setShowParameterDialog(true);
    } else {
        toast({ variant: 'destructive', title: 'Error', description: `Base command definition for "${command.name}" not found.` });
        setEditingCommand(command); 
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
    let toastTitle = 'Item Updated';
    if (updatedCommand.baseCommandId === 'internal-add-comment') toastTitle = 'Comment Updated';
    else if (updatedCommand.baseCommandId === 'internal-user-prompt') toastTitle = 'User Prompt Updated';
    else if (updatedCommand.baseCommandId.startsWith('internal-start-') || updatedCommand.baseCommandId.startsWith('internal-end-')) toastTitle = 'Loop Command Updated';
    else toastTitle = 'Command Updated';
    toast({title: toastTitle, description: `${updatedCommand.name} details saved.`});
  };

  const handleRemoveElementWrapper = (instanceId: string) => {
    setScriptElements(prevElements => removeElementById(prevElements, instanceId).newElements);
    toast({title: 'Element Removed', description: 'Script element removed.'});
  };

  const renderScriptElementsList = (elements: ScriptElement[]): JSX.Element[] => {
    let effectiveIndentLevel = 0; // For visual cues if we decide to add them

    return elements.map((element) => {
      const isCurrentDropTargetItem = dropTargetInfo && dropTargetInfo.targetId === element.instanceId;
      const isBeingDragged = draggingItemId === element.instanceId;
      
      let currentElementVisualIndent = 0;
      if (element.type === 'command') {
          if (element.baseCommandId.startsWith('internal-end-')) {
              if (effectiveIndentLevel > 0) effectiveIndentLevel--; // Decrease after rendering end
              currentElementVisualIndent = effectiveIndentLevel;
          } else {
              currentElementVisualIndent = effectiveIndentLevel;
              if (element.baseCommandId.startsWith('internal-start-')) {
                  effectiveIndentLevel++; // Increase after rendering start
              }
          }
      } else { // RawScriptLine
          currentElementVisualIndent = effectiveIndentLevel;
      }


      const itemDropIndicator = (pos: 'before' | 'after') => (
        isCurrentDropTargetItem && dropTargetInfo!.position === pos &&
        <div className={`h-1.5 ${dragOperationType === 'copy' ? 'bg-accent' : 'bg-primary'} rounded-full my-0.5 mx-2 animate-pulse`} style={{ marginLeft: `${currentElementVisualIndent * 1.5}rem`}}></div>
      );

      return (
        <React.Fragment key={element.instanceId}>
          {itemDropIndicator('before')}
          <div
            data-instance-id={element.instanceId}
            draggable={true}
            onDragStart={(e) => handleDragStartReorder(e, element.instanceId)}
            onDragEnd={handleDragEndReorder}
            onDragOver={(e) => handleDragOverItem(e, element.instanceId)}
            onDrop={handleDrop}
            onDragLeave={handleDragLeaveTarget}
            className={cn(
                "group relative flex items-center py-1 rounded transition-colors",
                isDraggingOverItem === element.instanceId && !isCurrentDropTargetItem && 'bg-muted/30',
                isBeingDragged && 'opacity-50',
                `ml-[${currentElementVisualIndent * 0.5}rem]` // Basic visual indent for demo
            )}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground mr-1 cursor-grab flex-shrink-0" />
            <div className="flex-grow">
              {element.type === 'raw' ? (
                <div className="p-2 border border-transparent rounded break-all font-mono text-xs">
                  {(element as RawScriptLine).content || <span className="text-muted-foreground">[Empty line]</span>}
                </div>
              ) : ( // 'command' type
                (() => {
                  const cmdElement = element as ScriptPowerShellCommand;
                  let hasUnset = false;
                  if (cmdElement.baseCommandId === 'internal-add-comment') {
                     if (!cmdElement.parameterValues['CommentText'] || cmdElement.parameterValues['CommentText'] === 'Your comment here') {
                        hasUnset = true;
                     }
                  } else if (cmdElement.baseCommandId === 'internal-user-prompt') {
                    if (!cmdElement.parameterValues['PromptText'] || cmdElement.parameterValues['PromptText'] === 'ACTION NEEDED: [Your prompt text here]') {
                        hasUnset = true;
                    }
                  } else if (cmdElement.baseCommandId.startsWith('internal-start-')) {
                    // Check specific required parameters for each start loop type
                    if (cmdElement.baseCommandId === 'internal-start-foreach-loop' && (!cmdElement.parameterValues['InputObject'] || !cmdElement.parameterValues['ItemVariable'])) hasUnset = true;
                    else if (cmdElement.baseCommandId === 'internal-start-for-loop' && (!cmdElement.parameterValues['Initializer'] || !cmdElement.parameterValues['Condition'] || !cmdElement.parameterValues['Iterator'])) hasUnset = true;
                    else if (cmdElement.baseCommandId === 'internal-start-while-loop' && !cmdElement.parameterValues['Condition']) hasUnset = true;
                  } else if (!cmdElement.baseCommandId.startsWith('internal-end-')) {
                    const hasDefinedParams = cmdElement.parameters && cmdElement.parameters.length > 0;
                    const allValuesAreEmpty = Object.entries(cmdElement.parameterValues)
                                                .filter(([key]) => !key.startsWith('_') && cmdElement.parameters.some(p => p.name === key))
                                                .every(([,val]) => val === '');
                    if (hasDefinedParams && allValuesAreEmpty) {
                      hasUnset = true;
                    }
                  }
                  return (
                    <ScriptCommandChip
                      command={cmdElement}
                      onClick={() => handleEditCommand(cmdElement)}
                      hasUnsetParameters={hasUnset}
                    />
                  );
                })()
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute right-1 top-1/2 -translate-y-1/2 bg-card hover:bg-destructive/20"
              onClick={() => handleRemoveElementWrapper(element.instanceId)}
              aria-label="Remove script element"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          {itemDropIndicator('after')}
        </React.Fragment>
      );
    });
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
        onDrop={handleDrop}
        onDragOver={handleDragOverColumnContent}
        onDragLeave={handleDragLeaveColumnContent}
      >
        <ScrollArea className="h-full w-full">
          <div className="p-4 space-y-1 min-h-[200px] font-mono text-xs">
            {scriptElements.length === 0 && !isDraggingOverColumn && (
              <p className="text-muted-foreground text-center py-10 text-xs">Drag commands here...</p>
            )}
            {scriptElements.length === 0 && isDraggingOverColumn && (
              <div className="h-full flex items-center justify-center">
                <div className={`h-1 w-full ${dragOperationType === 'copy' ? 'bg-accent' :  'bg-primary'} my-1 animate-pulse`}></div>
              </div>
            )}

            {renderScriptElementsList(scriptElements)}

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

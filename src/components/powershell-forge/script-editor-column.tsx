
'use client';

import React, { useState, useCallback } from 'react';
import type { BasePowerShellCommand, ScriptElement, ScriptType, ScriptPowerShellCommand, RawScriptLine, LoopScriptElement } from '@/types/powershell';
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

// Recursive helper to find an element and its parent array + index
const findElementRecursive = (
  elements: ScriptElement[],
  instanceId: string
): { element: ScriptElement; parentArray: ScriptElement[]; index: number } | null => {
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (el.instanceId === instanceId) {
      return { element: el, parentArray: elements, index: i };
    }
    if (el.type === 'loop' && el.children) {
      const foundInChildren = findElementRecursive(el.children, instanceId);
      if (foundInChildren) {
        return foundInChildren;
      }
    }
  }
  return null;
};

// Recursive helper to update elements immutably
const updateElementsRecursive = (
  elements: ScriptElement[],
  updateFn: (el: ScriptElement) => ScriptElement
): ScriptElement[] => {
  return elements.map(el => {
    const updatedEl = updateFn(el);
    if (updatedEl.type === 'loop' && updatedEl.children) {
      return { ...updatedEl, children: updateElementsRecursive(updatedEl.children, updateFn) };
    }
    return updatedEl;
  });
};


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

  const [editingCommand, setEditingCommand] = useState<ScriptPowerShellCommand | LoopScriptElement | null>(null);
  const [showParameterDialog, setShowParameterDialog] = useState(false);

  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [dropTargetInfo, setDropTargetInfo] = useState<{ targetId: string; position: 'before' | 'after' | 'inside'; parentLoopId?: string } | null>(null);
  const [isDraggingOverItem, setIsDraggingOverItem] = useState<string | null>(null); // For item hover
  const [isDraggingOverLoopContent, setIsDraggingOverLoopContent] = useState<string | null>(null); // For loop content area hover
  const [dragOperationType, setDragOperationType] = useState<'copy' | 'move' | null>(null);


  const handleDragStartReorder = (e: React.DragEvent<HTMLDivElement>, instanceId: string) => {
    const findResult = findElementRecursive(scriptElements, instanceId);
    if (findResult) {
      e.dataTransfer.setData('application/json', JSON.stringify(findResult.element));
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

  const handleDragOverItemOrLoopHeader = (e: React.DragEvent<HTMLDivElement>, targetInstanceId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const currentDropEffect = determineDropEffect(e);
    e.dataTransfer.dropEffect = currentDropEffect;
    setDragOperationType(currentDropEffect);

    const rect = e.currentTarget.getBoundingClientRect();
    const isTopHalf = e.clientY < rect.top + rect.height / 2;
    setDropTargetInfo({ targetId: targetInstanceId, position: isTopHalf ? 'before' : 'after' });
    setIsDraggingOverItem(targetInstanceId);
    setIsDraggingOverLoopContent(null); // Not over loop content area specifically
  };
  
  const handleDragOverLoopContentArea = (e: React.DragEvent<HTMLDivElement>, loopInstanceId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const currentDropEffect = determineDropEffect(e);
    e.dataTransfer.dropEffect = currentDropEffect;
    setDragOperationType(currentDropEffect);
    setDropTargetInfo({ targetId: loopInstanceId, position: 'inside', parentLoopId: loopInstanceId });
    setIsDraggingOverLoopContent(loopInstanceId);
    setIsDraggingOverItem(null); // Not over a specific item's header
  };
  
  const handleDragLeaveTarget = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropTargetInfo(null);
      setIsDraggingOverItem(null);
      setIsDraggingOverLoopContent(null);
      // Do not reset dragOperationType here, it's for the column level or overall operation
    }
  };

   const addElement = (
    elements: ScriptElement[],
    newElement: ScriptElement,
    targetId: string | null, // null means add to end of top level or specified parentLoopId
    position: 'before' | 'after' | 'inside',
    parentLoopId?: string
  ): ScriptElement[] => {
    if (parentLoopId) { // Adding inside a loop
      return elements.map(el => {
        if (el.instanceId === parentLoopId && el.type === 'loop') {
          const newChildren = [...(el.children || [])];
          if (targetId && position !== 'inside') { // Dropping relative to an item inside the loop
            const childIndex = newChildren.findIndex(child => child.instanceId === targetId);
            if (childIndex !== -1) {
              newChildren.splice(position === 'before' ? childIndex : childIndex + 1, 0, newElement);
            } else { // Fallback: add to end of children if target not found
              newChildren.push(newElement);
            }
          } else { // Dropping directly into loop content area or if targetId is the loop itself for 'inside'
            newChildren.push(newElement);
          }
          return { ...el, children: newChildren };
        }
        if (el.type === 'loop' && el.children) { // Recurse for nested loops
          return { ...el, children: addElement(el.children, newElement, targetId, position, el.instanceId === parentLoopId ? parentLoopId : undefined) };
        }
        return el;
      });
    }

    // Adding to top level
    const newElements = [...elements];
    if (targetId && position !== 'inside' && targetId !== 'column-end') {
      const targetIndex = newElements.findIndex(el => el.instanceId === targetId);
      if (targetIndex !== -1) {
        newElements.splice(position === 'before' ? targetIndex : targetIndex + 1, 0, newElement);
      } else {
        newElements.push(newElement); // Fallback
      }
    } else {
      newElements.push(newElement);
    }
    return newElements;
  };

  const removeElement = (elements: ScriptElement[], elementId: string): { newElements: ScriptElement[], removedElement: ScriptElement | null } => {
    let removed: ScriptElement | null = null;
    const recurse = (currentElements: ScriptElement[]): ScriptElement[] => {
      return currentElements.filter(el => {
        if (el.instanceId === elementId) {
          removed = el;
          return false;
        }
        if (el.type === 'loop' && el.children) {
          const result = removeElement(el.children, elementId);
          el.children = result.newElements;
          if (result.removedElement && !removed) removed = result.removedElement;
        }
        return true;
      });
    };
    const newElements = recurse(elements);
    return { newElements, removedElement: removed };
  };


  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const sourceInstanceId = e.dataTransfer.getData('text/x-powershell-forge-reorder-item');
    const sourceScriptType = e.dataTransfer.getData('text/x-powershell-forge-reorder-source-type') as ScriptType;
    const draggedElementJson = e.dataTransfer.getData('application/json');
    
    if (!dropTargetInfo && !isDraggingOverColumn) { // Dropped outside valid area
      resetDragState();
      return;
    }

    let elementToAdd: ScriptElement | null = null;

    // 1. Parse or prepare the element being dropped
    if (sourceInstanceId && draggedElementJson) { // Existing element from a script column
        try {
            const originalElement = JSON.parse(draggedElementJson) as ScriptElement;
            if (sourceScriptType === scriptType && dragOperationType === 'move') { // Move within same column
                // Element will be removed first, then added.
            } else { // Copy from another column or new command
                elementToAdd = { ...originalElement, instanceId: generateUniqueId() };
                 if (elementToAdd.type === 'loop' && (elementToAdd as LoopScriptElement).children) {
                    // Deep clone children with new instanceIds if copying a loop
                    const cloneChildren = (children: ScriptElement[]): ScriptElement[] => 
                        children.map(child => {
                            const newChild = {...child, instanceId: generateUniqueId()};
                            if (newChild.type === 'loop' && newChild.children) {
                                newChild.children = cloneChildren(newChild.children);
                            }
                            return newChild;
                        });
                    (elementToAdd as LoopScriptElement).children = cloneChildren((elementToAdd as LoopScriptElement).children);
                }
            }
        } catch (err) { console.error("Error parsing existing element JSON", err); resetDragState(); return; }
    } else if (draggedElementJson) { // New command from Command Browser
        try {
            const baseCommand = JSON.parse(draggedElementJson) as BasePowerShellCommand;
            const initialParameterValues = baseCommand.parameters.reduce((acc, param) => { acc[param.name] = ''; return acc; }, {} as { [key: string]: string });
            
            if (baseCommand.isLoop) {
                if (baseCommand.id === 'internal-foreach-loop') {
                    initialParameterValues['ItemVariable'] = 'item'; 
                    initialParameterValues['InputObject'] = '$collection';
                } else if (baseCommand.id === 'internal-for-loop') {
                    initialParameterValues['Initializer'] = '$i = 0';
                    initialParameterValues['Condition'] = '$i -lt 10';
                    initialParameterValues['Iterator'] = '$i++';
                } else if (baseCommand.id === 'internal-while-loop') {
                    initialParameterValues['Condition'] = '$true';
                }
                elementToAdd = {
                    instanceId: generateUniqueId(), type: 'loop', baseCommandId: baseCommand.id as LoopScriptElement['baseCommandId'],
                    name: baseCommand.name, parameters: baseCommand.parameters,
                    parameterValues: initialParameterValues, children: []
                };
            } else {
                 if (baseCommand.id === 'internal-add-comment') {
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
            }
        } catch (err) { console.error("Error parsing new command JSON", err); resetDragState(); return; }
    }

    if (!elementToAdd && !(sourceInstanceId && dragOperationType === 'move')) { resetDragState(); return; }

    setScriptElements(prevElements => {
        let currentElements = [...prevElements];
        let elementBeingMoved: ScriptElement | null = null;

        // If moving, remove the original element first
        if (sourceInstanceId && dragOperationType === 'move') {
            const removalResult = removeElement(currentElements, sourceInstanceId);
            currentElements = removalResult.newElements;
            elementBeingMoved = removalResult.removedElement;
            if (!elementBeingMoved) { console.error("Failed to find element to move"); return prevElements; } // Should not happen
            elementToAdd = elementBeingMoved; // Use the actual removed element
        }
        
        if (!elementToAdd) { return prevElements; } // Safety check

        // Add the element to its new position
        if (dropTargetInfo) {
            if (dropTargetInfo.position === 'inside' && dropTargetInfo.parentLoopId) {
                 // Add to children of parentLoopId
                return addElement(currentElements, elementToAdd, null, 'inside', dropTargetInfo.parentLoopId);
            } else if (dropTargetInfo.targetId && dropTargetInfo.targetId !== 'column-end') {
                 // Add before/after a specific item (could be top-level or nested)
                // Find the parent array of the target item to correctly determine if we're dropping into a nested context
                const findTargetInTree = (elementsToSearch: ScriptElement[], targetId: string): {parentArray: ScriptElement[], parentLoopId?: string} | null => {
                    for (const el of elementsToSearch) {
                        if (el.instanceId === targetId) return {parentArray: elementsToSearch};
                        if (el.type === 'loop' && el.children) {
                            const found = findTargetInTree(el.children, targetId);
                            if (found) return {parentArray: found.parentArray, parentLoopId: el.instanceId};
                        }
                    }
                    return null;
                };
                const targetContext = findTargetInTree(currentElements, dropTargetInfo.targetId);
                return addElement(currentElements, elementToAdd, dropTargetInfo.targetId, dropTargetInfo.position, targetContext?.parentLoopId);
            }
        }
        // Default: add to end of top-level scriptElements if dropped on column or no specific target
        currentElements.push(elementToAdd);
        return currentElements;
    });

    toast({ title: 'Element Dropped', description: `${(elementToAdd as any).name || 'Item'} processed.` });
    resetDragState();
  };


  const resetDragState = () => {
    setDraggingItemId(null);
    setDropTargetInfo(null);
    setIsDraggingOverItem(null);
    setIsDraggingOverLoopContent(null);
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
    
    // If dragging over column content (not a specific item or loop area), target is end of column
    if (!isDraggingOverItem && !isDraggingOverLoopContent && currentDropEffect !== 'none') {
      setDropTargetInfo({ targetId: 'column-end', position: 'after' });
    }
  };
  
  const handleDragLeaveColumnContent = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDraggingOverColumn(false);
      // Only reset column-end target if truly leaving column
      if (dropTargetInfo?.targetId === 'column-end') {
        setDropTargetInfo(null);
      }
      // Don't reset dragOperationType here, as it might still be active over an item
    }
  };


  const handleEditCommand = (command: ScriptPowerShellCommand | LoopScriptElement) => {
    const fullBaseCommand = baseCommands.find(bc => bc.id === command.baseCommandId);
    
    if (command.type === 'loop' || (command.type === 'command' && fullBaseCommand)) {
        const commandToEdit = { ...command };
        if (command.type === 'command') {
            if (command.baseCommandId === 'internal-add-comment' && commandToEdit.parameterValues['_prependBlankLine'] === undefined) {
                commandToEdit.parameterValues = { ...commandToEdit.parameterValues, '_prependBlankLine': 'true' };
            }
            if (command.baseCommandId === 'internal-user-prompt' && commandToEdit.parameterValues['PromptText'] === undefined) {
                 commandToEdit.parameterValues = { ...commandToEdit.parameterValues, 'PromptText': 'ACTION NEEDED: [Your prompt text here]' };
            }
            commandToEdit.parameters = fullBaseCommand?.parameters || command.parameters; // Ensure parameters are fresh from base
        } else if (command.type === 'loop') {
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

  const handleSaveEditedCommand = (updatedCommand: ScriptPowerShellCommand | LoopScriptElement) => {
    setScriptElements(prevElements => 
        updateElementsRecursive(prevElements, el => 
            el.instanceId === updatedCommand.instanceId ? updatedCommand : el
        )
    );
    setShowParameterDialog(false);
    setEditingCommand(null);
    let toastTitle = 'Item Updated';
    if (updatedCommand.type === 'command') {
        if (updatedCommand.baseCommandId === 'internal-add-comment') toastTitle = 'Comment Updated';
        else if (updatedCommand.baseCommandId === 'internal-user-prompt') toastTitle = 'User Prompt Updated';
        else toastTitle = 'Command Updated';
    } else if (updatedCommand.type === 'loop') {
        toastTitle = 'Loop Updated';
    }
    toast({title: toastTitle, description: `${updatedCommand.name} details saved.`});
  };

  const handleRemoveElementWrapper = (instanceId: string) => {
    setScriptElements(prevElements => removeElement(prevElements, instanceId).newElements);
    toast({title: 'Element Removed', description: 'Script element removed.'});
  };

  const renderScriptElements = (elements: ScriptElement[], depth = 0): JSX.Element[] => {
    return elements.map((element) => {
      const isCurrentDropTargetItem = dropTargetInfo && dropTargetInfo.targetId === element.instanceId && dropTargetInfo.position !== 'inside';
      const isCurrentDropTargetLoopContent = dropTargetInfo && dropTargetInfo.targetId === element.instanceId && dropTargetInfo.position === 'inside';
      const isBeingDragged = draggingItemId === element.instanceId;
      const itemDropIndicator = (pos: 'before' | 'after') => (
        isCurrentDropTargetItem && dropTargetInfo!.position === pos &&
        <div className={`h-1.5 ${dragOperationType === 'copy' ? 'bg-accent' : 'bg-primary'} rounded-full my-0.5 mx-2 animate-pulse`} style={{ marginLeft: `${depth * 1.5}rem`}}></div>
      );

      return (
        <React.Fragment key={element.instanceId}>
          {itemDropIndicator('before')}
          <div
            data-instance-id={element.instanceId}
            draggable={true}
            onDragStart={(e) => handleDragStartReorder(e, element.instanceId)}
            onDragEnd={handleDragEndReorder}
            onDragOver={(e) => handleDragOverItemOrLoopHeader(e, element.instanceId)}
            onDrop={handleDrop}
            onDragLeave={handleDragLeaveTarget}
            className={cn(
                "group relative flex items-center py-1 rounded transition-colors",
                isDraggingOverItem === element.instanceId && !isCurrentDropTargetItem && 'bg-muted/30',
                isBeingDragged && 'opacity-50',
                `ml-[${depth * 1.5}rem]` 
            )}
            style={{ paddingLeft: `${depth * 0.5}rem` }} // Use padding for actual indentation of content, margin for overall placement
          >
            <GripVertical className="h-5 w-5 text-muted-foreground mr-1 cursor-grab flex-shrink-0" />
            <div className="flex-grow">
              {element.type === 'raw' ? (
                <div className="p-2 border border-transparent rounded break-all font-mono text-xs">
                  {(element as RawScriptLine).content || <span className="text-muted-foreground">[Empty line]</span>}
                </div>
              ) : element.type === 'command' ? (
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
                  } else { 
                    const hasDefinedParams = cmdElement.parameters && cmdElement.parameters.length > 0;
                    const allValuesAreEmpty = Object.entries(cmdElement.parameterValues)
                                                .filter(([key]) => !key.startsWith('_') && cmdElement.parameters.some(p => p.name === key))
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
              ) : element.type === 'loop' ? (
                <ScriptCommandChip
                  command={element}
                  onClick={() => handleEditCommand(element)}
                  isLoopContainer={true}
                />
              ) : null}
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
          
          {element.type === 'loop' && (
            <div 
              className={cn(
                "my-1 py-2 rounded-md border border-dashed",
                 isDraggingOverLoopContent === element.instanceId ? (dragOperationType === 'copy' ? 'border-accent bg-accent/10' : 'border-primary bg-primary/10') : 'border-muted-foreground/30',
                `ml-[${(depth + 1) * 1.5}rem]` 
              )}
              style={{ paddingLeft: `${(depth + 1) * 0.5}rem`, minHeight: '2rem' }}
              onDragOver={(e) => handleDragOverLoopContentArea(e, element.instanceId)}
              onDrop={handleDrop}
              onDragLeave={handleDragLeaveTarget}
              data-loop-content-area-for={element.instanceId}
            >
              {element.children && element.children.length > 0 
                ? renderScriptElements(element.children, depth + 1)
                : !isDraggingOverLoopContent && <p className="text-xs text-muted-foreground italic px-2">Loop body is empty. Drag commands here.</p>
              }
              {isCurrentDropTargetLoopContent && (
                 <div className={`h-1.5 ${dragOperationType === 'copy' ? 'bg-accent' : 'bg-primary'} rounded-full my-1 mx-auto animate-pulse w-3/4`}></div>
              )}
            </div>
          )}
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
              <p className="text-muted-foreground text-center py-10 text-xs">Drag commands, comments or loops here...</p>
            )}
            {scriptElements.length === 0 && isDraggingOverColumn && (
              <div className="h-full flex items-center justify-center">
                <div className={`h-1 w-full ${dragOperationType === 'copy' ? 'bg-accent' :  'bg-primary'} my-1 animate-pulse`}></div>
              </div>
            )}

            {renderScriptElements(scriptElements)}

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

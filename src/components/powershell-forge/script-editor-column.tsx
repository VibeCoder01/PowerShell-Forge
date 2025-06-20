
'use client';

import React, { useState } from 'react';
import type { BasePowerShellCommand, ScriptElement, ScriptType, ScriptPowerShellCommand, RawScriptLine } from '@/types/powershell';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import type { LucideIcon } from 'lucide-react';
import { Trash2, GripVertical } from 'lucide-react'; // Added GripVertical
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

  // State for internal drag-and-drop reordering
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [dropTargetInfo, setDropTargetInfo] = useState<{ targetId: string; position: 'before' | 'after' } | null>(null);
  const [isDraggingOverItem, setIsDraggingOverItem] = useState<string | null>(null);


  const handleDragStartNewCommand = (e: React.DragEvent<HTMLDivElement>) => {
    // This handler is for when dragging a NEW command from the browser
    // For reordering existing items, a different handler will be used
  };
  
  const handleDragStartReorder = (e: React.DragEvent<HTMLDivElement>, instanceId: string) => {
    e.dataTransfer.setData('text/x-powershell-forge-reorder-item', instanceId);
    e.dataTransfer.setData('text/x-powershell-forge-reorder-source-type', scriptType);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingItemId(instanceId);
  };

  const handleDragOverReorderTarget = (e: React.DragEvent<HTMLDivElement>, targetInstanceId: string) => {
    e.preventDefault();
    if (draggingItemId && draggingItemId !== targetInstanceId) {
      const rect = e.currentTarget.getBoundingClientRect();
      const isTopHalf = e.clientY < rect.top + rect.height / 2;
      setDropTargetInfo({ targetId: targetInstanceId, position: isTopHalf ? 'before' : 'after' });
      e.dataTransfer.dropEffect = 'move';
      setIsDraggingOverItem(targetInstanceId);
    }
  };
  
  const handleDragLeaveReorderTarget = (e: React.DragEvent<HTMLDivElement>) => {
    // Check if the mouse is truly leaving the element boundaries, not just moving to a child
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        if (dropTargetInfo && dropTargetInfo.targetId === (e.currentTarget.dataset.instanceId || isDraggingOverItem)) {
             setDropTargetInfo(null);
        }
        setIsDraggingOverItem(null);
    }
  };

  const handleDropOnItem = (e: React.DragEvent<HTMLDivElement>, targetInstanceId: string) => {
    e.preventDefault();
    e.stopPropagation(); // Important: stop propagation to prevent CardContent's onDrop
    
    const sourceInstanceId = e.dataTransfer.getData('text/x-powershell-forge-reorder-item');
    const sourceScriptType = e.dataTransfer.getData('text/x-powershell-forge-reorder-source-type') as ScriptType;

    if (sourceInstanceId && sourceScriptType === scriptType && dropTargetInfo && dropTargetInfo.targetId === targetInstanceId) {
      // Reordering within the same column
      const sourceIndex = scriptElements.findIndex(el => el.instanceId === sourceInstanceId);
      let targetElementIndex = scriptElements.findIndex(el => el.instanceId === targetInstanceId);

      if (sourceIndex === -1 || targetElementIndex === -1 || sourceInstanceId === targetInstanceId) {
        setDraggingItemId(null);
        setDropTargetInfo(null);
        setIsDraggingOverItem(null);
        return;
      }
      
      const newElements = [...scriptElements];
      const [draggedElement] = newElements.splice(sourceIndex, 1);
      
      // Adjust target index because splice shifted elements if source was before target
      if (sourceIndex < targetElementIndex) {
        targetElementIndex--;
      }

      if (dropTargetInfo.position === 'before') {
        newElements.splice(targetElementIndex, 0, draggedElement);
      } else { // 'after'
        newElements.splice(targetElementIndex + 1, 0, draggedElement);
      }
      setScriptElements(newElements);
    }

    setDraggingItemId(null);
    setDropTargetInfo(null);
    setIsDraggingOverItem(null);
  };


  const handleDragEndReorder = () => {
    setDraggingItemId(null);
    setDropTargetInfo(null);
    setIsDraggingOverItem(null);
  };


  const handleDropOnColumnContent = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOverColumn(false);
    setIsDraggingOverItem(null); // Clear item-specific highlight

    const reorderSourceId = e.dataTransfer.getData('text/x-powershell-forge-reorder-item');
    const reorderSourceType = e.dataTransfer.getData('text/x-powershell-forge-reorder-source-type') as ScriptType;

    if (reorderSourceId && reorderSourceType === scriptType) {
      // Item dropped onto the main column area (e.g., to move to the end)
      const sourceIndex = scriptElements.findIndex(el => el.instanceId === reorderSourceId);
      if (sourceIndex !== -1) {
        const newElements = [...scriptElements];
        const [draggedElement] = newElements.splice(sourceIndex, 1);
        newElements.push(draggedElement);
        setScriptElements(newElements);
        toast({ title: 'Item Moved', description: 'Item moved to the end of the script.' });
      }
    } else if (e.dataTransfer.types.includes('application/json') && !reorderSourceId) {
      // New command dropped from Command Browser
      try {
        const commandJson = e.dataTransfer.getData('application/json');
        if (!commandJson) return;
        const baseCommand = JSON.parse(commandJson) as BasePowerShellCommand;

        let initialParameterValues = baseCommand.parameters.reduce((acc, param) => {
          acc[param.name] = ''; 
          return acc;
        }, {} as { [key: string]: string });

        if (baseCommand.id === 'internal-add-comment') {
          initialParameterValues['CommentText'] = 'Your comment here';
          initialParameterValues['_prependBlankLine'] = 'true';
        }
        
        const newScriptCommand: ScriptPowerShellCommand = {
          instanceId: generateUniqueId(),
          type: 'command',
          name: baseCommand.name,
          parameters: baseCommand.parameters, 
          parameterValues: initialParameterValues,
          baseCommandId: baseCommand.id,
        };

        setScriptElements(prev => [...prev, newScriptCommand]);
        toast({
          title: baseCommand.id === 'internal-add-comment' ? 'Comment Added' : 'Command Added',
          description: `${baseCommand.name} added to ${title} script. Click to edit.`,
        });

      } catch (error) {
        console.error('Failed to parse dropped data for new command:', error);
        toast({
          variant: 'destructive',
          title: 'Drop Error',
          description: 'Could not add the command/comment. Invalid data.',
        });
      }
    }
    
    setDraggingItemId(null);
    setDropTargetInfo(null);
  };

  const handleDragOverColumnContent = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const isReorderOp = e.dataTransfer.types.includes('text/x-powershell-forge-reorder-item');
    const isNewCommandOp = e.dataTransfer.types.includes('application/json');

    if (isReorderOp) {
      e.dataTransfer.dropEffect = 'move';
      setIsDraggingOverColumn(true);
      // If dragging over column but not a specific item, indicate drop at end
      if (!isDraggingOverItem) {
        setDropTargetInfo({ targetId: 'column-end', position: 'after' }); 
      }
    } else if (isNewCommandOp) {
      e.dataTransfer.dropEffect = 'copy';
      setIsDraggingOverColumn(true);
      setDropTargetInfo(null); // Clear item-specific target for new command drop
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };

  const handleDragLeaveColumnContent = () => {
    setIsDraggingOverColumn(false);
    if (dropTargetInfo && dropTargetInfo.targetId === 'column-end') {
      setDropTargetInfo(null);
    }
  };


  const handleEditCommand = (command: ScriptPowerShellCommand) => {
    const fullBaseCommand = baseCommands.find(bc => bc.id === command.baseCommandId);

    if (fullBaseCommand) {
        const commandToEdit = { ...command };
        if (commandToEdit.baseCommandId === 'internal-add-comment' && commandToEdit.parameterValues['_prependBlankLine'] === undefined) {
            commandToEdit.parameterValues = { ...commandToEdit.parameterValues, '_prependBlankLine': 'true' };
        }
        setEditingCommand({ ...commandToEdit, parameters: fullBaseCommand.parameters });
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
    toast({title: updatedCommand.baseCommandId === 'internal-add-comment' ? 'Comment Updated' : 'Command Updated', description: `${updatedCommand.name} details saved.`});
  };

  const handleRemoveElement = (instanceId: string) => {
    setScriptElements(prevElements => prevElements.filter(el => el.instanceId !== instanceId));
    toast({title: 'Element Removed', description: 'Script element removed.'});
  };

  return (
    <Card 
      className={`h-full flex flex-col shadow-xl transition-all duration-200 ${isDraggingOverColumn ? 'ring-2 ring-primary ring-offset-2' : ''}`}
      aria-dropeffect={isDraggingOverColumn && e.dataTransfer.types.includes('application/json') ? 'copy' : (isDraggingOverColumn ? 'move' : 'none')}
    >
      <CardHeader className="py-4 px-4 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className="h-6 w-6 text-primary" />
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
          <div className="p-4 space-y-1 min-h-[200px] font-mono text-sm">
            {scriptElements.length === 0 && !isDraggingOverColumn && (
              <p className="text-muted-foreground text-center py-10">Drag commands or comments here...</p>
            )}
             {scriptElements.length === 0 && isDraggingOverColumn && e.dataTransfer.types.includes('text/x-powershell-forge-reorder-item') && (
              <div className="h-full flex items-center justify-center">
                <div className="h-1 w-full bg-accent my-1"></div>
              </div>
            )}

            {scriptElements.map((element) => {
              const isCurrentDropTarget = dropTargetInfo && dropTargetInfo.targetId === element.instanceId;
              const isBeingDragged = draggingItemId === element.instanceId;

              return (
                <React.Fragment key={element.instanceId}>
                  {isCurrentDropTarget && dropTargetInfo.position === 'before' && (
                    <div className="h-1.5 bg-accent rounded-full my-0.5 mx-2 animate-pulse"></div>
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
                        <div className="p-2 border border-transparent rounded break-all">
                          {(element as RawScriptLine).content || <span className="text-muted-foreground">[Empty line]</span>}
                        </div>
                      ) : (
                        (() => {
                          const cmdElement = element as ScriptPowerShellCommand;
                          let hasUnsetParameters = false;
                          if (cmdElement.baseCommandId !== 'internal-add-comment') {
                            const hasDefinedParams = cmdElement.parameters && cmdElement.parameters.length > 0;
                            const allValuesAreEmpty = Object.entries(cmdElement.parameterValues)
                                                        .filter(([key]) => !key.startsWith('_'))
                                                        .every(([,val]) => val === '');
                            if (hasDefinedParams && allValuesAreEmpty) {
                              hasUnsetParameters = true;
                            }
                          } else { 
                             if (!cmdElement.parameterValues['CommentText'] || cmdElement.parameterValues['CommentText'] === 'Your comment here') {
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
                    <div className="h-1.5 bg-accent rounded-full my-0.5 mx-2 animate-pulse"></div>
                  )}
                </React.Fragment>
              );
            })}
            {dropTargetInfo && dropTargetInfo.targetId === 'column-end' && scriptElements.length > 0 && (
                 <div className="h-1.5 bg-accent rounded-full my-0.5 mx-2 animate-pulse"></div>
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


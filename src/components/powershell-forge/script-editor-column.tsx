
'use client';

import React, { useState, useCallback, useRef } from 'react';
import type { BasePowerShellCommand, ScriptElement, ScriptType, ScriptPowerShellCommand, RawScriptLine } from '@/types/powershell';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import type { LucideIcon } from 'lucide-react';
import { Trash2, GripVertical, Wand2, Repeat, IterationCcw, ListTree, CornerRightDown, CornerLeftUp } from 'lucide-react';
import { ParameterEditDialog } from './parameter-edit-dialog';
import { ScriptCommandChip } from './script-command-chip';
import { AiScriptGeneratorDialog } from './ai-script-generator-dialog';
import { generateScriptFromDescription } from '@/ai/flows/generate-script-from-description';
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

type DropTargetInfo = {
  targetId: string | null; 
  position: 'before' | 'after';
  isOverLoopHeader?: boolean; 
};


const removeElementByIdRecursive = (
  elements: ScriptElement[],
  elementIdToRemove: string
): { updatedElements: ScriptElement[]; removedEl: ScriptElement | null } => {
  let removedElement: ScriptElement | null = null;

  const findAndRemove = (currentElements: ScriptElement[]): ScriptElement[] => {
    const directMatchIndex = currentElements.findIndex(el => el.instanceId === elementIdToRemove);

    if (directMatchIndex !== -1) {
      removedElement = currentElements[directMatchIndex];
      return [
        ...currentElements.slice(0, directMatchIndex),
        ...currentElements.slice(directMatchIndex + 1),
      ];
    }
    return currentElements;
  };

  const updatedElements = findAndRemove(elements);
  return { updatedElements, removedEl: removedElement };
};

const addElementAtIndexRecursive = (
  elements: ScriptElement[],
  elementToAdd: ScriptElement,
  targetId: string | null,
  position: 'before' | 'after'
): ScriptElement[] => {

  if (!targetId) { 
    return [...elements, elementToAdd];
  }

  const targetIndex = elements.findIndex(el => el.instanceId === targetId);
  if (targetIndex === -1) {
    return [...elements, elementToAdd]; 
  }

  const newElements = [...elements];
  newElements.splice(
    position === 'before' ? targetIndex : targetIndex + 1,
    0,
    elementToAdd
  );
  return newElements;
};


export function ScriptEditorColumn({
  title,
  icon: Icon,
  scriptType,
  scriptElements,
  setScriptElements,
  baseCommands,
}: ScriptEditorColumnProps) {
  const { toast } = useToast();
  const [editingCommand, setEditingCommand] = useState<ScriptPowerShellCommand | null>(null);
  const [showParameterDialog, setShowParameterDialog] = useState(false);
  const [showAiGeneratorDialog, setShowAiGeneratorDialog] = useState(false);

  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [dropTargetInfo, setDropTargetInfo] = useState<DropTargetInfo | null>(null);
  const [isDraggingOverColumn, setIsDraggingOverColumn] = useState(false);
  
  const [visualDragOperationType, setVisualDragOperationType] = useState<'copy' | 'move' | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);


  const handleDragStartReorder = (e: React.DragEvent<HTMLDivElement>, element: ScriptElement) => {
    e.dataTransfer.setData('application/json', JSON.stringify(element));
    e.dataTransfer.setData('text/x-powershell-forge-reorder-item', element.instanceId);
    e.dataTransfer.setData('text/x-powershell-forge-reorder-source-type', scriptType);
    e.dataTransfer.effectAllowed = 'copyMove';
    setDraggingItemId(element.instanceId);
  };
  
  const determineVisualDropEffect = (e: React.DragEvent<HTMLDivElement>): 'copy' | 'move' | 'none' => {
    const isReorderItemDragged = e.dataTransfer.types.includes('text/x-powershell-forge-reorder-item');
    const isNewCommandDragged = e.dataTransfer.types.includes('application/json') && !isReorderItemDragged;

    if (isNewCommandDragged) return 'copy';
    if (isReorderItemDragged) {
      const tempSourceType = e.dataTransfer.getData('text/x-powershell-forge-reorder-source-type') as ScriptType;
      return tempSourceType !== scriptType ? 'copy' : 'move';
    }
    return 'none';
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    targetInstanceId: string | null
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    const visualEffect = determineVisualDropEffect(e);
    e.dataTransfer.dropEffect = visualEffect !== 'none' ? visualEffect : 'copy'; 
    setVisualDragOperationType(visualEffect);

    if (visualEffect === 'none' && !e.dataTransfer.types.includes('application/json')) {
      setDropTargetInfo(null);
      setIsDraggingOverColumn(false);
      return;
    }
    
    setIsDraggingOverColumn(true); 

    if (targetInstanceId) { 
        const rect = e.currentTarget.getBoundingClientRect();
        const isTopHalf = e.clientY < rect.top + rect.height / 2;
        setDropTargetInfo({
            targetId: targetInstanceId,
            position: isTopHalf ? 'before' : 'after',
        });
    } else { 
        setDropTargetInfo({
            targetId: null, 
            position: 'after',
        });
    }
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropTargetInfo(null);
      setIsDraggingOverColumn(false);
      setVisualDragOperationType(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const sourceInstanceId = e.dataTransfer.getData('text/x-powershell-forge-reorder-item');
    const sourceScriptType = e.dataTransfer.getData('text/x-powershell-forge-reorder-source-type') as ScriptType;
    const draggedElementJson = e.dataTransfer.getData('application/json');

    if (!draggedElementJson) {
      resetDragState();
      return;
    }
    
    let actualOperationType: 'copy' | 'move';
    if (sourceInstanceId) { 
        actualOperationType = (sourceScriptType !== scriptType) ? 'copy' : 'move';
    } else { 
        actualOperationType = 'copy';
    }

    let elementToProcess: ScriptElement;
    let originalRemovedElement: ScriptElement | null = null;

    try {
      const parsedElement = JSON.parse(draggedElementJson) as ScriptElement | BasePowerShellCommand;

      if (sourceInstanceId) { 
        elementToProcess = parsedElement as ScriptElement; // For 'move', this is the original object initially.
        if (actualOperationType === 'copy') {
          elementToProcess = { ...parsedElement, instanceId: generateUniqueId() } as ScriptElement;
          if (elementToProcess.type === 'command' && elementToProcess.baseCommandId === 'internal-user-prompt') {
             if (!elementToProcess.parameterValues['PromptText'] || elementToProcess.parameterValues['PromptText'] === 'ACTION NEEDED: [Your prompt text here]') {
                 elementToProcess.parameterValues['PromptText'] = 'ACTION NEEDED: [Your prompt text here]';
             }
           }
        }
      } else { 
        const baseCommand = parsedElement as BasePowerShellCommand;
        const initialParameterValues: { [key: string]: string } = {};
        baseCommand.parameters.forEach(param => {
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
             else {
                initialParameterValues[param.name] = baseCommand.parameterValues?.[param.name] || '';
            }
        });
        
        elementToProcess = {
            instanceId: generateUniqueId(),
            type: 'command',
            name: baseCommand.name,
            parameters: baseCommand.parameters,
            parameterValues: initialParameterValues,
            baseCommandId: baseCommand.id,
        } as ScriptPowerShellCommand;
      }
    } catch (err) {
      console.error("Error processing dropped element JSON", err);
      resetDragState();
      return;
    }

    setScriptElements(prevElements => {
      let currentElements = [...prevElements];

      if (actualOperationType === 'move' && sourceInstanceId) {
        const { updatedElements, removedEl } = removeElementByIdRecursive(currentElements, sourceInstanceId);
        if (removedEl) {
            originalRemovedElement = removedEl;
            currentElements = updatedElements;
            // For a move, elementToProcess is now the actual removed element
            elementToProcess = originalRemovedElement; 
        } else {
          // Element not found in this column (shouldn't happen for intra-column move)
          // Potentially a copy from another column which failed to be identified as such earlier.
          // Let's ensure it gets a new ID if it was supposed to be a move but wasn't found.
          // This safeguards against ID clashes if the earlier logic had a hiccup.
          if(elementToProcess.instanceId === sourceInstanceId) { // if it still has the source ID
            elementToProcess = { ...elementToProcess, instanceId: generateUniqueId() };
          }
          console.warn("Move operation: source element not found for removal from this column.", sourceInstanceId);
        }
      }
      
      let finalTargetId = dropTargetInfo?.targetId;
      let finalPosition = dropTargetInfo?.position || 'after';

      return addElementAtIndexRecursive(currentElements, elementToProcess, finalTargetId, finalPosition);
    });

    const droppedElementName = (elementToProcess.type === 'raw') ? 'Raw line' : elementToProcess.name;
    const operationMessage = actualOperationType === 'move' ? "Element Moved" : "Element Copied";
    toast({ title: operationMessage, description: `${droppedElementName} processed.` });
    resetDragState();
  };

  const resetDragState = () => {
    setDraggingItemId(null);
    setDropTargetInfo(null);
    setIsDraggingOverColumn(false);
    setVisualDragOperationType(null);
  };

  const handleDragEndReorder = () => {
    resetDragState();
  };
  
  const handleEditCommand = (command: ScriptPowerShellCommand) => {
    const baseCmd = baseCommands.find(bc => bc.id === command.baseCommandId);
    const commandToEdit = { ...command };

    if (baseCmd) {
        commandToEdit.parameters = baseCmd.parameters; 
    }
    
    if (commandToEdit.baseCommandId === 'internal-add-comment' && commandToEdit.parameterValues['_prependBlankLine'] === undefined) {
        commandToEdit.parameterValues = { ...commandToEdit.parameterValues, '_prependBlankLine': 'true' };
    }
    if (commandToEdit.baseCommandId === 'internal-user-prompt' && commandToEdit.parameterValues['PromptText'] === undefined) {
        commandToEdit.parameterValues = { ...commandToEdit.parameterValues, 'PromptText': 'ACTION NEEDED: [Your prompt text here]' };
    }
    if (commandToEdit.baseCommandId.startsWith('internal-start-')) {
        const defaultValues: { [key: string]: string } = {};
        if (commandToEdit.baseCommandId === 'internal-start-foreach-loop') {
            defaultValues['ItemVariable'] = commandToEdit.parameterValues?.['ItemVariable'] || 'item';
            defaultValues['InputObject'] = commandToEdit.parameterValues?.['InputObject'] || '$collection';
        } else if (commandToEdit.baseCommandId === 'internal-start-for-loop') {
            defaultValues['Initializer'] = commandToEdit.parameterValues?.['Initializer'] || '$i = 0';
            defaultValues['Condition'] = commandToEdit.parameterValues?.['Condition'] || '$i -lt 10';
            defaultValues['Iterator'] = commandToEdit.parameterValues?.['Iterator'] || '$i++';
        } else if (commandToEdit.baseCommandId === 'internal-start-while-loop') {
            defaultValues['Condition'] = commandToEdit.parameterValues?.['Condition'] || '$true';
        }
        commandToEdit.parameterValues = { ...defaultValues, ...commandToEdit.parameterValues };
    }


    setEditingCommand(commandToEdit);
    setShowParameterDialog(true);
  };

  const handleSaveEditedCommand = (updatedCommand: ScriptPowerShellCommand) => {
    setScriptElements(prevElements => {
        return prevElements.map(el => {
            if (el.instanceId === updatedCommand.instanceId) {
                return updatedCommand;
            }
            return el;
        });
    });
    setShowParameterDialog(false);
    setEditingCommand(null);
    let toastTitle = 'Command Updated';
    if (updatedCommand.baseCommandId === 'internal-add-comment') toastTitle = 'Comment Updated';
    else if (updatedCommand.baseCommandId === 'internal-user-prompt') toastTitle = 'User Prompt Updated';
    else if (updatedCommand.baseCommandId.startsWith('internal-start-')) toastTitle = 'Loop Start Command Updated';
    else if (updatedCommand.baseCommandId.startsWith('internal-end-')) toastTitle = 'Loop End Command Updated';
    
    toast({title: toastTitle, description: `${updatedCommand.name} details saved.`});
  };

  const handleRemoveElementWrapper = (instanceId: string) => {
    setScriptElements(prevElements => removeElementByIdRecursive(prevElements, instanceId).updatedElements);
    toast({title: 'Element Removed', description: 'Script element removed.'});
  };
  
  const handleGenerateScriptWithAI = async (description: string) => {
    try {
      const result = await generateScriptFromDescription({ description });
      const newElements = result.script.split('\n').map(line => ({
        instanceId: generateUniqueId(),
        type: 'raw',
        content: line,
      } as RawScriptLine));
      
      setScriptElements(prev => [...prev, ...newElements]);
      toast({ title: 'AI Script Generated', description: 'Script added to the editor.' });
    } catch (error) {
      console.error('AI script generation failed:', error);
      toast({ variant: 'destructive', title: 'AI Generation Failed', description: 'Could not generate script. Check console for details.' });
    }
  };

  const renderScriptElementsRecursive = (elements: ScriptElement[]): JSX.Element[] => {
    return elements.map((element) => {
      const isCurrentDropTargetItem = dropTargetInfo && dropTargetInfo.targetId === element.instanceId;
      const isBeingDragged = draggingItemId === element.instanceId;
      
      const itemDropIndicator = (pos: 'before' | 'after') => (
        isCurrentDropTargetItem && dropTargetInfo!.position === pos &&
        <div className={`h-1.5 ${visualDragOperationType === 'copy' ? 'bg-accent' : 'bg-primary'} rounded-full my-0.5 mx-2 animate-pulse`}></div>
      );
      
      return (
        <React.Fragment key={element.instanceId}>
          {itemDropIndicator('before')}
          <div
            data-instance-id={element.instanceId}
            draggable={true}
            onDragStart={(e) => handleDragStartReorder(e, element)}
            onDragEnd={handleDragEndReorder}
            onDragOver={(e) => handleDragOver(e, element.instanceId)}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
                "group relative flex items-center py-1 rounded transition-colors",
                isDraggingOverColumn && isCurrentDropTargetItem && 'bg-muted/30',
                isBeingDragged && 'opacity-50',
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
                     const requiredLoopParams: {[key: string]: string[]} = {
                        'internal-start-foreach-loop': ['InputObject', 'ItemVariable'],
                        'internal-start-for-loop': ['Initializer', 'Condition', 'Iterator'],
                        'internal-start-while-loop': ['Condition'],
                     };
                     const paramsToCheck = requiredLoopParams[cmdElement.baseCommandId];
                     if (paramsToCheck && paramsToCheck.some(p => !cmdElement.parameterValues[p])) {
                         hasUnset = true;
                     }
                  } else if (!cmdElement.baseCommandId.startsWith('internal-end-')) {
                    // General check for commands with defined parameters but all values are empty
                    const hasDefinedParams = cmdElement.parameters && cmdElement.parameters.length > 0;
                    const allValuesAreEmpty = Object.entries(cmdElement.parameterValues)
                                                .filter(([key]) => !key.startsWith('_') && cmdElement.parameters.some(p => p.name === key))
                                                .every(([,val]) => !val || val.trim() === '');
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
        (isDraggingOverColumn && !dropTargetInfo?.targetId) ? 
          (visualDragOperationType === 'copy' ? `ring-2 ring-accent ring-offset-2` : `ring-2 ring-primary ring-offset-2`)
          : ''
      )}
      aria-dropeffect={visualDragOperationType ?? 'none'}
    >
      <CardHeader className="py-3 px-4 border-b flex justify-between items-center">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => setShowAiGeneratorDialog(true)} className="text-xs py-1 px-2 h-auto">
            <Wand2 className="mr-1.5 h-3.5 w-3.5" />
            AI Generate
        </Button>
      </CardHeader>
      <CardContent
        className="p-0 flex-grow flex flex-col relative"
        onDragOver={(e) => handleDragOver(e, null)} 
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <ScrollArea className="h-full w-full" viewportRef={scrollAreaRef}>
          <div className="p-4 space-y-1 min-h-[200px] font-mono text-xs">
            {scriptElements.length === 0 && !isDraggingOverColumn && (
              <p className="text-muted-foreground text-center py-10 text-xs">Drag commands here or use AI...</p>
            )}
            {scriptElements.length === 0 && isDraggingOverColumn && !dropTargetInfo?.targetId && (
              <div className="h-full flex items-center justify-center">
                <div className={`h-1.5 w-full ${visualDragOperationType === 'copy' ? 'bg-accent' :  'bg-primary'} my-1 animate-pulse`}></div>
              </div>
            )}
            {renderScriptElementsRecursive(scriptElements)}
            {dropTargetInfo && !dropTargetInfo.targetId && dropTargetInfo.position === 'after' && (
                 <div className={`h-1.5 ${visualDragOperationType === 'copy' ? 'bg-accent' : 'bg-primary'} rounded-full my-0.5 mx-2 animate-pulse`}></div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-2 border-t flex justify-end items-center gap-2">
         <p className="text-xs text-muted-foreground mr-auto">Elements: {scriptElements.length}</p>
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
      <AiScriptGeneratorDialog
        open={showAiGeneratorDialog}
        onOpenChange={setShowAiGeneratorDialog}
        onGenerate={handleGenerateScriptWithAI}
        scriptTypeTitle={title}
      />
    </Card>
  );
}

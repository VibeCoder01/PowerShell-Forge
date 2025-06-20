
'use client';

import type { ScriptPowerShellCommand, LoopScriptElement } from '@/types/powershell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MessageSquareText, AlertTriangle, Repeat, IterationCcw, ListTree } from 'lucide-react'; // Added loop icons

interface ScriptCommandChipProps {
  command: ScriptPowerShellCommand | LoopScriptElement;
  onClick: () => void;
  hasUnsetParameters?: boolean; // Optional for loops, as they might not have "unset" in the same way
  isLoopContainer?: boolean; // True if this chip represents the loop itself
}

export function ScriptCommandChip({ command, onClick, hasUnsetParameters, isLoopContainer = false }: ScriptCommandChipProps) {
  if (command.type === 'command' && command.baseCommandId === 'internal-add-comment') {
    const commentText = command.parameterValues['CommentText'] || '';
    const displayComment = commentText.length > 60 ? commentText.substring(0, 57) + '...' : commentText;
    
    return (
      <Button
        variant="outline"
        className={cn(
          "flex-grow h-auto py-1.5 px-2.5 text-left justify-start items-center shadow-sm hover:shadow-md w-full",
          "border-muted-foreground/30 hover:border-muted-foreground/70 bg-card/50",
           // Highlight if comment is empty or default placeholder
          (hasUnsetParameters && (!commentText || commentText === "Your comment here")) ? "border-amber-500 hover:border-amber-600" : ""
        )}
        onClick={onClick}
        aria-label={`Edit comment: ${commentText}`}
      >
        <div className="flex items-center gap-1.5 w-full">
          <MessageSquareText className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className={cn(
            "font-mono text-xs text-muted-foreground whitespace-pre-wrap break-words",
            (!commentText || commentText === "Your comment here") ? "italic" : ""
          )}>
            {displayComment || "Empty comment. Click to edit."}
          </span>
        </div>
      </Button>
    );
  } else if (command.type === 'command' && command.baseCommandId === 'internal-user-prompt') {
    const promptText = command.parameterValues['PromptText'] || '';
    const defaultPromptText = "ACTION NEEDED: [Your prompt text here]";
    const displayPrompt = promptText.length > 60 ? promptText.substring(0, 57) + '...' : promptText;
    const isEmptyOrPlaceholder = !promptText || promptText === defaultPromptText;

    return (
      <Button
        variant="outline"
        className={cn(
          "flex-grow h-auto py-1.5 px-2.5 text-left justify-start items-center shadow-sm hover:shadow-md w-full",
          "bg-yellow-400 hover:bg-yellow-500 text-yellow-950 border-yellow-500 hover:border-yellow-600",
          (hasUnsetParameters && isEmptyOrPlaceholder) && "ring-2 ring-offset-1 ring-red-500"
        )}
        onClick={onClick}
        aria-label={`Edit user prompt: ${promptText}`}
      >
        <div className="flex items-center gap-1.5 w-full">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className={cn(
            "font-mono text-xs whitespace-pre-wrap break-words",
            isEmptyOrPlaceholder ? "italic" : ""
          )}>
            {displayPrompt || "Empty prompt. Click to edit."}
          </span>
        </div>
      </Button>
    );
  } else if (isLoopContainer && command.type === 'loop') {
    const loopElement = command as LoopScriptElement;
    let Icon = Repeat;
    if (loopElement.baseCommandId === 'internal-for-loop') Icon = IterationCcw;
    if (loopElement.baseCommandId === 'internal-while-loop') Icon = ListTree; // Using ListTree as a placeholder for While

    // Check for unset parameters in loop constructs (simplified check)
    const loopHasUnsetParams = Object.values(loopElement.parameterValues).some(val => val === '');
    
    return (
      <Button
        variant="outline"
        className={cn(
          "flex-grow h-auto py-2 px-3 text-left justify-start items-start flex-col shadow-md hover:shadow-lg w-full",
          "border-blue-500 hover:border-blue-600 bg-blue-500/10" // Distinct styling for loop container
        )}
        onClick={onClick}
        aria-label={`Edit loop: ${loopElement.name}${loopHasUnsetParams ? '. This loop has unset parameters.' : ''}`}
      >
        <div className={cn(
          "font-semibold text-blue-700 flex items-center gap-2",
           loopHasUnsetParams ? "text-destructive" : ""
        )}>
          <Icon className="h-4 w-4" />
          {loopElement.name}
        </div>
        <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-1">
           {Object.entries(loopElement.parameterValues).map(([key, value]) => {
            if (value) {
              return (
                <Badge variant="secondary" key={key} className="font-normal text-xs">
                  <span className="text-blue-600/90">{key}:</span>&nbsp;"{value}"
                </Badge>
              );
            }
            return null;
          })}
          {loopHasUnsetParams && (<span className="italic text-destructive">Some loop parameters are unset.</span>)}
        </div>
         <div className="text-xs text-blue-600/80 mt-1 italic">
            Drop commands here to add to loop body.
        </div>
      </Button>
    );

  } else if (command.type === 'command') { // Original rendering for other commands
    const regularCommand = command as ScriptPowerShellCommand;
    return (
      <Button
        variant="outline"
        className={cn(
          "flex-grow h-auto py-1 px-2 text-left justify-start items-start flex-col shadow-sm hover:shadow-md w-full",
          hasUnsetParameters 
            ? "border-destructive hover:border-destructive/80" 
            : "border-primary/50 hover:border-primary"
        )}
        onClick={onClick}
        aria-label={`Edit command ${regularCommand.name}${hasUnsetParameters ? '. This command has unset parameters.' : ''}`}
      >
        <div className={cn(
          "font-semibold",
          hasUnsetParameters ? "text-destructive" : "text-primary"
        )}>{regularCommand.name}</div>
        <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-1">
          {regularCommand.parameters.length > 0 && Object.values(regularCommand.parameterValues).every(v => !v) && (
              <span className="italic">No parameters set. Click to edit.</span>
          )}
          {regularCommand.parameters.map((param) => {
            const value = regularCommand.parameterValues[param.name];
            if (value) { 
              return (
                <Badge variant="secondary" key={param.name} className="font-normal">
                  <span className={cn(hasUnsetParameters ? "text-destructive/90" : "text-primary/80")}>-{param.name}:</span>&nbsp;"{value}"
                </Badge>
              );
            }
            return null;
          })}
           {regularCommand.parameters.length === 0 && (
              <span className="italic">No parameters for this command.</span>
          )}
        </div>
      </Button>
    );
  }
  return null; // Should not happen
}

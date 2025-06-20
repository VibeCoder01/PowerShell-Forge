
'use client';

import type { ScriptPowerShellCommand } from '@/types/powershell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MessageSquareText, AlertTriangle } from 'lucide-react'; // Added AlertTriangle

interface ScriptCommandChipProps {
  command: ScriptPowerShellCommand;
  onClick: () => void;
  hasUnsetParameters: boolean;
}

export function ScriptCommandChip({ command, onClick, hasUnsetParameters }: ScriptCommandChipProps) {
  if (command.baseCommandId === 'internal-add-comment') {
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
  } else if (command.baseCommandId === 'internal-user-prompt') {
    const promptText = command.parameterValues['PromptText'] || '';
    const defaultPromptText = "ACTION NEEDED: [Your prompt text here]";
    const displayPrompt = promptText.length > 60 ? promptText.substring(0, 57) + '...' : promptText;
    const isEmptyOrPlaceholder = !promptText || promptText === defaultPromptText;

    return (
      <Button
        variant="outline" // Base variant, background will override
        className={cn(
          "flex-grow h-auto py-1.5 px-2.5 text-left justify-start items-center shadow-sm hover:shadow-md w-full",
          // Solid bright color:
          "bg-yellow-400 hover:bg-yellow-500 text-yellow-950 border-yellow-500 hover:border-yellow-600",
           // Highlight if prompt is empty or default placeholder
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
  }


  // Original rendering for other commands
  return (
    <Button
      variant="outline"
      className={cn(
        "flex-grow h-auto py-1 px-2 text-left justify-start items-start flex-col shadow-sm hover:shadow-md",
        hasUnsetParameters 
          ? "border-destructive hover:border-destructive/80" 
          : "border-primary/50 hover:border-primary"
      )}
      onClick={onClick}
      aria-label={`Edit command ${command.name}${hasUnsetParameters ? '. This command has unset parameters.' : ''}`}
    >
      <div className={cn(
        "font-semibold",
        hasUnsetParameters ? "text-destructive" : "text-primary"
      )}>{command.name}</div>
      <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-1">
        {command.parameters.length > 0 && Object.values(command.parameterValues).every(v => !v) && (
            <span className="italic">No parameters set. Click to edit.</span>
        )}
        {command.parameters.map((param) => {
          const value = command.parameterValues[param.name];
          if (value) { // Only show parameters that have a value
            return (
              <Badge variant="secondary" key={param.name} className="font-normal">
                <span className={cn(hasUnsetParameters ? "text-destructive/90" : "text-primary/80")}>-{param.name}:</span>&nbsp;"{value}"
              </Badge>
            );
          }
          return null;
        })}
         {command.parameters.length === 0 && (
            <span className="italic">No parameters for this command.</span>
        )}
      </div>
    </Button>
  );
}

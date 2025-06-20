
'use client';

import type { ScriptPowerShellCommand } from '@/types/powershell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MessageSquareText } from 'lucide-react'; // For comment icon

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
          hasUnsetParameters && !commentText ? "border-amber-500 hover:border-amber-600" : "" // Highlight if comment is empty
        )}
        onClick={onClick}
        aria-label={`Edit comment: ${commentText}`}
      >
        <div className="flex items-center gap-1.5 w-full">
          <MessageSquareText className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className={cn(
            "font-mono text-xs text-muted-foreground whitespace-pre-wrap break-words",
            !commentText ? "italic" : ""
          )}>
            {displayComment || "Empty comment. Click to edit."}
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

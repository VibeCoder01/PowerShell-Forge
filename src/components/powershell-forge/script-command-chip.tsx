
'use client';

import React, { useMemo } from 'react';
import type { ScriptPowerShellCommand } from '@/types/powershell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { MessageSquareText, AlertTriangle, Repeat, IterationCcw, ListTree, CornerRightDown, CornerLeftUp, Settings } from 'lucide-react';

interface ScriptCommandChipProps {
  command: ScriptPowerShellCommand;
  onClick: () => void;
  hasUnsetParameters?: boolean;
}

const isVariableNameParam = (commandId: string, paramName: string): boolean => {
    const variableCommands = [
      'Set-Variable',
      'New-Variable',
      'Get-Variable',
      'Remove-Variable',
      'Clear-Variable',
    ];
    if (variableCommands.includes(commandId) && paramName === 'Name') {
      return true;
    }
    if (commandId === 'internal-start-foreach-loop' && paramName === 'ItemVariable') {
      return true;
    }
    return false;
};

export function ScriptCommandChip({ command, onClick, hasUnsetParameters }: ScriptCommandChipProps) {
  let icon = <Settings className="h-4 w-4 text-primary shrink-0" />;
  let chipStyle = "";
  let titleStyle = hasUnsetParameters ? "text-destructive" : "text-primary";
  let specificChipText = command.name;

  const previewString = useMemo(() => {
    const { baseCommandId, name: commandName, parameterValues } = command;

    if (baseCommandId === 'internal-add-comment') {
      return `# ${parameterValues['CommentText'] || ''}`;
    }
    if (baseCommandId === 'internal-user-prompt') {
      return '[This is a user prompt and is not included in the script output]';
    }
    if (baseCommandId.startsWith('internal-end-')) {
      return '}';
    }

    if (baseCommandId === 'internal-start-foreach-loop') {
      const collection = parameterValues['InputObject'] || '$collection';
      const itemVarRaw = parameterValues['ItemVariable'] || 'item';
      const itemVar = `$${itemVarRaw.replace(/^\$/, '')}`;
      return `foreach (${itemVar} in ${collection}) {`;
    }
    if (baseCommandId === 'internal-start-for-loop') {
        const initializer = parameterValues['Initializer'] || '$i = 0';
        const condition = parameterValues['Condition'] || '$i -lt 10';
        const iterator = parameterValues['Iterator'] || '$i++';
        return `for (${initializer}; ${condition}; ${iterator}) {`;
    }
    if (baseCommandId === 'internal-start-while-loop') {
        const condition = parameterValues['Condition'] || '$true';
        return `while (${condition}) {`;
    }

    // Regular command
    const paramsString = Object.entries(parameterValues)
        .map(([key, value]) => {
            if (key.startsWith('_') || !value) return null;
            let displayValue = value;
            if (isVariableNameParam(baseCommandId, key)) {
                displayValue = `$${value.replace(/^\$/, '')}`;
            }
            return `-${key} ${displayValue}`;
        })
        .filter(Boolean)
        .join(' ');

    return `${commandName}${paramsString ? ' ' + paramsString : ''}`;
  }, [command]);

  if (command.baseCommandId === 'internal-add-comment') {
    const commentText = command.parameterValues['CommentText'] || '';
    const displayComment = commentText.length > 60 ? commentText.substring(0, 57) + '...' : commentText;
    icon = <MessageSquareText className="h-4 w-4 text-muted-foreground shrink-0" />;
    chipStyle = "border-muted-foreground/30 hover:border-muted-foreground/70 bg-card/50";
    if (hasUnsetParameters && (!commentText || commentText === "Your comment here")) {
      chipStyle = "border-amber-500 hover:border-amber-600";
    }
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex-grow h-auto py-1.5 px-2.5 text-left justify-start items-center shadow-sm hover:shadow-md w-full",
              chipStyle
            )}
            onClick={onClick}
            aria-label={`Edit comment: ${commentText}`}
          >
            <div className="flex items-center gap-1.5 w-full">
              {icon}
              <span className={cn(
                "font-mono text-xs text-muted-foreground whitespace-pre-wrap break-words",
                (!commentText || commentText === "Your comment here") ? "italic" : ""
              )}>
                {displayComment || "Empty comment. Click to edit."}
              </span>
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" align="start">
          <p className="font-mono text-xs">{previewString}</p>
        </TooltipContent>
      </Tooltip>
    );
  } else if (command.baseCommandId === 'internal-user-prompt') {
    const promptText = command.parameterValues['PromptText'] || '';
    const defaultPromptText = "ACTION NEEDED: [Your prompt text here]";
    const displayPrompt = promptText.length > 60 ? promptText.substring(0, 57) + '...' : promptText;
    const isEmptyOrPlaceholder = !promptText || promptText === defaultPromptText;
    icon = <AlertTriangle className="h-4 w-4 shrink-0" />;
    chipStyle = "bg-yellow-400 hover:bg-yellow-500 text-yellow-950 border-yellow-500 hover:border-yellow-600";
    if (hasUnsetParameters && isEmptyOrPlaceholder) {
        chipStyle += " ring-2 ring-offset-1 ring-red-500";
    }
     return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex-grow h-auto py-1.5 px-2.5 text-left justify-start items-center shadow-sm hover:shadow-md w-full",
              chipStyle
            )}
            onClick={onClick}
            aria-label={`Edit user prompt: ${promptText}`}
          >
            <div className="flex items-center gap-1.5 w-full">
              {icon}
              <span className={cn(
                "font-mono text-xs whitespace-pre-wrap break-words",
                isEmptyOrPlaceholder ? "italic" : ""
              )}>
                {displayPrompt || "Empty prompt. Click to edit."}
              </span>
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" align="start">
          <p className="font-mono text-xs">{previewString}</p>
        </TooltipContent>
      </Tooltip>
    );
  } else if (command.baseCommandId.startsWith('internal-start-')) {
    chipStyle = "border-blue-500 hover:border-blue-600 bg-blue-500/10";
    titleStyle = hasUnsetParameters ? "text-destructive" : "text-blue-700";
    if (command.baseCommandId === 'internal-start-foreach-loop') icon = <Repeat className="h-4 w-4 text-blue-600 shrink-0" />;
    else if (command.baseCommandId === 'internal-start-for-loop') icon = <IterationCcw className="h-4 w-4 text-blue-600 shrink-0" />;
    else if (command.baseCommandId === 'internal-start-while-loop') icon = <ListTree className="h-4 w-4 text-blue-600 shrink-0" />;
    else icon = <CornerRightDown className="h-4 w-4 text-blue-600 shrink-0" />; // Generic start
  } else if (command.baseCommandId.startsWith('internal-end-')) {
    chipStyle = "border-gray-400 hover:border-gray-500 bg-gray-400/10";
    titleStyle = "text-gray-600";
    icon = <CornerLeftUp className="h-4 w-4 text-gray-500 shrink-0" />;
  } else {
    // Regular command
    chipStyle = hasUnsetParameters 
      ? "border-destructive hover:border-destructive/80" 
      : "border-primary/50 hover:border-primary";
  }
    
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex-grow h-auto py-1 px-2 text-left justify-start items-start flex-col shadow-sm hover:shadow-md w-full",
            chipStyle
          )}
          onClick={onClick}
          aria-label={`Edit command ${command.name}${hasUnsetParameters ? '. This command has unset parameters.' : ''}`}
        >
          <div className={cn("font-semibold flex items-center gap-1", titleStyle)}>
            {icon}
            {specificChipText}
          </div>
          {!command.baseCommandId.startsWith('internal-end-') && (
            <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-1 pl-6">
              {command.parameters.length > 0 && Object.values(command.parameterValues).every(v => !v) && !hasUnsetParameters && (
                  <span className="italic">No parameters set. Click to edit.</span>
              )}
              {command.parameters.map((param) => {
                const value = command.parameterValues[param.name];
                if (value) { 
                  return (
                    <Badge variant="secondary" key={param.name} className="font-normal">
                      <span className={cn(hasUnsetParameters ? "text-destructive/90" : "text-primary/80")}>-{param.name}:</span>&nbsp;{value}
                    </Badge>
                  );
                }
                return null;
              })}
              {command.parameters.length === 0 && (
                  <span className="italic">No parameters for this command.</span>
              )}
              {hasUnsetParameters && command.parameters.length > 0 && (
                <span className="italic text-destructive">Required parameters unset. Click to edit.</span>
              )}
            </div>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" align="start">
          <p className="font-mono text-xs">{previewString}</p>
      </TooltipContent>
    </Tooltip>
  );
}


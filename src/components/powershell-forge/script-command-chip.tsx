'use client';

import type { ScriptPowerShellCommand } from '@/types/powershell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ScriptCommandChipProps {
  command: ScriptPowerShellCommand;
  onClick: () => void;
}

export function ScriptCommandChip({ command, onClick }: ScriptCommandChipProps) {
  return (
    <Button
      variant="outline"
      className="flex-grow h-auto py-1 px-2 text-left justify-start items-start flex-col border-primary/50 hover:border-primary shadow-sm hover:shadow-md"
      onClick={onClick}
      aria-label={`Edit command ${command.name}`}
    >
      <div className="font-semibold text-primary">{command.name}</div>
      <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-1">
        {command.parameters.map((param) => {
          const value = command.parameterValues[param.name];
          if (value) { // Only show parameters that have a value
            return (
              <Badge variant="secondary" key={param.name} className="font-normal">
                <span className="text-primary/80">-{param.name}:</span>&nbsp;"{value}"
              </Badge>
            );
          }
          return null;
        })}
        {Object.values(command.parameterValues).every(v => !v) && command.parameters.length > 0 && (
            <span className="italic">No parameters set. Click to edit.</span>
        )}
         {command.parameters.length === 0 && (
            <span className="italic">No parameters for this command.</span>
        )}
      </div>
    </Button>
  );
}

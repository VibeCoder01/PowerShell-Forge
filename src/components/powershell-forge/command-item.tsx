
'use client';

import type { BasePowerShellCommand } from '@/types/powershell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { GripVertical } from 'lucide-react';

interface CommandItemProps {
  command: BasePowerShellCommand;
}

export function CommandItem({ command }: CommandItemProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // When dragging, we only need the base command structure.
    // The ScriptEditorColumn will transform this into a ScriptPowerShellCommand.
    const commandToDrag: BasePowerShellCommand = {
      id: command.id,
      name: command.name,
      parameters: command.parameters,
      description: command.description,
      isCustom: command.isCustom, // Preserve this flag
    };
    e.dataTransfer.setData('application/json', JSON.stringify(commandToDrag));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      className="mb-2 cursor-grab active:cursor-grabbing shadow-md hover:shadow-lg transition-shadow duration-200"
      aria-label={`Draggable command: ${command.name}`}
    >
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={command.id} className="border-b-0">
          <AccordionTrigger className="p-4 hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <span className="font-semibold text-primary">{command.name}</span>
                {command.isCustom && <Badge variant="outline" className="text-xs">Custom</Badge>}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            {command.description && (
              <p className="text-sm text-muted-foreground mb-2">{command.description}</p>
            )}
            {command.parameters.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Parameters:</h4>
                <div className="flex flex-wrap gap-1">
                  {command.parameters.map((param) => (
                    <Badge key={param.name} variant="secondary" className="text-xs">
                      {param.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {command.parameters.length === 0 && (
                <p className="text-xs text-muted-foreground">No parameters.</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}

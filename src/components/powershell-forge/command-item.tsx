
'use client';

import type { BasePowerShellCommand } from '@/types/powershell';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2 } from 'lucide-react';

interface CommandItemProps {
  command: BasePowerShellCommand;
  onDelete?: (commandId: string) => void;
}

export function CommandItem({ command, onDelete }: CommandItemProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const commandToDrag: BasePowerShellCommand = {
      id: command.id,
      name: command.name,
      category: command.category, // Include category
      parameters: command.parameters,
      description: command.description,
      isCustom: command.isCustom,
    };
    e.dataTransfer.setData('application/json', JSON.stringify(commandToDrag));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      className="mb-2 cursor-grab active:cursor-grabbing shadow-md hover:shadow-lg transition-shadow duration-200 bg-card/70 group"
      aria-label={`Draggable command: ${command.name}`}
    >
      <div className="relative">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value={command.id} className="border-b-0">
            <AccordionTrigger className="p-3 hover:no-underline text-xs">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="font-medium text-primary">{command.name}</span>
                  {command.isCustom && <Badge variant="outline" className="text-xs px-1.5 py-0.5">Custom</Badge>}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 text-xs">
              {command.description && (
                <p className="text-muted-foreground mb-1.5">{command.description}</p>
              )}
              {command.parameters.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Parameters:</h4>
                  <div className="flex flex-wrap gap-1">
                    {command.parameters.map((param) => (
                      <Badge key={param.name} variant="secondary" className="text-xs px-1.5 py-0.5">
                        {param.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {command.parameters.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No parameters.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {command.isCustom && onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-10 top-1/2 -translate-y-1/2 h-7 w-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(command.id);
            }}
            aria-label={`Delete custom command ${command.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}

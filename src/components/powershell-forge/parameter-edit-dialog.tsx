'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ScriptPowerShellCommand } from '@/types/powershell';

interface ParameterEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  command: ScriptPowerShellCommand;
  onSave: (updatedCommand: ScriptPowerShellCommand) => void;
}

export function ParameterEditDialog({
  isOpen,
  onOpenChange,
  command,
  onSave,
}: ParameterEditDialogProps) {
  const [currentParameterValues, setCurrentParameterValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (command) {
      setCurrentParameterValues({ ...command.parameterValues });
    }
  }, [command]);

  const handleValueChange = (paramName: string, value: string) => {
    setCurrentParameterValues(prev => ({ ...prev, [paramName]: value }));
  };

  const handleSubmit = () => {
    onSave({ ...command, parameterValues: currentParameterValues });
    onOpenChange(false);
  };

  if (!command) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Parameters for: {command.name}</DialogTitle>
          <DialogDescription>
            Modify the parameter values for this command instance.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-6">
          <div className="grid gap-4 py-4">
            {command.parameters.length === 0 && (
                <p className="text-sm text-muted-foreground">This command has no parameters.</p>
            )}
            {command.parameters.map((param) => (
              <div key={param.name} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={param.name} className="text-right col-span-1 truncate">
                  -{param.name}
                </Label>
                <Input
                  id={param.name}
                  value={currentParameterValues[param.name] || ''}
                  onChange={(e) => handleValueChange(param.name, e.target.value)}
                  className="col-span-3"
                  placeholder={`Value for ${param.name}`}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


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
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, MinusCircle, PencilLine } from 'lucide-react';
import { generateUniqueId } from '@/lib/utils';
import type { PowerShellCommandParameter } from '@/types/powershell';
import { useToast } from '@/hooks/use-toast';

interface CustomCommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (commandData: { name: string; description?: string; parameters: PowerShellCommandParameter[]; category?: string }) => void;
}

interface ParameterField {
  id: string;
  name: string;
}

// Suggest some common categories or allow free text
const commonCategories = [
  "System Management",
  "File & Item Management",
  "Networking",
  "Data Handling & Formatting",
  "Security",
  "Application Management",
  "PowerShell Core & Scripting",
  "Hyper-V",
  "Custom" 
];


export function CustomCommandDialog({ open, onOpenChange, onSave }: CustomCommandDialogProps) {
  const [commandName, setCommandName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Custom');
  const [parameters, setParameters] = useState<ParameterField[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      // Reset form when dialog opens
      setCommandName('');
      setDescription('');
      setCategory('Custom');
      setParameters([{ id: generateUniqueId(), name: '' }]); // Start with one empty parameter field
    }
  }, [open]);

  const handleAddParameter = () => {
    setParameters([...parameters, { id: generateUniqueId(), name: '' }]);
  };

  const handleRemoveParameter = (id: string) => {
    setParameters(parameters.filter(param => param.id !== id));
  };

  const handleParameterNameChange = (id: string, value: string) => {
    setParameters(parameters.map(param => (param.id === id ? { ...param, name: value } : param)));
  };

  const handleSubmit = () => {
    if (!commandName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Command name is required.',
      });
      return;
    }
    if (!category.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Category is required.',
      });
      return;
    }


    const finalParameters = parameters
      .map(p => ({ name: p.name.trim() }))
      .filter(p => p.name !== ''); // Remove empty parameter names and trim whitespace

    // Check for duplicate parameter names
    const paramNames = finalParameters.map(p => p.name.toLowerCase());
    const uniqueParamNames = new Set(paramNames);
    if (paramNames.length !== uniqueParamNames.size) {
        toast({
            variant: 'destructive',
            title: 'Validation Error',
            description: 'Parameter names must be unique.',
        });
        return;
    }


    onSave({
      name: commandName.trim(),
      description: description.trim() || undefined,
      category: category.trim(),
      parameters: finalParameters,
    });
    onOpenChange(false); // Close dialog after save
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PencilLine className="h-5 w-5 text-primary" />
            Create Custom PowerShell Command
          </DialogTitle>
          <DialogDescription>
            Define your own PowerShell command, its category, and its parameters.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-6 -mr-6">
          <div className="grid gap-4 py-4 pr-6">
            <div className="grid gap-1.5">
              <Label htmlFor="custom-command-name">Command Name <span className="text-destructive">*</span></Label>
              <Input
                id="custom-command-name"
                value={commandName}
                onChange={(e) => setCommandName(e.target.value)}
                placeholder="e.g., Start-MyApplication"
              />
            </div>
             <div className="grid gap-1.5">
              <Label htmlFor="custom-command-category">Category <span className="text-destructive">*</span></Label>
              <Input
                id="custom-command-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Custom Utilities"
                list="common-categories"
              />
              <datalist id="common-categories">
                {commonCategories.map(cat => <option key={cat} value={cat} />)}
              </datalist>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="custom-command-description">Description</Label>
              <Textarea
                id="custom-command-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what this command does"
                rows={3}
              />
            </div>
            <div>
              <Label className="mb-2 block">Parameters</Label>
              {parameters.length === 0 && (
                <p className="text-sm text-muted-foreground mb-2">No parameters defined yet.</p>
              )}
              {parameters.map((param, index) => (
                <div key={param.id} className="flex items-center gap-2 mb-2">
                  <Input
                    value={param.name}
                    onChange={(e) => handleParameterNameChange(param.id, e.target.value)}
                    placeholder={`Parameter ${index + 1} name`}
                    className="flex-grow"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveParameter(param.id)}
                    aria-label="Remove parameter"
                    disabled={parameters.length === 1 && param.name === ''} 
                  >
                    <MinusCircle className="h-5 w-5 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={handleAddParameter} className="mt-1">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Parameter
              </Button>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Command</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

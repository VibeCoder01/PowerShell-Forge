
'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { FolderOpen } from 'lucide-react';

interface ParameterEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  command: ScriptPowerShellCommand;
  onSave: (updatedCommand: ScriptPowerShellCommand) => void;
}

// Heuristic list of parameter names that typically expect a file path.
const pathParamNames = [
  'Path', 'FilePath', 'LiteralPath', 'PSPath',
  'SourcePath', 'DestinationPath', 'TargetPath',
  'LogPath', 'OutFile', 'AppendPath', 'FullName'
];

// Parameter names that typically expect just a filename.
const fileNameParamNames = ['Name', 'FileName'];

export function ParameterEditDialog({
  isOpen,
  onOpenChange,
  command,
  onSave,
}: ParameterEditDialogProps) {
  const [currentParameterValues, setCurrentParameterValues] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [paramNameForFileBrowse, setParamNameForFileBrowse] = useState<string | null>(null);

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

  const handleBrowseClick = (paramName: string) => {
    setParamNameForFileBrowse(paramName);
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && paramNameForFileBrowse) {
      const selectedFileName = file.name;
      handleValueChange(paramNameForFileBrowse, selectedFileName);
    }
    // Reset file input to allow selecting the same file again
    if (event.target) {
      event.target.value = '';
    }
    setParamNameForFileBrowse(null);
  };

  if (!command) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl"> {/* Increased width */}
        <DialogHeader>
          <DialogTitle>Edit Parameters for: {command.name}</DialogTitle>
          <DialogDescription>
            Modify the parameter values for this command instance. For path or filename parameters, you can browse for a file.
            The browser will only provide the filename; you may need to adjust the path manually for path parameters.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-6">
          <div className="grid gap-y-6 gap-x-4 py-4">
            {command.parameters.length === 0 && (
                <p className="text-sm text-muted-foreground">This command has no parameters.</p>
            )}
            {command.parameters.map((param) => {
              const isPotentiallyPathOrFileName =
                pathParamNames.some(name => name.toLowerCase() === param.name.toLowerCase()) ||
                fileNameParamNames.some(name => name.toLowerCase() === param.name.toLowerCase());

              return (
                <div key={param.name} className="grid grid-cols-5 items-center gap-x-4">
                  <Label htmlFor={param.name} className="text-right col-span-1 whitespace-nowrap">
                    {param.name}
                  </Label>
                  <div className={`flex items-center gap-2 ${isPotentiallyPathOrFileName ? 'col-span-3' : 'col-span-4'} py-1 pr-1`}> {/* Added pr-1 */}
                    <Input
                      id={param.name}
                      value={currentParameterValues[param.name] || ''}
                      onChange={(e) => handleValueChange(param.name, e.target.value)}
                      className="flex-grow"
                      placeholder={`Value for ${param.name}`}
                    />
                  </div>
                  {isPotentiallyPathOrFileName && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBrowseClick(param.name)}
                      className="col-span-1"
                      aria-label={`Browse for ${param.name}`}
                    >
                      <FolderOpen className="mr-2 h-4 w-4" /> Browse
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelected}
          className="hidden"
          aria-hidden="true"
        />
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

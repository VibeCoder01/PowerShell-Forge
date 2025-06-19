
'use client';

import type { BasePowerShellCommand, PowerShellCommandParameter } from '@/types/powershell';
import { CommandItem } from './command-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { List, PencilLine } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { CustomCommandDialog } from './custom-command-dialog'; // To be created

interface CommandBrowserProps {
  mockCommands: BasePowerShellCommand[];
  customCommands: BasePowerShellCommand[];
  onSaveCustomCommand: (commandData: { name: string; description?: string; parameters: PowerShellCommandParameter[] }) => void;
}

export function CommandBrowser({ mockCommands, customCommands, onSaveCustomCommand }: CommandBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomCommandDialog, setShowCustomCommandDialog] = useState(false);

  const allCommands = useMemo(() => {
    // Ensure custom commands are marked correctly for potential future use (e.g., editing)
    const markedCustomCommands = customCommands.map(cmd => ({ ...cmd, isCustom: true }));
    return [...mockCommands, ...markedCustomCommands];
  }, [mockCommands, customCommands]);

  const filteredCommands = useMemo(() => {
    if (!searchTerm) return allCommands;
    return allCommands.filter(command =>
      command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (command.description && command.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [allCommands, searchTerm]);

  const handleAddCustomCommand = (commandData: { name: string; description?: string; parameters: PowerShellCommandParameter[] }) => {
    onSaveCustomCommand(commandData);
    setShowCustomCommandDialog(false); // Close dialog after saving
  };

  return (
    <>
      <Card className="h-full flex flex-col shadow-xl">
        <CardHeader className="py-4 px-4 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <List className="h-6 w-6 text-primary" />
            Command Browser
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowCustomCommandDialog(true)}>
            <PencilLine className="mr-2 h-4 w-4" /> Add Custom
          </Button>
        </CardHeader>
        <div className="p-4 border-b">
          <Input
            type="text"
            placeholder="Search commands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search PowerShell commands"
            className="w-full"
          />
        </div>
        <CardContent className="p-0 flex-grow overflow-hidden">
          <ScrollArea className="h-full p-4">
            {filteredCommands.length > 0 ? (
              filteredCommands.map((command) => (
                <CommandItem key={command.id} command={command} />
              ))
            ) : (
              <p className="text-muted-foreground text-sm text-center py-4">No commands found.</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      <CustomCommandDialog
        open={showCustomCommandDialog}
        onOpenChange={setShowCustomCommandDialog}
        onSave={handleAddCustomCommand}
      />
    </>
  );
}

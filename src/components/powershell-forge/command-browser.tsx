'use client';

import type { PowerShellCommand } from '@/types/powershell';
import { CommandItem } from './command-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { List } from 'lucide-react';
import React, { useState, useMemo } from 'react';

interface CommandBrowserProps {
  commands: PowerShellCommand[];
}

export function CommandBrowser({ commands }: CommandBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCommands = useMemo(() => {
    if (!searchTerm) return commands;
    return commands.filter(command =>
      command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (command.description && command.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [commands, searchTerm]);

  return (
    <Card className="h-full flex flex-col shadow-xl">
      <CardHeader className="py-4 px-4 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <List className="h-6 w-6 text-primary" />
          Command Browser
        </CardTitle>
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
  );
}

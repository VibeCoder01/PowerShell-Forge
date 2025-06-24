
'use client';

import type { BasePowerShellCommand, PowerShellCommandParameter } from '@/types/powershell';
import { CommandItem } from './command-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { List, PencilLine, Inbox, Trash2 } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { CustomCommandDialog } from './custom-command-dialog'; 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';

interface CommandBrowserProps {
  mockCommands: BasePowerShellCommand[];
  customCommands: BasePowerShellCommand[];
  onSaveCustomCommand: (commandData: { name: string; description?: string; parameters: PowerShellCommandParameter[], category?: string }) => void;
  onDeleteCustomCommand: (commandId: string) => void;
}

interface GroupedCommands {
  [category: string]: BasePowerShellCommand[];
}

export function CommandBrowser({ mockCommands, customCommands, onSaveCustomCommand, onDeleteCustomCommand }: CommandBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomCommandDialog, setShowCustomCommandDialog] = useState(false);
  const [activeAccordionItems, setActiveAccordionItems] = useState<string[]>([]);
  const [commandToDelete, setCommandToDelete] = useState<BasePowerShellCommand | null>(null);

  const allCommands = useMemo(() => {
    const markedCustomCommands = customCommands.map(cmd => ({ ...cmd, isCustom: true, category: cmd.category || 'Custom' }));
    return [...mockCommands, ...markedCustomCommands];
  }, [mockCommands, customCommands]);

  const filteredAndGroupedCommands = useMemo(() => {
    const filtered = searchTerm
      ? allCommands.filter(command =>
          command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (command.description && command.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          command.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : allCommands;

    const grouped = filtered.reduce((acc, command) => {
      const category = command.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(command);
      return acc;
    }, {} as GroupedCommands);
    
    // Sort categories, putting "Custom" last if it exists
    const sortedCategories = Object.keys(grouped).sort((a, b) => {
        if (a === 'Custom') return 1;
        if (b === 'Custom') return -1;
        if (a === 'Uncategorized') return 1;
        if (b === 'Uncategorized') return -1;
        return a.localeCompare(b);
    });

    if (searchTerm && sortedCategories.length > 0) {
      setActiveAccordionItems(sortedCategories); // Expand all categories with search results
    } else if (!searchTerm) {
      setActiveAccordionItems([]); // Collapse all when search is cleared (or define default open ones)
    }


    return sortedCategories.map(category => ({
      category,
      commands: grouped[category],
    }));
  }, [allCommands, searchTerm]);

  const handleAddCustomCommand = (commandData: { name: string; description?: string; parameters: PowerShellCommandParameter[]; category?: string }) => {
    // Ensure custom commands get a category, default to "Custom"
    const category = commandData.category || 'Custom';
    onSaveCustomCommand({...commandData, category });
    setShowCustomCommandDialog(false); 
  };
  
  const handleAccordionValueChange = (value: string[]) => {
    setActiveAccordionItems(value);
  };
  
  const handleDeleteRequest = (commandId: string) => {
    const command = customCommands.find(c => c.id === commandId);
    if (command) {
      setCommandToDelete(command);
    }
  };

  const handleConfirmDelete = () => {
    if (commandToDelete) {
      onDeleteCustomCommand(commandToDelete.id);
      setCommandToDelete(null);
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col shadow-xl">
        <CardHeader className="py-4 px-4 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <List className="h-5 w-5 text-primary" />
            Command Browser
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowCustomCommandDialog(true)}>
            <PencilLine className="mr-2 h-4 w-4" /> Add Custom
          </Button>
        </CardHeader>
        <div className="p-4 border-b">
          <Input
            type="text"
            placeholder="Search commands or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search PowerShell commands"
            className="w-full text-sm"
          />
        </div>
        <CardContent className="p-0 flex-grow overflow-hidden">
          <ScrollArea className="h-full">
            {filteredAndGroupedCommands.length > 0 ? (
              <Accordion 
                type="multiple" 
                className="w-full p-2"
                value={activeAccordionItems}
                onValueChange={handleAccordionValueChange}
              >
                {filteredAndGroupedCommands.map(({ category, commands }) => (
                  <AccordionItem value={category} key={category} className="border-b-0 mb-1">
                    <AccordionTrigger className="py-2 px-3 text-xs font-medium bg-muted/50 hover:bg-muted rounded-md">
                      {category} ({commands.length})
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-0 pl-3 pr-1">
                      {commands.map((command) => (
                        <CommandItem 
                          key={command.id} 
                          command={command} 
                          onDelete={command.isCustom ? handleDeleteRequest : undefined}
                        />
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                <Inbox className="h-16 w-16 mb-4" />
                <p className="text-base font-medium">No commands found</p>
                <p className="text-xs text-center">
                  {searchTerm 
                    ? "Try adjusting your search term or add a custom command." 
                    : "The command list is empty. Try adding custom commands."}
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      <CustomCommandDialog
        open={showCustomCommandDialog}
        onOpenChange={setShowCustomCommandDialog}
        onSave={handleAddCustomCommand}
      />
      <AlertDialog open={!!commandToDelete} onOpenChange={(open) => !open && setCommandToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the custom command "{commandToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCommandToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete} 
              className={cn(buttonVariants({ variant: "destructive" }))}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

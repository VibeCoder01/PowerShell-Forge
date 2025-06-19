'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Wand2 } from 'lucide-react';

interface AiScriptGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (description: string) => Promise<void>;
  scriptTypeTitle: string;
}

export function AiScriptGeneratorDialog({
  open,
  onOpenChange,
  onGenerate,
  scriptTypeTitle,
}: AiScriptGeneratorDialogProps) {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setIsLoading(true);
    try {
      await onGenerate(description);
      onOpenChange(false); // Close dialog on success
      setDescription(''); // Reset description
    } catch (error) {
      // Error is handled by toast in parent component
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            Generate {scriptTypeTitle} Script with AI
          </DialogTitle>
          <DialogDescription>
            Describe the {scriptTypeTitle.toLowerCase()} script you want to generate. The AI will create a starting point for you.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="description">Script Description</Label>
            <Textarea
              id="description"
              placeholder={`e.g., "A script to install MyApp from an MSI package located at C:\\Installers\\MyApp.msi silently and log the installation process."`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !description.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Script'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

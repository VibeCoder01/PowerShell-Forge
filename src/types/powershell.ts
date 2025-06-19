export interface PowerShellCommandParameter {
  name: string;
  // Later, could add type: string, description: string, isMandatory: boolean etc.
}

export interface PowerShellCommand {
  id: string; // Can be the command name if unique
  name: string;
  parameters: PowerShellCommandParameter[];
  description?: string; // A brief description of the command
}

export type ScriptType = 'add' | 'launch' | 'remove';

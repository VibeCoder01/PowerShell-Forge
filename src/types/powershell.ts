export interface PowerShellCommandParameter {
  name: string;
  // Future: type: string, description: string, isMandatory: boolean, defaultValue?: string
}

// Base definition of a PowerShell command as available in the browser
export interface BasePowerShellCommand {
  id: string; // Usually the command name
  name: string;
  parameters: PowerShellCommandParameter[];
  description?: string;
}

// Represents an instance of a PowerShell command within a script, with editable values
export interface ScriptPowerShellCommand extends Omit<BasePowerShellCommand, 'id' | 'description'> {
  instanceId: string; // Unique ID for this specific instance in the script
  type: 'command';
  // Base command 'id' can be stored if needed to re-fetch original parameters/description
  baseCommandId: string; 
  parameterValues: { [key: string]: string }; // Parameter name -> value
}

// Represents a line of raw text in the script
export interface RawScriptLine {
  instanceId: string;
  type: 'raw';
  content: string;
}

export type ScriptElement = ScriptPowerShellCommand | RawScriptLine;

export type ScriptType = 'add' | 'launch' | 'remove';

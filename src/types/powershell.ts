
export interface PowerShellCommandParameter {
  name: string;
  // Future: type: string, description: string, isMandatory: boolean, defaultValue?: string
}

// Base definition of a PowerShell command as available in the browser
export interface BasePowerShellCommand {
  id: string; // Usually the command name, or unique ID for custom commands
  name: string;
  category: string; // Category for grouping in the UI
  parameters: PowerShellCommandParameter[];
  description?: string;
  isCustom?: boolean; // Flag to identify custom commands
  // isLoop property is removed as loops are now handled by start/end commands
}

// Represents an instance of a PowerShell command within a script, with editable values
export interface ScriptPowerShellCommand extends Omit<BasePowerShellCommand, 'id' | 'description' | 'isCustom' | 'category'> {
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

// LoopScriptElement is removed. Loops are now pairs of commands.
export type ScriptElement = ScriptPowerShellCommand | RawScriptLine;

export type ScriptType = 'add' | 'launch' | 'remove';

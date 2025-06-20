
import type { BasePowerShellCommand } from '@/types/powershell';

// Descriptions are kept concise. Specific parameters are listed.
// Common PowerShell parameters (Verbose, Debug, ErrorAction, etc.) are handled by a dedicated UI section
// and are omitted from the 'parameters' list here.

// Helper to parse parameter string from your list, excluding common ones.
// This is a simplified parser for the format you provided.
function parseSpecificParamsFromNameList(paramString?: string): { name: string }[] {
  if (!paramString || paramString.trim() === '') return [];
  
  // Remove leading/trailing brackets if present, then split by comma
  const cleanedString = paramString.replace(/^\[|\]$/g, '');
  if (cleanedString.trim() === '') return [];

  return cleanedString.split(',')
    .map(p => p.trim().replace(/^-/, '')) // Remove leading hyphen if present
    .filter(p => p && !COMMON_POWERHSHELL_PARAMETERS.includes(p)) // Filter out common params
    .map(p => ({ name: p }));
}


const COMMON_POWERHSHELL_PARAMETERS = [
  'Verbose', 'Debug', 'ErrorAction', 'WarningAction', 'InformationAction', 
  'ErrorVariable', 'WarningVariable', 'InformationVariable', 'OutVariable', 
  'OutBuffer', 'PipelineVariable', 'WhatIf', 'Confirm', 'UseTransaction',
  'PassThru', 'Force', 'Credential', 'AsJob', 'ComputerName', 'InputObject',
  'Path', 'LiteralPath', 'Name', 'Id', 'Include', 'Exclude', 'Filter', 'Scope',
  'Value', 'DisplayName', 'Description', 'SourceIdentifier'
  // Add other truly ubiquitous common parameters if needed, but be conservative
];


export const mockCommands: BasePowerShellCommand[] = [
  // Scripting Constructs
  {
    id: 'internal-add-comment', 
    name: 'Comment',
    category: 'Scripting Constructs',
    parameters: [{ name: 'CommentText' }], // Single parameter for the comment content
    description: 'Adds an editable comment line to the script. Rendered as # in .ps1.',
  },
  // User Aids
  {
    id: 'internal-user-prompt',
    name: 'User Prompt',
    category: 'User Aids',
    parameters: [{ name: 'PromptText' }],
    description: 'Adds an in-editor visual prompt or to-do item. Not rendered in .ps1 scripts.',
  },

  // Looping Constructs
  {
    id: 'internal-foreach-loop',
    name: 'ForEach Loop',
    category: 'Looping Constructs',
    parameters: [
      { name: 'InputObject' }, // e.g., $myArray, (Get-Service)
      { name: 'ItemVariable' },  // e.g., item (becomes $item), defaults to $_
    ],
    description: 'Iterates over a collection of items (ForEach-Object).',
    isLoop: true,
  },
  {
    id: 'internal-for-loop',
    name: 'For Loop',
    category: 'Looping Constructs',
    parameters: [
      { name: 'Initializer' },   // e.g., $i = 0
      { name: 'Condition' },     // e.g., $i -lt 10
      { name: 'Iterator' },      // e.g., $i++
    ],
    description: 'Repeats commands based on an initializer, condition, and iterator.',
    isLoop: true,
  },
  {
    id: 'internal-while-loop',
    name: 'While Loop',
    category: 'Looping Constructs',
    parameters: [
      { name: 'Condition' },     // e.g., $true, $count -gt 0
    ],
    description: 'Repeats commands as long as a condition is true.',
    isLoop: true,
  },

  // System Management
  {
    id: 'Add-Computer',
    name: 'Add-Computer',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('ComputerName,LocalCredential,UnjoinDomainCredential,DomainName,OUPath,Server,Unsecure,Options,WorkgroupName,Restart,NewName'),
    description: 'Adds the local computer or remote computers to a domain or a workgroup.',
  },
  {
    id: 'Checkpoint-Computer',
    name: 'Checkpoint-Computer',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('Description,RestorePointType'),
    description: 'Creates a system restore point on the local computer.',
  },
  {
    id: 'Clear-EventLog',
    name: 'Clear-EventLog',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('LogName'),
    description: 'Clears all entries from specified event logs on the local or remote computers.',
  },
  {
    id: 'Clear-RecycleBin',
    name: 'Clear-RecycleBin',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('DriveLetter'),
    description: 'Clears the recycle bin on the specified drive.',
  },
  {
    id: 'Get-ComputerInfo',
    name: 'Get-ComputerInfo',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('Property'),
    description: 'Gets system and operating system properties.'
  },
  {
    id: 'Get-EventLog',
    name: 'Get-EventLog',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('LogName,Newest,After,Before,UserName,InstanceId,Index,EntryType,Source,Message,AsBaseObject,List,AsString'),
    description: 'Gets events in local or remote event logs.',
  },
  {
    id: 'Get-HotFix',
    name: 'Get-HotFix',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('Id'), // Description is often a common parameter if not the ID itself
    description: 'Gets the hotfixes that have been applied to the local and remote computers.',
  },
  {
    id: 'Get-Process',
    name: 'Get-Process',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('IncludeUserName,Module,FileVersionInfo'),
    description: 'Gets the processes that are running on the local computer or a remote computer.',
  },
  {
    id: 'Get-Service',
    name: 'Get-Service',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('DependentServices,RequiredServices'),
    description: 'Gets the services on a local or remote computer.',
  },
  {
    id: 'Restart-Computer',
    name: 'Restart-Computer',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('DcomAuthentication,Impersonation,WsmanAuthentication,Protocol,ThrottleLimit,Wait,Timeout,For,Delay'),
    description: 'Restarts the operating system on local and remote computers.',
  },
  {
    id: 'Restart-Service',
    name: 'Restart-Service',
    category: 'System Management',
    parameters: [], // Force, PassThru common
    description: 'Stops and then starts one or more services.',
  },
  {
    id: 'Start-Process',
    name: 'Start-Process',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('ArgumentList,WorkingDirectory,LoadUserProfile,NoNewWindow,RedirectStandardError,RedirectStandardInput,RedirectStandardOutput,Verb,WindowStyle,Wait,UseNewEnvironment'),
    description: 'Starts one or more processes on the local computer.',
  },
  {
    id: 'Start-Service',
    name: 'Start-Service',
    category: 'System Management',
    parameters: [], // PassThru common
    description: 'Starts one or more stopped services.',
  },
  {
    id: 'Stop-Computer',
    name: 'Stop-Computer',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('DcomAuthentication,WsmanAuthentication,Protocol,Impersonation,ThrottleLimit'),
    description: 'Shuts down local and remote computers.',
  },
  {
    id: 'Stop-Process',
    name: 'Stop-Process',
    category: 'System Management',
    parameters: [], // PassThru, Force common
    description: 'Stops one or more running processes.',
  },
  {
    id: 'Stop-Service',
    name: 'Stop-Service',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('NoWait'),
    description: 'Stops one or more running services.',
  },
  {
    id: 'Disable-ComputerRestore',
    name: 'Disable-ComputerRestore',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('Drive'),
    description: 'Disables the System Restore feature on the specified file system drive.'
  },
  {
    id: 'Enable-ComputerRestore',
    name: 'Enable-ComputerRestore',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('Drive'),
    description: 'Enables the System Restore feature on the specified file system drive.'
  },
  {
    id: 'Get-ComputerRestorePoint',
    name: 'Get-ComputerRestorePoint',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('RestorePoint,LastStatus'),
    description: 'Gets the restore points on the local computer.'
  },
  {
    id: 'Restore-Computer',
    name: 'Restore-Computer',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('RestorePoint'),
    description: 'Starts a system restore on the local computer.'
  },
  {
    id: 'Limit-EventLog',
    name: 'Limit-EventLog',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('LogName,RetentionDays,OverflowAction,MaximumSize'),
    description: 'Sets the maximum size of a classic event log, how long each event must be retained, and what happens when the log reaches its maximum size.'
  },
  {
    id: 'Remove-Computer',
    name: 'Remove-Computer',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('UnjoinDomainCredential,LocalCredential,Restart,WorkgroupName'),
    description: 'Removes the local computer or remote computers from a domain.'
  },
  {
    id: 'Remove-EventLog',
    name: 'Remove-EventLog',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('LogName,Source'),
    description: 'Deletes an event log or unregisters a source for an event log.'
  },
  {
    id: 'Rename-Computer',
    name: 'Rename-Computer',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('DomainCredential,LocalCredential,NewName,Restart,WsmanAuthentication,Protocol'),
    description: 'Renames a computer or a domain.'
  },
  {
    id: 'Reset-ComputerMachinePassword',
    name: 'Reset-ComputerMachinePassword',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('Server'),
    description: 'Resets the machine account password for the computer.'
  },
  {
    id: 'Resume-Service',
    name: 'Resume-Service',
    category: 'System Management',
    parameters: [],
    description: 'Resumes one or more suspended (paused) services.'
  },
  {
    id: 'Set-Service',
    name: 'Set-Service',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('StartupType,Status'),
    description: 'Starts, stops, and suspends a service, and changes its properties.'
  },
  {
    id: 'Show-EventLog',
    name: 'Show-EventLog',
    category: 'System Management',
    parameters: [],
    description: 'Displays the event logs of the local or a remote computer in Event Viewer.'
  },
  {
    id: 'Suspend-Service',
    name: 'Suspend-Service',
    category: 'System Management',
    parameters: [],
    description: 'Suspends (pauses) one or more running services.'
  },
  {
    id: 'Test-ComputerSecureChannel',
    name: 'Test-ComputerSecureChannel',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('Repair,Server'),
    description: 'Tests and repairs the secure channel between the local computer and its domain.'
  },
  {
    id: 'Write-EventLog',
    name: 'Write-EventLog',
    category: 'System Management',
    parameters: parseSpecificParamsFromNameList('LogName,Source,EntryType,Category,EventId,Message,RawData'),
    description: 'Writes an event to an event log.'
  },


  // File & Item Management
  {
    id: 'Add-Content',
    name: 'Add-Content',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('NoNewline,Encoding,Stream'),
    description: 'Adds content to the specified items, such as adding words to a file.',
  },
  {
    id: 'Clear-Content',
    name: 'Clear-Content',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('Stream'),
    description: 'Deletes the content of an item, such as the text in a file, but does not delete the item.',
  },
  {
    id: 'Clear-Item',
    name: 'Clear-Item',
    category: 'File & Item Management',
    parameters: [],
    description: 'Removes the content from an item, but does not delete the item.',
  },
  {
    id: 'Copy-Item',
    name: 'Copy-Item',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('Destination,Container,Recurse,FromSession,ToSession'),
    description: 'Copies an item from one location to another.',
  },
  {
    id: 'Get-ChildItem',
    name: 'Get-ChildItem',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('Recurse,Depth,Attributes,FollowSymlink,Directory,File,Hidden,ReadOnly,System'),
    description: 'Gets the items and child items in one or more specified locations.',
  },
  {
    id: 'Get-Content',
    name: 'Get-Content',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('ReadCount,TotalCount,Tail,Delimiter,Wait,Raw,Encoding,Stream'),
    description: 'Gets the content of the item at the specified location.',
  },
  {
    id: 'Get-Item',
    name: 'Get-Item',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('Stream'),
    description: 'Gets the item at the specified location.',
  },
  {
    id: 'Get-ItemProperty',
    name: 'Get-ItemProperty',
    category: 'File & Item Management',
    parameters: [],
    description: 'Gets the properties of a specified item.',
  },
  {
    id: 'Get-ItemPropertyValue',
    name: 'Get-ItemPropertyValue',
    category: 'File & Item Management',
    parameters: [],
    description: 'Gets the value for one or more properties of a specified item.',
  },
  {
    id: 'Get-Location',
    name: 'Get-Location',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('PSProvider,PSDrive,Stack,StackName'),
    description: 'Gets information about the current working location or a location stack.'
  },
  {
    id: 'Join-Path',
    name: 'Join-Path',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('ChildPath,Resolve'),
    description: 'Combines a path and a child path into a single path.'
  },
  {
    id: 'Move-Item',
    name: 'Move-Item',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('Destination'),
    description: 'Moves an item from one location to another.',
  },
  {
    id: 'New-Item',
    name: 'New-Item',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('ItemType'),
    description: 'Creates a new item.',
  },
  {
    id: 'Pop-Location',
    name: 'Pop-Location',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('StackName'),
    description: 'Changes the current location to the location most recently pushed onto the stack.'
  },
  {
    id: 'Push-Location',
    name: 'Push-Location',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('StackName'),
    description: 'Adds the current location to the top of a location stack.'
  },
  {
    id: 'Remove-Item',
    name: 'Remove-Item',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('Recurse,Stream'),
    description: 'Deletes items.',
  },
  {
    id: 'Rename-Item',
    name: 'Rename-Item',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('NewName'),
    description: 'Renames an item in a PowerShell provider namespace.',
  },
  {
    id: 'Set-Content',
    name: 'Set-Content',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('NoNewline,Encoding,Stream'),
    description: 'Writes new content or replaces the content in a file.',
  },
  {
    id: 'Set-ItemProperty',
    name: 'Set-ItemProperty',
    category: 'File & Item Management',
    parameters: [], // Name and Value are core
    description: 'Creates or changes the value of a property of an item.',
  },
  {
    id: 'Set-Location',
    name: 'Set-Location',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('StackName'),
    description: 'Sets the current working location to a specified location.'
  },
  {
    id: 'Split-Path',
    name: 'Split-Path',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('Qualifier,NoQualifier,Parent,Leaf,Resolve,IsAbsolute'),
    description: 'Returns the specified part of a path.',
  },
  {
    id: 'Test-Path',
    name: 'Test-Path',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('PathType,IsValid,OlderThan,NewerThan'),
    description: 'Determines whether all elements of a path exist.',
  },
  {
    id: 'Clear-ItemProperty',
    name: 'Clear-ItemProperty',
    category: 'File & Item Management',
    parameters: [],
    description: 'Deletes the value of a property but does not delete the property.'
  },
  {
    id: 'Convert-Path',
    name: 'Convert-Path',
    category: 'File & Item Management',
    parameters: [],
    description: 'Converts a path from a PowerShell path to a PowerShell provider path.'
  },
  {
    id: 'Copy-ItemProperty',
    name: 'Copy-ItemProperty',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('Destination'),
    description: 'Copies a property and its value from a specified location to another location.'
  },
  {
    id: 'Invoke-Item',
    name: 'Invoke-Item',
    category: 'File & Item Management',
    parameters: [],
    description: 'Performs the default action on the specified item.'
  },
  {
    id: 'Move-ItemProperty',
    name: 'Move-ItemProperty',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('Destination'),
    description: 'Moves a property from one location to another.'
  },
  {
    id: 'New-ItemProperty',
    name: 'New-ItemProperty',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('PropertyType'),
    description: 'Creates a new property for an item and sets its value.'
  },
  {
    id: 'Out-File',
    name: 'Out-File',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('Encoding,Append,NoClobber,Width,NoNewline'),
    description: 'Sends output to a file.'
  },
  {
    id: 'Resolve-Path',
    name: 'Resolve-Path',
    category: 'File & Item Management',
    parameters: parseSpecificParamsFromNameList('Relative'),
    description: 'Resolves the wildcard characters in a path, and displays the path contents.'
  },
  {
    id: 'Set-Item',
    name: 'Set-Item',
    category: 'File & Item Management',
    parameters: [],
    description: 'Changes the value of an item to the value specified in the command.'
  },
  {
    id: 'Unblock-File',
    name: 'Unblock-File',
    category: 'File & Item Management',
    parameters: [],
    description: 'Unblocks files that were downloaded from the Internet.'
  },

  // PowerShell Core & Scripting
  {
    id: 'Add-History',
    name: 'Add-History',
    category: 'PowerShell Core & Scripting',
    parameters: [],
    description: 'Adds entries to the session history.'
  },
  {
    id: 'Add-Member',
    name: 'Add-Member',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('MemberType,SecondValue,TypeName,NotePropertyName,NotePropertyValue,NotePropertyMembers'),
    description: 'Adds custom properties and methods to an instance of a PowerShell object.'
  },
  {
    id: 'Add-Type',
    name: 'Add-Type',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('CodeDomProvider,CompilerParameters,TypeDefinition,MemberDefinition,Namespace,UsingNamespace,AssemblyName,Language,ReferencedAssemblies,OutputAssembly,OutputType,IgnoreWarnings'),
    description: 'Adds a Microsoft .NET Framework type (a class or enumeration) to a PowerShell session.'
  },
  {
    id: 'Clear-History',
    name: 'Clear-History',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('CommandLine,Count,Newest'),
    description: 'Deletes entries from the command history.'
  },
  {
    id: 'Clear-Variable',
    name: 'Clear-Variable',
    category: 'PowerShell Core & Scripting',
    parameters: [],
    description: 'Deletes the value of a variable, but does not delete the variable.'
  },
  {
    id: 'Complete-Transaction',
    name: 'Complete-Transaction',
    category: 'PowerShell Core & Scripting',
    parameters: [],
    description: 'Commits the active transaction.'
  },
  {
    id: 'Export-Alias',
    name: 'Export-Alias',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('As,Append,NoClobber'),
    description: 'Exports information about currently defined aliases to a file.'
  },
  {
    id: 'Export-Clixml',
    name: 'Export-Clixml',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Depth,NoClobber,Encoding'),
    description: 'Creates an XML-based representation of an object or objects and stores it in a file.'
  },
  {
    id: 'Export-Console',
    name: 'Export-Console',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('NoClobber'),
    description: 'Exports the names of snap-ins in the current session to a console file.'
  },
  {
    id: 'Export-FormatData',
    name: 'Export-FormatData',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('NoClobber,IncludeScriptBlock'),
    description: 'Saves formatting data from the current session in a formatting file.'
  },
  {
    id: 'Export-ModuleMember',
    name: 'Export-ModuleMember',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Function,Cmdlet,Variable,Alias'),
    description: 'Specifies the module members that are exported.'
  },
  {
    id: 'ForEach-Object',
    name: 'ForEach-Object',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Begin,Process,End,RemainingScripts,MemberName,ArgumentList'),
    description: 'Performs an operation against each item in a collection of input objects.'
  },
  {
    id: 'Get-Alias',
    name: 'Get-Alias',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Definition'),
    description: 'Gets the aliases for the current session.'
  },
  {
    id: 'Get-Command',
    name: 'Get-Command',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Verb,Noun,Module,FullyQualifiedModule,CommandType,TotalCount,Syntax,ShowCommandInfo,ArgumentList,All,ListImported,ParameterName,ParameterType'),
    description: 'Gets all commands that are installed on the computer.',
  },
  {
    id: 'Get-Culture',
    name: 'Get-Culture',
    category: 'PowerShell Core & Scripting',
    parameters: [],
    description: 'Gets the current culture settings in the operating system.'
  },
  {
    id: 'Get-Date',
    name: 'Get-Date',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Date,Year,Month,Day,Hour,Minute,Second,Millisecond,DisplayHint,UFormat,Format'),
    description: 'Gets the current date and time.'
  },
  {
    id: 'Get-Event',
    name: 'Get-Event',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('EventIdentifier'),
    description: 'Gets the events in the PowerShell event queue.'
  },
  {
    id: 'Get-EventSubscriber',
    name: 'Get-EventSubscriber',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('SubscriptionId'),
    description: 'Gets the event subscribers in the current session.'
  },
  {
    id: 'Get-FormatData',
    name: 'Get-FormatData',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('TypeName,PowerShellVersion'),
    description: 'Gets the formatting data in the current session.'
  },
  {
    id: 'Get-Help',
    name: 'Get-Help',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Category,Component,Functionality,Role,Detailed,Full,Examples,Parameter,Online,ShowWindow'),
    description: 'Displays information about PowerShell commands and concepts.',
  },
  {
    id: 'Get-History',
    name: 'Get-History',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Count'),
    description: 'Gets a list of the commands entered during the current session.',
  },
  {
    id: 'Get-Host',
    name: 'Get-Host',
    category: 'PowerShell Core & Scripting',
    parameters: [],
    description: 'Gets an object that represents the current host program.'
  },
  {
    id: 'Get-Member',
    name: 'Get-Member',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('MemberType,View,Static'),
    description: 'Gets the properties and methods of objects.'
  },
  {
    id: 'Get-Module',
    name: 'Get-Module',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('FullyQualifiedName,All,ListAvailable,PSEdition,Refresh,PSSession,CimSession,CimResourceUri,CimNamespace'),
    description: 'Gets the modules that have been imported or that can be imported into the current session.'
  },
  {
    id: 'Get-PSBreakpoint',
    name: 'Get-PSBreakpoint',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Script,Variable,Command,Type'),
    description: 'Gets the breakpoints that are set in the current session.'
  },
  {
    id: 'Get-PSCallStack',
    name: 'Get-PSCallStack',
    category: 'PowerShell Core & Scripting',
    parameters: [],
    description: 'Displays the current call stack.'
  },
  {
    id: 'Get-PSDrive',
    name: 'Get-PSDrive',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('LiteralName,PSProvider'),
    description: 'Gets the PowerShell drives in the current session.'
  },
  {
    id: 'Get-PSProvider',
    name: 'Get-PSProvider',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('PSProvider'),
    description: 'Gets information about the PowerShell providers in the current session.'
  },
  {
    id: 'Get-Random',
    name: 'Get-Random',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('SetSeed,Maximum,Minimum,Count'),
    description: 'Gets a random number, or selects objects randomly from a collection.'
  },
  {
    id: 'Get-Runspace',
    name: 'Get-Runspace',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('InstanceId'),
    description: 'Gets information about the runspaces in the current session.'
  },
  {
    id: 'Get-TimeZone',
    name: 'Get-TimeZone',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('ListAvailable'),
    description: 'Gets the current time zone or a list of available time zones.'
  },
  {
    id: 'Get-TraceSource',
    name: 'Get-TraceSource',
    category: 'PowerShell Core & Scripting',
    parameters: [],
    description: 'Gets the PowerShell components that are instrumented for tracing.'
  },
  {
    id: 'Get-Transaction',
    name: 'Get-Transaction',
    category: 'PowerShell Core & Scripting',
    parameters: [],
    description: 'Gets the current (active) transaction.'
  },
  {
    id: 'Get-TypeData',
    name: 'Get-TypeData',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('TypeName'),
    description: 'Gets the extended type data in the current session.'
  },
  {
    id: 'Get-UICulture',
    name: 'Get-UICulture',
    category: 'PowerShell Core & Scripting',
    parameters: [],
    description: 'Gets the current user interface (UI) culture settings in the operating system.'
  },
  {
    id: 'Get-Unique',
    name: 'Get-Unique',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('AsString,OnType'),
    description: 'Returns the unique items from a sorted list.'
  },
  {
    id: 'Get-Variable',
    name: 'Get-Variable',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('ValueOnly'),
    description: 'Gets the variables in the current console.'
  },
  {
    id: 'Import-Alias',
    name: 'Import-Alias',
    category: 'PowerShell Core & Scripting',
    parameters: [],
    description: 'Imports an alias list from a file.'
  },
  {
    id: 'Import-Clixml',
    name: 'Import-Clixml',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('IncludeTotalCount,Skip,First'),
    description: 'Imports a CLIXML file and creates corresponding objects in PowerShell.'
  },
  {
    id: 'Import-LocalizedData',
    name: 'Import-LocalizedData',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('BindingVariable,UICulture,BaseDirectory,FileName,SupportedCommand'),
    description: 'Imports language-specific data into scripts and functions based on the UI culture that is selected for the operating system.'
  },
  {
    id: 'Import-Module',
    name: 'Import-Module',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Global,Prefix,FullyQualifiedName,Assembly,Function,Cmdlet,Variable,Alias,AsCustomObject,MinimumVersion,MaximumVersion,RequiredVersion,ModuleInfo,ArgumentList,DisableNameChecking,NoClobber,PSSession,CimSession,CimResourceUri,CimNamespace'),
    description: 'Adds modules to the current session.'
  },
  {
    id: 'Invoke-Expression',
    name: 'Invoke-Expression',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Command'),
    description: 'Runs commands or expressions on the local computer.',
  },
  {
    id: 'Invoke-History',
    name: 'Invoke-History',
    category: 'PowerShell Core & Scripting',
    parameters: [],
    description: 'Runs commands from the session history.'
  },
  {
    id: 'Measure-Command',
    name: 'Measure-Command',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Expression'),
    description: 'Measures the time it takes to run script blocks and cmdlets.'
  },
  {
    id: 'New-Alias',
    name: 'New-Alias',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Option'),
    description: 'Creates a new alias.'
  },
  {
    id: 'New-Event',
    name: 'New-Event',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Sender,EventArguments,MessageData'),
    description: 'Creates a new event.'
  },
  {
    id: 'New-EventLog',
    name: 'New-EventLog',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('CategoryResourceFile,LogName,MessageResourceFile,ParameterResourceFile'),
    description: 'Creates a new event log and a new event source on a local or remote computer.'
  },
  {
    id: 'New-Module',
    name: 'New-Module',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('ScriptBlock,Function,Cmdlet,ReturnResult,AsCustomObject,ArgumentList'),
    description: 'Creates a new dynamic module that exists only in memory.'
  },
  {
    id: 'New-ModuleManifest',
    name: 'New-ModuleManifest',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('NestedModules,Guid,Author,CompanyName,Copyright,RootModule,ModuleVersion,ProcessorArchitecture,PowerShellVersion,ClrVersion,DotNetFrameworkVersion,PowerShellHostName,PowerShellHostVersion,RequiredModules,TypesToProcess,FormatsToProcess,ScriptsToProcess,RequiredAssemblies,FileList,ModuleList,FunctionsToExport,AliasesToExport,VariablesToExport,CmdletsToExport,DscResourcesToExport,CompatiblePSEditions,PrivateData,Tags,ProjectUri,LicenseUri,IconUri,ReleaseNotes,HelpInfoUri,DefaultCommandPrefix'),
    description: 'Creates a new module manifest.'
  },
  {
    id: 'New-Object',
    name: 'New-Object',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('TypeName,ComObject,ArgumentList,Strict,Property'),
    description: 'Creates an instance of a Microsoft .NET Framework or COM object.'
  },
  {
    id: 'New-PSDrive',
    name: 'New-PSDrive',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('PSProvider,Root,Persist'),
    description: 'Creates a PowerShell drive.'
  },
  {
    id: 'New-Service',
    name: 'New-Service',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('BinaryPathName,StartupType,DependsOn'),
    description: 'Creates a new Windows service.'
  },
  {
    id: 'New-TimeSpan',
    name: 'New-TimeSpan',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Start,End,Days,Hours,Minutes,Seconds'),
    description: 'Creates a TimeSpan object.'
  },
  {
    id: 'New-Variable',
    name: 'New-Variable',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Option,Visibility'),
    description: 'Creates a new variable.'
  },
  {
    id: 'Out-Default',
    name: 'Out-Default',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Transcript'),
    description: 'Sends the output to the default formatter and to the host console.'
  },
  {
    id: 'Out-GridView',
    name: 'Out-GridView',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Title,Wait,OutputMode'),
    description: 'Sends output to an interactive table in a separate window.'
  },
  {
    id: 'Out-Host',
    name: 'Out-Host',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Paging'),
    description: 'Sends output to the command line.'
  },
  {
    id: 'Out-Null',
    name: 'Out-Null',
    category: 'PowerShell Core & Scripting',
    parameters: [],
    description: 'Deletes output instead of sending it to the console.'
  },
  {
    id: 'Out-Printer',
    name: 'Out-Printer',
    category: 'PowerShell Core & Scripting',
    parameters: [],
    description: 'Sends output to a printer.'
  },
  {
    id: 'Out-String',
    name: 'Out-String',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Stream,Width'),
    description: 'Sends objects to the host as a series of strings.'
  },
  {
    id: 'Read-Host',
    name: 'Read-Host',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Prompt,AsSecureString'),
    description: 'Reads a line of input from the console.'
  },
  {
    id: 'Register-EngineEvent',
    name: 'Register-EngineEvent',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Action,MessageData,SupportEvent,Forward,MaxTriggerCount'),
    description: 'Subscribes to events that are generated by the PowerShell engine and by the New-Event cmdlet.'
  },
  {
    id: 'Register-ObjectEvent',
    name: 'Register-ObjectEvent',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('EventName,Action,MessageData,SupportEvent,Forward,MaxTriggerCount'),
    description: 'Subscribes to the events that are generated by Microsoft .NET Framework objects.'
  },
  {
    id: 'Remove-Event',
    name: 'Remove-Event',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('EventIdentifier'),
    description: 'Deletes events from the PowerShell event queue.'
  },
  {
    id: 'Remove-Module',
    name: 'Remove-Module',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('FullyQualifiedName,ModuleInfo'),
    description: 'Removes modules from the current session.'
  },
  {
    id: 'Remove-PSDrive',
    name: 'Remove-PSDrive',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('LiteralName,PSProvider'),
    description: 'Removes a PowerShell drive.'
  },
  {
    id: 'Remove-TypeData',
    name: 'Remove-TypeData',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('TypeName,TypeData'),
    description: 'Deletes extended type data from the current session.'
  },
  {
    id: 'Remove-Variable',
    name: 'Remove-Variable',
    category: 'PowerShell Core & Scripting',
    parameters: [],
    description: 'Deletes a variable and its value.'
  },
  {
    id: 'Save-Help',
    name: 'Save-Help',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('DestinationPath,Module,FullyQualifiedModule,UICulture,UseDefaultCredentials'),
    description: 'Downloads and saves the newest help files for modules installed on your computer.'
  },
  {
    id: 'Set-Alias',
    name: 'Set-Alias',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Option'),
    description: 'Creates or changes an alias.'
  },
  {
    id: 'Set-Culture',
    name: 'Set-Culture',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('CultureInfo'),
    description: 'Sets a specific culture to be used during the current session.'
  },
  {
    id: 'Set-Date',
    name: 'Set-Date',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Date,Adjust,DisplayHint'),
    description: 'Changes the system time on the computer to a time that you specify.'
  },
  {
    id: 'Set-PSBreakpoint',
    name: 'Set-PSBreakpoint',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Action,Column,Command,Line,Script,Variable,Mode'),
    description: 'Sets a breakpoint on a line, command, or variable.'
  },
  {
    id: 'Set-PSDebug',
    name: 'Set-PSDebug',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Trace,Step,Strict,Off'),
    description: 'Turns script debugging features on and off, sets the trace level, and toggles strict mode.'
  },
  {
    id: 'Set-StrictMode',
    name: 'Set-StrictMode',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Off,Version'),
    description: 'Establishes strict mode for the current scope and for all descendent scopes.'
  },
  {
    id: 'Set-TimeZone',
    name: 'Set-TimeZone',
    category: 'PowerShell Core & Scripting',
    parameters: [], // Name, Id, InputObject, PassThru are common
    description: 'Sets the system time zone to a specified time zone.'
  },
  {
    id: 'Set-TraceSource',
    name: 'Set-TraceSource',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Option,ListenerOption,FilePath,Debugger,PSHost,RemoveListener,RemoveFileListener'),
    description: 'Configures tracing for PowerShell components.'
  },
  {
    id: 'Set-Variable',
    name: 'Set-Variable',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Option,Visibility'),
    description: 'Sets the value of a variable. Creates the variable if one with the same name does not exist.'
  },
  {
    id: 'Show-Command',
    name: 'Show-Command',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Height,Width,NoCommonParameter,ErrorPopup'),
    description: 'Creates PowerShell commands in a command window.'
  },
  {
    id: 'Start-Sleep',
    name: 'Start-Sleep',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Seconds,Milliseconds'),
    description: 'Suspends the activity in a script or session for the specified period of time.',
  },
  {
    id: 'Start-Transaction',
    name: 'Start-Transaction',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Timeout,Independent,RollbackPreference'),
    description: 'Starts a transaction.'
  },
  {
    id: 'Trace-Command',
    name: 'Trace-Command',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Option,Expression,Command,ArgumentList,ListenerOption,FilePath,Debugger,PSHost'),
    description: 'Configures and starts a trace of the specified expression or command.'
  },
  {
    id: 'Undo-Transaction',
    name: 'Undo-Transaction',
    category: 'PowerShell Core & Scripting',
    parameters: [],
    description: 'Rolls back the active transaction.'
  },
  {
    id: 'Unregister-Event',
    name: 'Unregister-Event',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('SubscriptionId'),
    description: 'Cancels an event subscription.'
  },
  {
    id: 'Update-FormatData',
    name: 'Update-FormatData',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('AppendPath,PrependPath'),
    description: 'Updates the formatting data in the current session.'
  },
  {
    id: 'Update-Help',
    name: 'Update-Help',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Module,FullyQualifiedModule,SourcePath,Recurse,UICulture,UseDefaultCredentials'),
    description: 'Downloads and installs the newest help files for modules installed on your computer.'
  },
  {
    id: 'Update-List',
    name: 'Update-List',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Add,Remove,Replace,Property'),
    description: 'Adds items to or removes items from a collection.'
  },
  {
    id: 'Update-TypeData',
    name: 'Update-TypeData',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('MemberType,MemberName,SecondValue,TypeConverter,TypeAdapter,SerializationMethod,TargetTypeForDeserialization,SerializationDepth,DefaultDisplayProperty,InheritPropertySerializationSet,StringSerializationSource,DefaultDisplayPropertySet,DefaultKeyPropertySet,PropertySerializationSet,TypeName,TypeData,AppendPath,PrependPath'),
    description: 'Updates the extended type data in the session.'
  },
  {
    id: 'Use-Transaction',
    name: 'Use-Transaction',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('TransactedScript'),
    description: 'Adds the script block to an active transaction.'
  },
  {
    id: 'Wait-Debugger',
    name: 'Wait-Debugger',
    category: 'PowerShell Core & Scripting',
    parameters: [],
    description: 'Stops a script in the debugger before running the next statement in the script.'
  },
  {
    id: 'Wait-Event',
    name: 'Wait-Event',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Timeout'),
    description: 'Waits until a particular event is raised before continuing to run.'
  },
  {
    id: 'Write-Debug',
    name: 'Write-Debug',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Message'),
    description: 'Writes a debug message to the console.'
  },
  {
    id: 'Write-Error',
    name: 'Write-Error',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Exception,Message,ErrorRecord,Category,ErrorId,TargetObject,RecommendedAction,CategoryActivity,CategoryReason,CategoryTargetName,CategoryTargetType'),
    description: 'Writes an object to the error stream.'
  },
  {
    id: 'Write-Host',
    name: 'Write-Host',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Object,NoNewline,Separator,ForegroundColor,BackgroundColor'),
    description: 'Writes customized output to a host.',
  },
  {
    id: 'Write-Information',
    name: 'Write-Information',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('MessageData,Tags'),
    description: 'Specifies how PowerShell handles information stream data for a command.'
  },
  {
    id: 'Write-Output',
    name: 'Write-Output',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('NoEnumerate'),
    description: 'Sends the specified objects to the next command in the pipeline.',
  },
  {
    id: 'Write-Progress',
    name: 'Write-Progress',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Activity,Status,PercentComplete,SecondsRemaining,CurrentOperation,ParentId,Completed,SourceId'),
    description: 'Displays a progress bar within a PowerShell command window.'
  },
  {
    id: 'Write-Verbose',
    name: 'Write-Verbose',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Message'),
    description: 'Writes text to the verbose message stream.'
  },
  {
    id: 'Write-Warning',
    name: 'Write-Warning',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParamsFromNameList('Message'),
    description: 'Writes a warning message.'
  },


  // Data Handling & Formatting
  {
    id: 'Compare-Object',
    name: 'Compare-Object',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('DifferenceObject,SyncWindow,ExcludeDifferent,IncludeEqual,Culture,CaseSensitive'),
    description: 'Compares two sets of objects.'
  },
  {
    id: 'ConvertFrom-Csv',
    name: 'ConvertFrom-Csv',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('Delimiter,UseCulture,Header'),
    description: 'Converts character-separated value (CSV) data into PSObject type objects.'
  },
  {
    id: 'ConvertFrom-Json',
    name: 'ConvertFrom-Json',
    category: 'Data Handling & Formatting',
    parameters: [],
    description: 'Converts a JSON-formatted string to a custom object.',
  },
  {
    id: 'ConvertFrom-String',
    name: 'ConvertFrom-String',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('Delimiter,PropertyNames,TemplateFile,TemplateContent,IncludeExtent,UpdateTemplate'),
    description: 'Formats a string by using a template.'
  },
  {
    id: 'ConvertFrom-StringData',
    name: 'ConvertFrom-StringData',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('StringData'),
    description: 'Converts a string containing one or more key/value pairs to a hash table.'
  },
  {
    id: 'Convert-String',
    name: 'Convert-String',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('Example'),
    description: 'Formats a string.'
  },
  {
    id: 'ConvertTo-Csv',
    name: 'ConvertTo-Csv',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('Delimiter,UseCulture,NoTypeInformation'),
    description: 'Converts .NET objects into a series of character-separated value (CSV) strings.'
  },
  {
    id: 'ConvertTo-Html',
    name: 'ConvertTo-Html',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('Body,Head,Title,As,CssUri,Fragment,PostContent,PreContent'),
    description: 'Converts Microsoft .NET Framework objects into HTML that can be displayed in a Web browser.',
  },
  {
    id: 'ConvertTo-Json',
    name: 'ConvertTo-Json',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('Depth,Compress'),
    description: 'Converts an object to a JSON-formatted string.',
  },
  {
    id: 'ConvertTo-Xml',
    name: 'ConvertTo-Xml',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('Depth,NoTypeInformation,As'),
    description: 'Creates an XML-based representation of an object or objects.',
  },
  {
    id: 'Export-Csv',
    name: 'Export-Csv',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('NoClobber,Encoding,Append,Delimiter,UseCulture,NoTypeInformation'),
    description: 'Converts objects into a series of comma-separated value (CSV) strings and saves them in a CSV file.',
  },
  {
    id: 'Format-Custom',
    name: 'Format-Custom',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('Depth,GroupBy,View,ShowError,DisplayError,Expand'),
    description: 'Uses a custom view to format the output.'
  },
  {
    id: 'Format-List',
    name: 'Format-List',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('GroupBy,View,ShowError,DisplayError,Expand'),
    description: 'Formats the output as a list of properties in which each property is displayed on a separate line.'
  },
  {
    id: 'Format-Table',
    name: 'Format-Table',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('AutoSize,RepeatHeader,HideTableHeaders,Wrap,GroupBy,View,ShowError,DisplayError,Expand'),
    description: 'Formats the output as a table.'
  },
  {
    id: 'Format-Wide',
    name: 'Format-Wide',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('AutoSize,Column,GroupBy,View,ShowError,DisplayError'),
    description: 'Formats objects as a wide table that displays only one property of each object.'
  },
  {
    id: 'Group-Object',
    name: 'Group-Object',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('NoElement,AsHashTable,AsString,Culture,CaseSensitive'),
    description: 'Groups objects that contain the same value for specified properties.'
  },
  {
    id: 'Import-Csv',
    name: 'Import-Csv',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('Delimiter,UseCulture,Header,Encoding'),
    description: 'Creates table-like custom objects from the items in a CSV file.',
  },
  {
    id: 'Measure-Object',
    name: 'Measure-Object',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('Sum,Average,Maximum,Minimum,Line,Word,Character,IgnoreWhiteSpace'),
    description: 'Calculates the numeric properties of objects, and the characters, words, and lines in string objects.',
  },
  {
    id: 'Select-Object',
    name: 'Select-Object',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('ExcludeProperty,ExpandProperty,Unique,Last,First,Skip,SkipLast,Wait,Index'),
    description: 'Selects objects or object properties.',
  },
  {
    id: 'Select-String',
    name: 'Select-String',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('Pattern,SimpleMatch,CaseSensitive,Quiet,List,NotMatch,AllMatches,Encoding,Context'),
    description: 'Finds text in strings and files.'
  },
  {
    id: 'Select-Xml',
    name: 'Select-Xml',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('Xml,Content,XPath,Namespace'),
    description: 'Finds text in an XML string or document.'
  },
  {
    id: 'Sort-Object',
    name: 'Sort-Object',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('Descending,Unique,Culture,CaseSensitive'),
    description: 'Sorts objects by property values.',
  },
  {
    id: 'Tee-Object',
    name: 'Tee-Object',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('FilePath,Append,Variable'),
    description: 'Saves command output in a file or variable and also sends it down the pipeline.'
  },
  {
    id: 'Where-Object',
    name: 'Where-Object',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParamsFromNameList('FilterScript,EQ,CEQ,NE,CNE,GT,CGT,LT,CLT,GE,CGE,LE,CLE,Like,CLike,NotLike,CNotLike,Match,CMatch,NotMatch,CMatch,Contains,CContains,NotContains,CNotContains,In,CIn,NotIn,CNotIn,Is,IsNot'),
    description: 'Selects objects from a collection based on their property values.'
  },


  // Networking
  {
    id: 'Connect-PSSession',
    name: 'Connect-PSSession',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('Session,ApplicationName,ConfigurationName,ConnectionUri,AllowRedirection,InstanceId,Authentication,CertificateThumbprint,Port,UseSSL,SessionOption,ThrottleLimit'),
    description: 'Reconnects to user-managed PowerShell sessions (PSSessions) that are disconnected.'
  },
  {
    id: 'Connect-WSMan',
    name: 'Connect-WSMan',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('ApplicationName,Authentication,Port,SessionOption,SSL,ConnectionURI,OptionSet,ExtendedConnect,Locale,UILocale,Impersonation'),
    description: 'Connects to the WinRM service on a remote computer.'
  },
  {
    id: 'Disable-PSRemoting',
    name: 'Disable-PSRemoting',
    category: 'Networking',
    parameters: [],
    description: 'Disables all session configurations on the computer.'
  },
  {
    id: 'Disable-PSSessionConfiguration',
    name: 'Disable-PSSessionConfiguration',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('NoServiceRestart'),
    description: 'Disables the session configurations on the computer.'
  },
  {
    id: 'Disable-WSManCredSSP',
    name: 'Disable-WSManCredSSP',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('Role'),
    description: 'Disables Credential Security Support Provider (CredSSP) authentication on a client or server computer.'
  },
  {
    id: 'Disconnect-PSSession',
    name: 'Disconnect-PSSession',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('Session,IdleTimeoutSec,OutputBufferingMode,ThrottleLimit,InstanceId'),
    description: 'Disconnects from a PowerShell session (PSSession).'
  },
  {
    id: 'Disconnect-WSMan',
    name: 'Disconnect-WSMan',
    category: 'Networking',
    parameters: [],
    description: 'Disconnects from the WinRM service on a remote computer.'
  },
  {
    id: 'Enable-PSRemoting',
    name: 'Enable-PSRemoting',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('SkipNetworkProfileCheck'),
    description: 'Configures the computer to receive PowerShell remote commands.'
  },
  {
    id: 'Enable-PSSessionConfiguration',
    name: 'Enable-PSSessionConfiguration',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('SecurityDescriptorSddl,SkipNetworkProfileCheck,NoServiceRestart'),
    description: 'Enables the session configurations that have been disabled.'
  },
  {
    id: 'Enable-WSManCredSSP',
    name: 'Enable-WSManCredSSP',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('Role,DelegateComputer'),
    description: 'Enables Credential Security Support Provider (CredSSP) authentication on a client or on a server computer.'
  },
  {
    id: 'Enter-PSSession',
    name: 'Enter-PSSession',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('Session,ConnectionUri,InstanceId,EnableNetworkAccess,VMId,VMName,ContainerId,ConfigurationName,RunAsAdministrator,Port,UseSSL,ApplicationName,AllowRedirection,SessionOption,Authentication,CertificateThumbprint'),
    description: 'Starts an interactive session with a remote computer.'
  },
  {
    id: 'Exit-PSSession',
    name: 'Exit-PSSession',
    category: 'Networking',
    parameters: [],
    description: 'Ends an interactive session with a remote computer.'
  },
  {
    id: 'Export-PSSession',
    name: 'Export-PSSession',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('OutputModule,Encoding,CommandName,AllowClobber,ArgumentList,CommandType,Module,FullyQualifiedModule,FormatTypeName,Certificate,Session'),
    description: 'Imports commands from another session and saves them in a Windows PowerShell module.'
  },
  {
    id: 'Get-PSSession',
    name: 'Get-PSSession',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('ApplicationName,ConnectionUri,ConfigurationName,AllowRedirection,InstanceId,Authentication,CertificateThumbprint,Port,UseSSL,ThrottleLimit,State,SessionOption,ContainerId,VMId,VMName'),
    description: 'Gets the PowerShell sessions (PSSessions) in the current session.'
  },
  {
    id: 'Get-PSSessionCapability',
    name: 'Get-PSSessionCapability',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('ConfigurationName,Username,Full'),
    description: 'Gets the capabilities of a specific user on a constrained remoting endpoint.'
  },
  {
    id: 'Get-PSSessionConfiguration',
    name: 'Get-PSSessionConfiguration',
    category: 'Networking',
    parameters: [],
    description: 'Gets the registered session configurations on the computer.'
  },
  {
    id: 'Get-WSManCredSSP',
    name: 'Get-WSManCredSSP',
    category: 'Networking',
    parameters: [],
    description: 'Gets the Credential Security Support Provider (CredSSP) related configuration for the client and server.'
  },
  {
    id: 'Get-WSManInstance',
    name: 'Get-WSManInstance',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('ApplicationName,ConnectionURI,Dialect,Enumerate,OptionSet,Port,ResourceURI,SessionOption,Shallow,IncludeClassOrigin,IncludeQualifiers,IncludeSystemProperties,SelectorSet,SSL,AssociationFilter,AssociationSourceFilter,ResultClass,ExcludeProperty,Authentication,Fragment,FilePath'),
    description: 'Displays management information for a resource instance.'
  },
  {
    id: 'Import-PSSession',
    name: 'Import-PSSession',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('Prefix,DisableNameChecking,CommandName,AllowClobber,ArgumentList,CommandType,Module,FullyQualifiedModule,FormatTypeName,Certificate,Session'),
    description: 'Imports commands from another session into the current session.'
  },
  {
    id: 'Invoke-Command',
    name: 'Invoke-Command',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('Session,Port,UseSSL,ConfigurationName,ApplicationName,ThrottleLimit,ConnectionUri,InDisconnectedSession,SessionName,HideComputerName,JobName,ScriptBlock,NoNewScope,FilePath,AllowRedirection,SessionOption,Authentication,EnableNetworkAccess,RunAsAdministrator,ArgumentList,VMId,VMName,ContainerId,CertificateThumbprint'),
    description: 'Runs commands on local and remote computers.'
  },
  {
    id: 'Invoke-RestMethod',
    name: 'Invoke-RestMethod',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('Method,UseBasicParsing,Uri,WebSession,SessionVariable,UseDefaultCredentials,CertificateThumbprint,Certificate,UserAgent,DisableKeepAlive,TimeoutSec,Headers,MaximumRedirection,Proxy,ProxyCredential,ProxyUseDefaultCredentials,Body,ContentType,TransferEncoding,InFile,OutFile'),
    description: 'Sends an HTTP or HTTPS request to a RESTful web service.',
  },
  {
    id: 'Invoke-WebRequest',
    name: 'Invoke-WebRequest',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('UseBasicParsing,Uri,WebSession,SessionVariable,UseDefaultCredentials,CertificateThumbprint,Certificate,UserAgent,DisableKeepAlive,TimeoutSec,Headers,MaximumRedirection,Method,Proxy,ProxyCredential,ProxyUseDefaultCredentials,Body,ContentType,TransferEncoding,InFile,OutFile'),
    description: 'Gets content from a web page on the Internet.',
  },
  {
    id: 'Invoke-WSManAction',
    name: 'Invoke-WSManAction',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('Action,ApplicationName,ConnectionURI,FilePath,OptionSet,Port,ResourceURI,SelectorSet,SessionOption,SSL,ValueSet,Authentication,Locale,UILocale,Impersonation,Fragment'),
    description: 'Invokes an action on the object that is specified by the Resource URI and by the selectors.'
  },
  {
    id: 'New-PSSession',
    name: 'New-PSSession',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('Session,EnableNetworkAccess,ConfigurationName,VMId,VMName,ContainerId,RunAsAdministrator,Port,UseSSL,ApplicationName,ThrottleLimit,ConnectionUri,AllowRedirection,SessionOption,Authentication,CertificateThumbprint'),
    description: 'Creates a persistent connection to a local or remote computer.'
  },
  {
    id: 'New-PSSessionConfigurationFile',
    name: 'New-PSSessionConfigurationFile',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('SchemaVersion,Guid,Author,CompanyName,Copyright,SessionType,TranscriptDirectory,RunAsVirtualAccount,RunAsVirtualAccountGroups,MountUserDrive,UserDriveMaximumSize,GroupManagedServiceAccount,ScriptsToProcess,RoleDefinitions,RequiredGroups,LanguageMode,ExecutionPolicy,PowerShellVersion,ModulesToImport,VisibleAliases,VisibleCmdlets,VisibleFunctions,VisibleExternalCommands,VisibleProviders,AliasDefinitions,FunctionDefinitions,VariableDefinitions,EnvironmentVariables,TypesToProcess,FormatsToProcess,AssembliesToLoad,Full'),
    description: 'Creates a file that defines a session configuration.'
  },
  {
    id: 'New-PSSessionOption',
    name: 'New-PSSessionOption',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('MaximumRedirection,NoCompression,NoMachineProfile,Culture,UICulture,MaximumReceivedDataSizePerCommand,MaximumReceivedObjectSize,OutputBufferingMode,MaxConnectionRetryCount,ApplicationArguments,OpenTimeout,CancelTimeout,IdleTimeout,ProxyAccessType,ProxyAuthentication,ProxyCredential,SkipCACheck,SkipCNCheck,SkipRevocationCheck,OperationTimeout,NoEncryption,UseUTF16,IncludePortInSPN'),
    description: 'Creates an object that contains advanced options for a PSSession.'
  },
  {
    id: 'New-PSTransportOption',
    name: 'New-PSTransportOption',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('MaxIdleTimeoutSec,ProcessIdleTimeoutSec,MaxSessions,MaxConcurrentCommandsPerSession,MaxSessionsPerUser,MaxMemoryPerSessionMB,MaxProcessesPerSession,MaxConcurrentUsers,IdleTimeoutSec,OutputBufferingMode'),
    description: 'Creates an object that contains transport options for a session configuration.'
  },
  {
    id: 'New-WebServiceProxy',
    name: 'New-WebServiceProxy',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('Uri,Class,Namespace,UseDefaultCredential'),
    description: 'Creates a Web service proxy object that lets you use and manage the Web service in PowerShell.'
  },
  {
    id: 'New-WSManInstance',
    name: 'New-WSManInstance',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('ApplicationName,ConnectionURI,Dialect,FilePath,OptionSet,Port,ResourceURI,SelectorSet,SessionOption,SSL,ValueSet,Authentication,Fragment'),
    description: 'Creates a new instance of a management resource.'
  },
  {
    id: 'New-WSManSessionOption',
    name: 'New-WSManSessionOption',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('NoEncryption,NoMachineProfile,ProxyAccessType,ProxyAuthentication,ProxyCredential,SkipCACheck,SkipCNCheck,SkipRevocationCheck,SPNPort,OperationTimeout,UseUTF16'),
    description: 'Creates a hash table of session options that can be used with the New-PSSession, Invoke-Command, or Enter-PSSession cmdlets.'
  },
  {
    id: 'Receive-PSSession',
    name: 'Receive-PSSession',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('Session,ApplicationName,ConfigurationName,ConnectionUri,AllowRedirection,InstanceId,OutTarget,JobName,Authentication,CertificateThumbprint,Port,UseSSL,SessionOption'),
    description: 'Gets the results of commands that are running in a disconnected session.'
  },
  {
    id: 'Register-PSSessionConfiguration',
    name: 'Register-PSSessionConfiguration',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('ProcessorArchitecture,SessionType,AssemblyName,ApplicationBase,ConfigurationTypeName,RunAsCredential,ThreadApartmentState,ThreadOptions,AccessMode,UseSharedProcess,StartupScript,MaximumReceivedDataSizePerCommandMB,MaximumReceivedObjectSizeMB,SecurityDescriptorSddl,ShowSecurityDescriptorUI,NoServiceRestart,PSVersion,SessionTypeOption,TransportOption,ModulesToImport'),
    description: 'Creates and registers a new session configuration.'
  },
  {
    id: 'Remove-PSSession',
    name: 'Remove-PSSession',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('Session,ContainerId,VMId,VMName,InstanceId'),
    description: 'Closes one or more PowerShell sessions (PSSessions).'
  },
  {
    id: 'Remove-WSManInstance',
    name: 'Remove-WSManInstance',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('ApplicationName,ConnectionURI,Dialect,FilePath,OptionSet,Port,ResourceURI,SelectorSet,SessionOption,SSL,Authentication,Fragment'),
    description: 'Deletes a management resource instance.'
  },
  {
    id: 'Resolve-DnsName',
    name: 'Resolve-DnsName',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('Type,Server,DnsOnly,CacheOnly,NoHostsFile'),
    description: 'Performs a DNS query for the specified name.',
  },
  {
    id: 'Send-MailMessage',
    name: 'Send-MailMessage',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('Attachments,Bcc,Body,BodyAsHtml,Encoding,Cc,DeliveryNotificationOption,From,SmtpServer,Priority,Subject,To,UseSsl,Port'),
    description: 'Sends an e-mail message.',
  },
  {
    id: 'Set-PSSessionConfiguration',
    name: 'Set-PSSessionConfiguration',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('AssemblyName,ApplicationBase,ConfigurationTypeName,RunAsCredential,ThreadApartmentState,ThreadOptions,AccessMode,UseSharedProcess,StartupScript,MaximumReceivedDataSizePerCommandMB,MaximumReceivedObjectSizeMB,SecurityDescriptorSddl,ShowSecurityDescriptorUI,NoServiceRestart,PSVersion,SessionTypeOption,TransportOption,ModulesToImport'),
    description: 'Changes the properties of a registered session configuration.'
  },
  {
    id: 'Set-WSManInstance',
    name: 'Set-WSManInstance',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('ApplicationName,ConnectionURI,Dialect,FilePath,OptionSet,Port,ResourceURI,SelectorSet,SessionOption,SSL,ValueSet,Authentication,Fragment'),
    description: 'Modifies the management information that is related to a resource.'
  },
  {
    id: 'Set-WSManQuickConfig',
    name: 'Set-WSManQuickConfig',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('UseSSL,SkipNetworkProfileCheck'),
    description: 'Configures the local computer for remote management.'
  },
  {
    id: 'Test-Connection',
    name: 'Test-Connection',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('DcomAuthentication,WsmanAuthentication,Protocol,BufferSize,Count,Source,Impersonation,ThrottleLimit,TimeToLive,Delay,Quiet'),
    description: 'Sends ICMP echo request packets ("pings") to one or more remote computers.',
  },
  {
    id: 'Test-PSSessionConfigurationFile',
    name: 'Test-PSSessionConfigurationFile',
    category: 'Networking',
    parameters: [],
    description: 'Verifies the keys and values in a session configuration file.'
  },
  {
    id: 'Test-WSMan',
    name: 'Test-WSMan',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('ApplicationName,Authentication,Port,ConnectionURI'),
    description: 'Tests whether the WinRM service is running on a local or remote computer.'
  },
  {
    id: 'Unregister-PSSessionConfiguration',
    name: 'Unregister-PSSessionConfiguration',
    category: 'Networking',
    parameters: parseSpecificParamsFromNameList('NoServiceRestart'),
    description: 'Deletes registered session configurations from the computer.'
  },

  // Security
  {
    id: 'ConvertFrom-SecureString',
    name: 'ConvertFrom-SecureString',
    category: 'Security',
    parameters: parseSpecificParamsFromNameList('SecureString,AsPlainText,Key'),
    description: 'Converts a secure string to an encrypted standard string.'
  },
  {
    id: 'ConvertTo-SecureString',
    name: 'ConvertTo-SecureString',
    category: 'Security',
    parameters: parseSpecificParamsFromNameList('String,AsPlainText,Key'),
    description: 'Converts encrypted standard strings to secure strings.'
  },
  {
    id: 'Get-Acl',
    name: 'Get-Acl',
    category: 'Security',
    parameters: parseSpecificParamsFromNameList('Audit'),
    description: 'Gets the security descriptor for a resource, such as a file or registry key.',
  },
  {
    id: 'Get-AuthenticodeSignature',
    name: 'Get-AuthenticodeSignature',
    category: 'Security',
    parameters: parseSpecificParamsFromNameList('FilePath,Content'),
    description: 'Gets information about the Authenticode signature for a file or file content.'
  },
  {
    id: 'Get-CmsMessage',
    name: 'Get-CmsMessage',
    category: 'Security',
    parameters: parseSpecificParamsFromNameList('Content'),
    description: 'Gets content that has been encrypted by using the Cryptographic Message Syntax format.'
  },
  {
    id: 'Get-Credential',
    name: 'Get-Credential',
    category: 'Security',
    parameters: parseSpecificParamsFromNameList('UserName,Message'),
    description: 'Gets a credential object based on a user name and password.'
  },
  {
    id: 'Get-ExecutionPolicy',
    name: 'Get-ExecutionPolicy',
    category: 'Security',
    parameters: parseSpecificParamsFromNameList('List'),
    description: 'Gets the execution policies for the current session.',
  },
  {
    id: 'Get-PfxData',
    name: 'Get-PfxData',
    category: 'Security',
    parameters: parseSpecificParamsFromNameList('Password,ProtectTo'),
    description: 'Extracts information from PFX certificate files.'
  },
  {
    id: 'Protect-CmsMessage',
    name: 'Protect-CmsMessage',
    category: 'Security',
    parameters: parseSpecificParamsFromNameList('To,Content,OutFile,Algorithm,SecureString'),
    description: 'Encrypts content by using the Cryptographic Message Syntax format.'
  },
  {
    id: 'Set-Acl',
    name: 'Set-Acl',
    category: 'Security',
    parameters: parseSpecificParamsFromNameList('AclObject,ClearCentralAccessPolicy'),
    description: 'Changes the security descriptor of a specified item, such as a file or a registry key.',
  },
  {
    id: 'Set-AuthenticodeSignature',
    name: 'Set-AuthenticodeSignature',
    category: 'Security',
    parameters: parseSpecificParamsFromNameList('Certificate,FilePath,IncludeChain,TimestampServer,HashAlgorithm'),
    description: 'Adds an Authenticode signature to a PowerShell script or other file.'
  },
  {
    id: 'Set-ExecutionPolicy',
    name: 'Set-ExecutionPolicy',
    category: 'Security',
    parameters: parseSpecificParamsFromNameList('ExecutionPolicy'),
    description: 'Changes the user preference for the PowerShell execution policy.',
  },
  {
    id: 'Unprotect-CmsMessage',
    name: 'Unprotect-CmsMessage',
    category: 'Security',
    parameters: parseSpecificParamsFromNameList('To,Content,OutFile,EventMessage,IncludeContext,Unprotect'),
    description: 'Decrypts content that has been encrypted using the Cryptographic Message Syntax format.'
  },

  // Application Management
  {
    id: 'Add-AppxPackage',
    name: 'Add-AppxPackage',
    category: 'Application Management',
    parameters: parseSpecificParamsFromNameList('DependencyPath,Register,DisableDevelopmentMode,ForceApplicationShutdown,ForceTargetApplicationShutdown,ForceUpdateFromAnyVersion,InstallAllResources,PackageFamilyName,RequiredContentGroupOnly,RetainFilesOnFailure,StageInPlace,StubPackageOption,UpdateIfFound,Volume'),
    description: 'Adds a signed app package to a user account.',
  },
  {
    id: 'Get-AppxPackage',
    name: 'Get-AppxPackage',
    category: 'Application Management',
    parameters: parseSpecificParamsFromNameList('Publisher,AllUsers,User'),
    description: 'Gets a list of the app packages that are installed in a user profile.',
  },
  {
    id: 'Remove-AppxPackage',
    name: 'Remove-AppxPackage',
    category: 'Application Management',
    parameters: parseSpecificParamsFromNameList('Package,AllUsers,PreserveApplicationData,User'),
    description: 'Removes an app package from a user account.',
  },

  // Hyper-V
  {
    id: 'Get-VM',
    name: 'Get-VM',
    category: 'Hyper-V',
    parameters: [],
    description: 'Gets the virtual machines from one or more Hyper-V hosts.',
  },
  {
    id: 'New-VM',
    name: 'New-VM',
    category: 'Hyper-V',
    parameters: parseSpecificParamsFromNameList('MemoryStartupBytes,BootDevice,VHDPath,SwitchName,Generation'),
    description: 'Creates a new virtual machine.'
  },
  {
    id: 'Remove-VM',
    name: 'Remove-VM',
    category: 'Hyper-V',
    parameters: parseSpecificParamsFromNameList('VM'),
    description: 'Deletes a virtual machine.'
  },
  {
    id: 'Start-VM',
    name: 'Start-VM',
    category: 'Hyper-V',
    parameters: parseSpecificParamsFromNameList('VM'),
    description: 'Starts a virtual machine.',
  },
  {
    id: 'Stop-VM',
    name: 'Stop-VM',
    category: 'Hyper-V',
    parameters: parseSpecificParamsFromNameList('VM,TurnOff,Save'),
    description: 'Shuts down, turns off, or saves a virtual machine.',
  },
  {
    id: 'Checkpoint-VM',
    name: 'Checkpoint-VM',
    category: 'Hyper-V',
    parameters: parseSpecificParamsFromNameList('VM,SnapshotName'),
    description: 'Creates a checkpoint of a virtual machine.'
  },
  {
    id: 'Get-VMSnapshot',
    name: 'Get-VMSnapshot',
    category: 'Hyper-V',
    parameters: parseSpecificParamsFromNameList('VMName,SnapshotType'),
    description: 'Gets the checkpoints of a virtual machine or a checkpoint.'
  },
  {
    id: 'Restore-VMSnapshot',
    name: 'Restore-VMSnapshot',
    category: 'Hyper-V',
    parameters: parseSpecificParamsFromNameList('VMName'),
    description: 'Restores a virtual machine checkpoint.'
  },
  
  // Module Management (Subset from Core, repeated for clarity if specifically asked)
  // Get-Module, Import-Module, New-Module, New-ModuleManifest, Remove-Module are already in Core

  {
    id: 'Test-ModuleManifest',
    name: 'Test-ModuleManifest',
    category: 'Module Management',
    parameters: [],
    description: 'Verifies that a module manifest file accurately describes the contents of a module.'
  },

  // PowerShell Snap-ins (Legacy)
  {
    id: 'Add-PSSnapin',
    name: 'Add-PSSnapin',
    category: 'PowerShell Snap-ins',
    parameters: [],
    description: 'Adds one or more Windows PowerShell snap-ins to the current session.'
  },
  {
    id: 'Get-PSSnapin',
    name: 'Get-PSSnapin',
    category: 'PowerShell Snap-ins',
    parameters: parseSpecificParamsFromNameList('Registered'),
    description: 'Gets the Windows PowerShell snap-ins on the computer.'
  },
  {
    id: 'Remove-PSSnapin',
    name: 'Remove-PSSnapin',
    category: 'PowerShell Snap-ins',
    parameters: [],
    description: 'Removes Windows PowerShell snap-ins from the current session.'
  },
  // Export-PSSession is already in Networking
];

// This list might be needed in ParameterEditDialog as well, ensure it's consistent or imported.
export const COMMON_PARAMETERS_LIST_FOR_DIALOG: { name: string }[] = COMMON_POWERHSHELL_PARAMETERS.map(name => ({name}));

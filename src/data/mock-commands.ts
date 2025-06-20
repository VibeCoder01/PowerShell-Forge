
import type { BasePowerShellCommand } from '@/types/powershell';

// Descriptions are kept concise. Specific parameters are listed.
// Common PowerShell parameters (Verbose, Debug, ErrorAction, etc.) are handled by a dedicated UI section
// and are omitted from the 'parameters' list here.

const commonParamsToExclude = [
  'Verbose', 'Debug', 'ErrorAction', 'WarningAction', 'InformationAction', 
  'ErrorVariable', 'WarningVariable', 'InformationVariable', 'OutVariable', 
  'OutBuffer', 'PipelineVariable', 'WhatIf', 'Confirm', 'UseTransaction'
];

// Helper to parse parameter string and exclude common ones
function parseSpecificParams(paramString?: string): { name: string }[] {
  if (!paramString) return [];
  return paramString.split(',')
    .map(p => p.trim())
    .filter(p => p && !commonParamsToExclude.includes(p) && p.length > 0 && !p.startsWith('-')) // Ensure parameter is not empty and not a switch already
    .map(p => ({ name: p.replace(/^-/, '') })); // Remove leading hyphen if present
}


export const mockCommands: BasePowerShellCommand[] = [
  // Scripting Constructs
  {
    id: 'internal-add-comment', // Special ID to be handled differently on drop
    name: 'Add Comment',
    category: 'Scripting Constructs',
    parameters: [],
    description: 'Adds a # comment line to the script.',
  },

  // System Management
  {
    id: 'Add-Computer',
    name: 'Add-Computer',
    category: 'System Management',
    parameters: parseSpecificParams('ComputerName, LocalCredential, UnjoinDomainCredential, DomainName, OUPath, Server, Unsecure, Options, WorkgroupName, Restart, PassThru, NewName, Force'),
    description: 'Adds the local computer or remote computers to a domain or a workgroup.',
  },
  {
    id: 'Checkpoint-Computer',
    name: 'Checkpoint-Computer',
    category: 'System Management',
    parameters: parseSpecificParams('Description, RestorePointType'),
    description: 'Creates a system restore point on the local computer.',
  },
  {
    id: 'Clear-EventLog',
    name: 'Clear-EventLog',
    category: 'System Management',
    parameters: parseSpecificParams('LogName, ComputerName'),
    description: 'Clears all entries from specified event logs on the local or remote computers.',
  },
  {
    id: 'Clear-RecycleBin',
    name: 'Clear-RecycleBin',
    category: 'System Management',
    parameters: parseSpecificParams('DriveLetter, Force'),
    description: 'Clears the recycle bin on the specified drive.',
  },
  {
    id: 'Get-ComputerInfo',
    name: 'Get-ComputerInfo',
    category: 'System Management',
    parameters: parseSpecificParams('Property'),
    description: 'Gets system and operating system properties.'
  },
  {
    id: 'Get-EventLog',
    name: 'Get-EventLog',
    category: 'System Management',
    parameters: parseSpecificParams('LogName, ComputerName, Newest, After, Before, UserName, InstanceId, Index, EntryType, Source, Message, AsBaseObject, List, AsString'),
    description: 'Gets events in local or remote event logs.',
  },
  {
    id: 'Get-HotFix',
    name: 'Get-HotFix',
    category: 'System Management',
    parameters: parseSpecificParams('Id, Description, ComputerName, Credential'),
    description: 'Gets the hotfixes that have been applied to the local and remote computers.',
  },
  {
    id: 'Get-Process',
    name: 'Get-Process',
    category: 'System Management',
    parameters: parseSpecificParams('Name, Id, InputObject, IncludeUserName, ComputerName, Module, FileVersionInfo'),
    description: 'Gets the processes that are running on the local computer or a remote computer.',
  },
  {
    id: 'Get-Service',
    name: 'Get-Service',
    category: 'System Management',
    parameters: parseSpecificParams('Name, ComputerName, DependentServices, RequiredServices, DisplayName, Include, Exclude, InputObject'),
    description: 'Gets the services on a local or remote computer.',
  },
  {
    id: 'Restart-Computer',
    name: 'Restart-Computer',
    category: 'System Management',
    parameters: parseSpecificParams('AsJob, DcomAuthentication, Impersonation, WsmanAuthentication, Protocol, ComputerName, Credential, Force, ThrottleLimit, Wait, Timeout, For, Delay'),
    description: 'Restarts the operating system on local and remote computers.',
  },
  {
    id: 'Restart-Service',
    name: 'Restart-Service',
    category: 'System Management',
    parameters: parseSpecificParams('Force, Name, InputObject, PassThru, DisplayName, Include, Exclude'),
    description: 'Stops and then starts one or more services.',
  },
  {
    id: 'Start-Process',
    name: 'Start-Process',
    category: 'System Management',
    parameters: parseSpecificParams('FilePath, ArgumentList, Credential, WorkingDirectory, LoadUserProfile, NoNewWindow, PassThru, RedirectStandardError, RedirectStandardInput, RedirectStandardOutput, Verb, WindowStyle, Wait, UseNewEnvironment'),
    description: 'Starts one or more processes on the local computer.',
  },
  {
    id: 'Start-Service',
    name: 'Start-Service',
    category: 'System Management',
    parameters: parseSpecificParams('Name, InputObject, PassThru, DisplayName, Include, Exclude'),
    description: 'Starts one or more stopped services.',
  },
  {
    id: 'Stop-Computer',
    name: 'Stop-Computer',
    category: 'System Management',
    parameters: parseSpecificParams('AsJob, DcomAuthentication, WsmanAuthentication, Protocol, ComputerName, Credential, Impersonation, ThrottleLimit, Force'),
    description: 'Shuts down local and remote computers.',
  },
  {
    id: 'Stop-Process',
    name: 'Stop-Process',
    category: 'System Management',
    parameters: parseSpecificParams('Name, Id, InputObject, PassThru, Force'),
    description: 'Stops one or more running processes.',
  },
  {
    id: 'Stop-Service',
    name: 'Stop-Service',
    category: 'System Management',
    parameters: parseSpecificParams('Force, NoWait, Name, InputObject, PassThru, DisplayName, Include, Exclude'),
    description: 'Stops one or more running services.',
  },
  {
    id: 'Disable-ComputerRestore',
    name: 'Disable-ComputerRestore',
    category: 'System Management',
    parameters: parseSpecificParams('Drive'),
    description: 'Disables the System Restore feature on the specified file system drive.'
  },
  {
    id: 'Enable-ComputerRestore',
    name: 'Enable-ComputerRestore',
    category: 'System Management',
    parameters: parseSpecificParams('Drive'),
    description: 'Enables the System Restore feature on the specified file system drive.'
  },
  {
    id: 'Get-ComputerRestorePoint',
    name: 'Get-ComputerRestorePoint',
    category: 'System Management',
    parameters: parseSpecificParams('RestorePoint, LastStatus'),
    description: 'Gets the restore points on the local computer.'
  },
  {
    id: 'Restore-Computer',
    name: 'Restore-Computer',
    category: 'System Management',
    parameters: parseSpecificParams('RestorePoint'),
    description: 'Starts a system restore on the local computer.'
  },
  {
    id: 'Limit-EventLog',
    name: 'Limit-EventLog',
    category: 'System Management',
    parameters: parseSpecificParams('LogName,ComputerName,RetentionDays,OverflowAction,MaximumSize'),
    description: 'Sets the maximum size of a classic event log, how long each event must be retained, and what happens when the log reaches its maximum size.'
  },
  {
    id: 'Remove-Computer',
    name: 'Remove-Computer',
    category: 'System Management',
    parameters: parseSpecificParams('UnjoinDomainCredential,LocalCredential,Restart,ComputerName,Force,PassThru,WorkgroupName'),
    description: 'Removes the local computer or remote computers from a domain.'
  },
  {
    id: 'Remove-EventLog',
    name: 'Remove-EventLog',
    category: 'System Management',
    parameters: parseSpecificParams('ComputerName,LogName,Source'),
    description: 'Deletes an event log or unregisters a source for an event log.'
  },
  {
    id: 'Rename-Computer',
    name: 'Rename-Computer',
    category: 'System Management',
    parameters: parseSpecificParams('ComputerName,PassThru,DomainCredential,LocalCredential,NewName,Force,Restart,WsmanAuthentication,Protocol'),
    description: 'Renames a computer or a domain.'
  },
  {
    id: 'Reset-ComputerMachinePassword',
    name: 'Reset-ComputerMachinePassword',
    category: 'System Management',
    parameters: parseSpecificParams('Server,Credential'),
    description: 'Resets the machine account password for the computer.'
  },
  {
    id: 'Resume-Service',
    name: 'Resume-Service',
    category: 'System Management',
    parameters: parseSpecificParams('Name,InputObject,PassThru,DisplayName,Include,Exclude'),
    description: 'Resumes one or more suspended (paused) services.'
  },
  {
    id: 'Set-Service',
    name: 'Set-Service',
    category: 'System Management',
    parameters: parseSpecificParams('ComputerName,Name,DisplayName,Description,StartupType,Status,InputObject,PassThru'),
    description: 'Starts, stops, and suspends a service, and changes its properties.'
  },
  {
    id: 'Show-EventLog',
    name: 'Show-EventLog',
    category: 'System Management',
    parameters: parseSpecificParams('ComputerName'),
    description: 'Displays the event logs of the local or a remote computer in Event Viewer.'
  },
  {
    id: 'Suspend-Service',
    name: 'Suspend-Service',
    category: 'System Management',
    parameters: parseSpecificParams('Name,InputObject,PassThru,DisplayName,Include,Exclude'),
    description: 'Suspends (pauses) one or more running services.'
  },
  {
    id: 'Test-ComputerSecureChannel',
    name: 'Test-ComputerSecureChannel',
    category: 'System Management',
    parameters: parseSpecificParams('Repair,Server,Credential'),
    description: 'Tests and repairs the secure channel between the local computer and its domain.'
  },
  {
    id: 'Write-EventLog',
    name: 'Write-EventLog',
    category: 'System Management',
    parameters: parseSpecificParams('LogName,Source,EntryType,Category,EventId,Message,RawData,ComputerName'),
    description: 'Writes an event to an event log.'
  },


  // File & Item Management
  {
    id: 'Add-Content',
    name: 'Add-Content',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Value, PassThru, Path, LiteralPath, Filter, Include, Exclude, Force, Credential, NoNewline, Encoding, Stream'),
    description: 'Adds content to the specified items, such as adding words to a file.',
  },
  {
    id: 'Clear-Content',
    name: 'Clear-Content',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path, LiteralPath, Filter, Include, Exclude, Force, Credential, Stream'),
    description: 'Deletes the content of an item, such as the text in a file, but does not delete the item.',
  },
  {
    id: 'Clear-Item',
    name: 'Clear-Item',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path, LiteralPath, Force, Filter, Include, Exclude, Credential'),
    description: 'Removes the content from an item, but does not delete the item.',
  },
  {
    id: 'Copy-Item',
    name: 'Copy-Item',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path, LiteralPath, Destination, Container, Force, Filter, Include, Exclude, Recurse, PassThru, Credential, FromSession, ToSession'),
    description: 'Copies an item from one location to another.',
  },
  {
    id: 'Get-ChildItem',
    name: 'Get-ChildItem',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path, LiteralPath, Filter, Include, Exclude, Recurse, Depth, Force, Name, Attributes, FollowSymlink, Directory, File, Hidden, ReadOnly, System'),
    description: 'Gets the items and child items in one or more specified locations.',
  },
  {
    id: 'Get-Content',
    name: 'Get-Content',
    category: 'File & Item Management',
    parameters: parseSpecificParams('ReadCount, TotalCount, Tail, Path, LiteralPath, Filter, Include, Exclude, Force, Credential, Delimiter, Wait, Raw, Encoding, Stream'),
    description: 'Gets the content of the item at the specified location.',
  },
  {
    id: 'Get-Item',
    name: 'Get-Item',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path, LiteralPath, Filter, Include, Exclude, Force, Credential, Stream'),
    description: 'Gets the item at the specified location.',
  },
  {
    id: 'Get-ItemProperty',
    name: 'Get-ItemProperty',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path, LiteralPath, Name, Filter, Include, Exclude, Credential'),
    description: 'Gets the properties of a specified item.',
  },
  {
    id: 'Get-ItemPropertyValue',
    name: 'Get-ItemPropertyValue',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path, LiteralPath, Name, Filter, Include, Exclude, Credential'),
    description: 'Gets the value for one or more properties of a specified item.',
  },
  {
    id: 'Get-Location',
    name: 'Get-Location',
    category: 'File & Item Management',
    parameters: parseSpecificParams('PSProvider, PSDrive, Stack, StackName'),
    description: 'Gets information about the current working location or a location stack.'
  },
  {
    id: 'Join-Path',
    name: 'Join-Path',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path, ChildPath, Resolve, Credential'),
    description: 'Combines a path and a child path into a single path.'
  },
  {
    id: 'Move-Item',
    name: 'Move-Item',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path, LiteralPath, Destination, Force, Filter, Include, Exclude, PassThru, Credential'),
    description: 'Moves an item from one location to another.',
  },
  {
    id: 'New-Item',
    name: 'New-Item',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path, Name, ItemType, Value, Force, Credential'),
    description: 'Creates a new item.',
  },
  {
    id: 'Pop-Location',
    name: 'Pop-Location',
    category: 'File & Item Management',
    parameters: parseSpecificParams('PassThru, StackName'),
    description: 'Changes the current location to the location most recently pushed onto the stack.'
  },
  {
    id: 'Push-Location',
    name: 'Push-Location',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path, LiteralPath, PassThru, StackName'),
    description: 'Adds the current location to the top of a location stack.'
  },
  {
    id: 'Remove-Item',
    name: 'Remove-Item',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path, LiteralPath, Filter, Include, Exclude, Recurse, Force, Credential, Stream'),
    description: 'Deletes items.',
  },
  {
    id: 'Rename-Item',
    name: 'Rename-Item',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path, LiteralPath, NewName, Force, PassThru, Credential'),
    description: 'Renames an item in a PowerShell provider namespace.',
  },
  {
    id: 'Set-Content',
    name: 'Set-Content',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Value, PassThru, Path, LiteralPath, Filter, Include, Exclude, Force, Credential, NoNewline, Encoding, Stream'),
    description: 'Writes new content or replaces the content in a file.',
  },
  {
    id: 'Set-ItemProperty',
    name: 'Set-ItemProperty',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path, LiteralPath, Name, Value, InputObject, PassThru, Force, Filter, Include, Exclude, Credential'),
    description: 'Creates or changes the value of a property of an item.',
  },
  {
    id: 'Set-Location',
    name: 'Set-Location',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path, LiteralPath, PassThru, StackName'),
    description: 'Sets the current working location to a specified location.'
  },
  {
    id: 'Split-Path',
    name: 'Split-Path',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path, LiteralPath, Qualifier, NoQualifier, Parent, Leaf, Resolve, IsAbsolute, Credential'),
    description: 'Returns the specified part of a path.',
  },
  {
    id: 'Test-Path',
    name: 'Test-Path',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path, LiteralPath, Filter, Include, Exclude, PathType, IsValid, Credential, OlderThan, NewerThan'),
    description: 'Determines whether all elements of a path exist.',
  },
  {
    id: 'Clear-ItemProperty',
    name: 'Clear-ItemProperty',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path,LiteralPath,Name,PassThru,Force,Filter,Include,Exclude,Credential'),
    description: 'Deletes the value of a property but does not delete the property.'
  },
  {
    id: 'Convert-Path',
    name: 'Convert-Path',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path,LiteralPath'),
    description: 'Converts a path from a PowerShell path to a PowerShell provider path.'
  },
  {
    id: 'Copy-ItemProperty',
    name: 'Copy-ItemProperty',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path,LiteralPath,Name,Destination,PassThru,Force,Filter,Include,Exclude,Credential'),
    description: 'Copies a property and its value from a specified location to another location.'
  },
  {
    id: 'Invoke-Item',
    name: 'Invoke-Item',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path,LiteralPath,Filter,Include,Exclude,Credential'),
    description: 'Performs the default action on the specified item.'
  },
  {
    id: 'Move-ItemProperty',
    name: 'Move-ItemProperty',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path,LiteralPath,Name,Destination,PassThru,Force,Filter,Include,Exclude,Credential'),
    description: 'Moves a property from one location to another.'
  },
  {
    id: 'New-ItemProperty',
    name: 'New-ItemProperty',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path,LiteralPath,Name,PropertyType,Value,Force,Filter,Include,Exclude,Credential'),
    description: 'Creates a new property for an item and sets its value.'
  },
  {
    id: 'Out-File',
    name: 'Out-File',
    category: 'File & Item Management',
    parameters: parseSpecificParams('FilePath,LiteralPath,Encoding,Append,Force,NoClobber,Width,NoNewline,InputObject'),
    description: 'Sends output to a file.'
  },
  {
    id: 'Resolve-Path',
    name: 'Resolve-Path',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path,LiteralPath,Relative,Credential'),
    description: 'Resolves the wildcard characters in a path, and displays the path contents.'
  },
  {
    id: 'Set-Item',
    name: 'Set-Item',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path,LiteralPath,Value,Force,PassThru,Filter,Include,Exclude,Credential'),
    description: 'Changes the value of an item to the value specified in the command.'
  },
  {
    id: 'Unblock-File',
    name: 'Unblock-File',
    category: 'File & Item Management',
    parameters: parseSpecificParams('Path,LiteralPath'),
    description: 'Unblocks files that were downloaded from the Internet.'
  },

  // PowerShell Core & Scripting
  {
    id: 'Add-History',
    name: 'Add-History',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('InputObject, Passthru'),
    description: 'Adds entries to the session history.'
  },
  {
    id: 'Add-Member',
    name: 'Add-Member',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('InputObject, MemberType, Name, Value, SecondValue, TypeName, Force, PassThru, NotePropertyName, NotePropertyValue, NotePropertyMembers'),
    description: 'Adds custom properties and methods to an instance of a PowerShell object.'
  },
  {
    id: 'Add-Type',
    name: 'Add-Type',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('CodeDomProvider, CompilerParameters, TypeDefinition, Name, MemberDefinition, Namespace, UsingNamespace, Path, LiteralPath, AssemblyName, Language, ReferencedAssemblies, OutputAssembly, OutputType, PassThru, IgnoreWarnings'),
    description: 'Adds a Microsoft .NET Framework type (a class or enumeration) to a PowerShell session.'
  },
  {
    id: 'Clear-History',
    name: 'Clear-History',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Id, CommandLine, Count, Newest'),
    description: 'Deletes entries from the command history.'
  },
  {
    id: 'Clear-Variable',
    name: 'Clear-Variable',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name, Include, Exclude, Force, PassThru, Scope'),
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
    parameters: parseSpecificParams('Path,LiteralPath,Name,PassThru,As,Append,Force,NoClobber,Description,Scope'),
    description: 'Exports information about currently defined aliases to a file.'
  },
  {
    id: 'Export-Clixml',
    name: 'Export-Clixml',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Depth,Path,LiteralPath,InputObject,Force,NoClobber,Encoding'),
    description: 'Creates an XML-based representation of an object or objects and stores it in a file.'
  },
  {
    id: 'Export-Console',
    name: 'Export-Console',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Path,Force,NoClobber'),
    description: 'Exports the names of snap-ins in the current session to a console file.'
  },
  {
    id: 'Export-FormatData',
    name: 'Export-FormatData',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('InputObject,Path,LiteralPath,Force,NoClobber,IncludeScriptBlock'),
    description: 'Saves formatting data from the current session in a formatting file.'
  },
  {
    id: 'Export-ModuleMember',
    name: 'Export-ModuleMember',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Function,Cmdlet,Variable,Alias'),
    description: 'Specifies the module members that are exported.'
  },
  {
    id: 'ForEach-Object',
    name: 'ForEach-Object',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('InputObject,Begin,Process,End,RemainingScripts,MemberName,ArgumentList'),
    description: 'Performs an operation against each item in a collection of input objects.'
  },
  {
    id: 'Get-Alias',
    name: 'Get-Alias',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name, Exclude, Scope, Definition'),
    description: 'Gets the aliases for the current session.'
  },
  {
    id: 'Get-Command',
    name: 'Get-Command',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name, Verb, Noun, Module, FullyQualifiedModule, CommandType, TotalCount, Syntax, ShowCommandInfo, ArgumentList, All, ListImported, ParameterName, ParameterType'),
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
    parameters: parseSpecificParams('Date, Year, Month, Day, Hour, Minute, Second, Millisecond, DisplayHint, UFormat, Format'),
    description: 'Gets the current date and time.'
  },
  {
    id: 'Get-Event',
    name: 'Get-Event',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('SourceIdentifier,EventIdentifier'),
    description: 'Gets the events in the PowerShell event queue.'
  },
  {
    id: 'Get-EventSubscriber',
    name: 'Get-EventSubscriber',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('SourceIdentifier,SubscriptionId,Force'),
    description: 'Gets the event subscribers in the current session.'
  },
  {
    id: 'Get-FormatData',
    name: 'Get-FormatData',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('TypeName,PowerShellVersion'),
    description: 'Gets the formatting data in the current session.'
  },
  {
    id: 'Get-Help',
    name: 'Get-Help',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name, Path, Category, Component, Functionality, Role, Detailed, Full, Examples, Parameter, Online, ShowWindow'),
    description: 'Displays information about PowerShell commands and concepts.',
  },
  {
    id: 'Get-History',
    name: 'Get-History',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Id, Count'),
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
    parameters: parseSpecificParams('InputObject, Name, MemberType, View, Static, Force'),
    description: 'Gets the properties and methods of objects.'
  },
  {
    id: 'Get-Module',
    name: 'Get-Module',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name,FullyQualifiedName,All,ListAvailable,PSEdition,Refresh,PSSession,CimSession,CimResourceUri,CimNamespace'),
    description: 'Gets the modules that have been imported or that can be imported into the current session.'
  },
  {
    id: 'Get-PSBreakpoint',
    name: 'Get-PSBreakpoint',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Script,Id,Variable,Command,Type'),
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
    parameters: parseSpecificParams('Name,LiteralName,Scope,PSProvider'),
    description: 'Gets the PowerShell drives in the current session.'
  },
  {
    id: 'Get-PSProvider',
    name: 'Get-PSProvider',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('PSProvider'),
    description: 'Gets information about the PowerShell providers in the current session.'
  },
  {
    id: 'Get-Random',
    name: 'Get-Random',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('SetSeed, Maximum, Minimum, InputObject, Count'),
    description: 'Gets a random number, or selects objects randomly from a collection.'
  },
  {
    id: 'Get-Runspace',
    name: 'Get-Runspace',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name,Id,InstanceId'),
    description: 'Gets information about the runspaces in the current session.'
  },
  {
    id: 'Get-TimeZone',
    name: 'Get-TimeZone',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Id,ListAvailable,Name'),
    description: 'Gets the current time zone or a list of available time zones.'
  },
  {
    id: 'Get-TraceSource',
    name: 'Get-TraceSource',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name'),
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
    parameters: parseSpecificParams('TypeName'),
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
    parameters: parseSpecificParams('InputObject,AsString,OnType'),
    description: 'Returns the unique items from a sorted list.'
  },
  {
    id: 'Get-Variable',
    name: 'Get-Variable',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name, ValueOnly, Include, Exclude, Scope'),
    description: 'Gets the variables in the current console.'
  },
  {
    id: 'Import-Alias',
    name: 'Import-Alias',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Path,LiteralPath,Scope,PassThru,Force'),
    description: 'Imports an alias list from a file.'
  },
  {
    id: 'Import-Clixml',
    name: 'Import-Clixml',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Path,LiteralPath,IncludeTotalCount,Skip,First'),
    description: 'Imports a CLIXML file and creates corresponding objects in PowerShell.'
  },
  {
    id: 'Import-LocalizedData',
    name: 'Import-LocalizedData',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('BindingVariable,UICulture,BaseDirectory,FileName,SupportedCommand'),
    description: 'Imports language-specific data into scripts and functions based on the UI culture that is selected for the operating system.'
  },
  {
    id: 'Import-Module',
    name: 'Import-Module',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Global,Prefix,Name,FullyQualifiedName,Assembly,Function,Cmdlet,Variable,Alias,Force,PassThru,AsCustomObject,MinimumVersion,MaximumVersion,RequiredVersion,ModuleInfo,ArgumentList,DisableNameChecking,NoClobber,Scope,PSSession,CimSession,CimResourceUri,CimNamespace'),
    description: 'Adds modules to the current session.'
  },
  {
    id: 'Invoke-Expression',
    name: 'Invoke-Expression',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Command'),
    description: 'Runs commands or expressions on the local computer.',
  },
  {
    id: 'Invoke-History',
    name: 'Invoke-History',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Id'),
    description: 'Runs commands from the session history.'
  },
  {
    id: 'Measure-Command',
    name: 'Measure-Command',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('InputObject,Expression'),
    description: 'Measures the time it takes to run script blocks and cmdlets.'
  },
  {
    id: 'New-Alias',
    name: 'New-Alias',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name, Value, Description, Option, PassThru, Scope, Force'),
    description: 'Creates a new alias.'
  },
  {
    id: 'New-Event',
    name: 'New-Event',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('SourceIdentifier,Sender,EventArguments,MessageData'),
    description: 'Creates a new event.'
  },
  {
    id: 'New-EventLog',
    name: 'New-EventLog',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('CategoryResourceFile,ComputerName,LogName,MessageResourceFile,ParameterResourceFile,Source'),
    description: 'Creates a new event log and a new event source on a local or remote computer.'
  },
  {
    id: 'New-Module',
    name: 'New-Module',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name,ScriptBlock,Function,Cmdlet,ReturnResult,AsCustomObject,ArgumentList'),
    description: 'Creates a new dynamic module that exists only in memory.'
  },
  {
    id: 'New-ModuleManifest',
    name: 'New-ModuleManifest',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Path,NestedModules,Guid,Author,CompanyName,Copyright,RootModule,ModuleVersion,Description,ProcessorArchitecture,PowerShellVersion,ClrVersion,DotNetFrameworkVersion,PowerShellHostName,PowerShellHostVersion,RequiredModules,TypesToProcess,FormatsToProcess,ScriptsToProcess,RequiredAssemblies,FileList,ModuleList,FunctionsToExport,AliasesToExport,VariablesToExport,CmdletsToExport,DscResourcesToExport,CompatiblePSEditions,PrivateData,Tags,ProjectUri,LicenseUri,IconUri,ReleaseNotes,HelpInfoUri,PassThru,DefaultCommandPrefix'),
    description: 'Creates a new module manifest.'
  },
  {
    id: 'New-Object',
    name: 'New-Object',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('TypeName, ComObject, ArgumentList, Strict, Property'),
    description: 'Creates an instance of a Microsoft .NET Framework or COM object.'
  },
  {
    id: 'New-PSDrive',
    name: 'New-PSDrive',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name,PSProvider,Root,Description,Scope,Persist,Credential'),
    description: 'Creates a PowerShell drive.'
  },
  {
    id: 'New-Service',
    name: 'New-Service',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name,BinaryPathName,DisplayName,Description,StartupType,Credential,DependsOn'),
    description: 'Creates a new Windows service.'
  },
  {
    id: 'New-TimeSpan',
    name: 'New-TimeSpan',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Start, End, Days, Hours, Minutes, Seconds'),
    description: 'Creates a TimeSpan object.'
  },
  {
    id: 'New-Variable',
    name: 'New-Variable',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name, Value, Description, Option, Visibility, Force, PassThru, Scope'),
    description: 'Creates a new variable.'
  },
  {
    id: 'Out-Default',
    name: 'Out-Default',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Transcript,InputObject'),
    description: 'Sends the output to the default formatter and to the host console.'
  },
  {
    id: 'Out-GridView',
    name: 'Out-GridView',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('InputObject,Title,Wait,OutputMode,PassThru'),
    description: 'Sends output to an interactive table in a separate window.'
  },
  {
    id: 'Out-Host',
    name: 'Out-Host',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Paging,InputObject'),
    description: 'Sends output to the command line.'
  },
  {
    id: 'Out-Null',
    name: 'Out-Null',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('InputObject'),
    description: 'Deletes output instead of sending it to the console.'
  },
  {
    id: 'Out-Printer',
    name: 'Out-Printer',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name,InputObject'),
    description: 'Sends output to a printer.'
  },
  {
    id: 'Out-String',
    name: 'Out-String',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Stream,Width,InputObject'),
    description: 'Sends objects to the host as a series of strings.'
  },
  {
    id: 'Read-Host',
    name: 'Read-Host',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Prompt,AsSecureString'),
    description: 'Reads a line of input from the console.'
  },
  {
    id: 'Register-EngineEvent',
    name: 'Register-EngineEvent',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('SourceIdentifier,Action,MessageData,SupportEvent,Forward,MaxTriggerCount'),
    description: 'Subscribes to events that are generated by the PowerShell engine and by the New-Event cmdlet.'
  },
  {
    id: 'Register-ObjectEvent',
    name: 'Register-ObjectEvent',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('InputObject,EventName,SourceIdentifier,Action,MessageData,SupportEvent,Forward,MaxTriggerCount'),
    description: 'Subscribes to the events that are generated by Microsoft .NET Framework objects.'
  },
  {
    id: 'Remove-Event',
    name: 'Remove-Event',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('SourceIdentifier,EventIdentifier'),
    description: 'Deletes events from the PowerShell event queue.'
  },
  {
    id: 'Remove-Module',
    name: 'Remove-Module',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name,FullyQualifiedName,ModuleInfo,Force'),
    description: 'Removes modules from the current session.'
  },
  {
    id: 'Remove-PSDrive',
    name: 'Remove-PSDrive',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name,LiteralName,PSProvider,Scope,Force'),
    description: 'Removes a PowerShell drive.'
  },
  {
    id: 'Remove-TypeData',
    name: 'Remove-TypeData',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('TypeName,Path,TypeData'),
    description: 'Deletes extended type data from the current session.'
  },
  {
    id: 'Remove-Variable',
    name: 'Remove-Variable',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name, Include, Exclude, Force, Scope'),
    description: 'Deletes a variable and its value.'
  },
  {
    id: 'Save-Help',
    name: 'Save-Help',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('DestinationPath,LiteralPath,Module,FullyQualifiedModule,UICulture,Credential,UseDefaultCredentials,Force'),
    description: 'Downloads and saves the newest help files for modules installed on your computer.'
  },
  {
    id: 'Set-Alias',
    name: 'Set-Alias',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name, Value, Description, Option, PassThru, Scope, Force'),
    description: 'Creates or changes an alias.'
  },
  {
    id: 'Set-Culture',
    name: 'Set-Culture',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('CultureInfo'),
    description: 'Sets a specific culture to be used during the current session.'
  },
  {
    id: 'Set-Date',
    name: 'Set-Date',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Date,Adjust,DisplayHint'),
    description: 'Changes the system time on the computer to a time that you specify.'
  },
  {
    id: 'Set-PSBreakpoint',
    name: 'Set-PSBreakpoint',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Action,Column,Command,Line,Script,Variable,Mode'),
    description: 'Sets a breakpoint on a line, command, or variable.'
  },
  {
    id: 'Set-PSDebug',
    name: 'Set-PSDebug',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Trace,Step,Strict,Off'),
    description: 'Turns script debugging features on and off, sets the trace level, and toggles strict mode.'
  },
  {
    id: 'Set-StrictMode',
    name: 'Set-StrictMode',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Off,Version'),
    description: 'Establishes strict mode for the current scope and for all descendent scopes.'
  },
  {
    id: 'Set-TimeZone',
    name: 'Set-TimeZone',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Id,InputObject,Name,PassThru'),
    description: 'Sets the system time zone to a specified time zone.'
  },
  {
    id: 'Set-TraceSource',
    name: 'Set-TraceSource',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name,Option,ListenerOption,FilePath,Force,Debugger,PSHost,RemoveListener,RemoveFileListener,PassThru'),
    description: 'Configures tracing for PowerShell components.'
  },
  {
    id: 'Set-Variable',
    name: 'Set-Variable',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name, Value, Include, Exclude, Description, Option, Force, Visibility, PassThru, Scope'),
    description: 'Sets the value of a variable. Creates the variable if one with the same name does not exist.'
  },
  {
    id: 'Show-Command',
    name: 'Show-Command',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name,Height,Width,NoCommonParameter,ErrorPopup,PassThru'),
    description: 'Creates PowerShell commands in a command window.'
  },
  {
    id: 'Start-Sleep',
    name: 'Start-Sleep',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Seconds, Milliseconds'),
    description: 'Suspends the activity in a script or session for the specified period of time.',
  },
  {
    id: 'Start-Transaction',
    name: 'Start-Transaction',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Timeout,Independent,RollbackPreference'),
    description: 'Starts a transaction.'
  },
  {
    id: 'Trace-Command',
    name: 'Trace-Command',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('InputObject,Name,Option,Expression,Command,ArgumentList,ListenerOption,FilePath,Force,Debugger,PSHost'),
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
    parameters: parseSpecificParams('SourceIdentifier,SubscriptionId,Force'),
    description: 'Cancels an event subscription.'
  },
  {
    id: 'Update-FormatData',
    name: 'Update-FormatData',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('AppendPath,PrependPath'),
    description: 'Updates the formatting data in the current session.'
  },
  {
    id: 'Update-Help',
    name: 'Update-Help',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Module,FullyQualifiedModule,SourcePath,LiteralPath,Recurse,UICulture,Credential,UseDefaultCredentials,Force'),
    description: 'Downloads and installs the newest help files for modules installed on your computer.'
  },
  {
    id: 'Update-List',
    name: 'Update-List',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Add,Remove,Replace,InputObject,Property'),
    description: 'Adds items to or removes items from a collection.'
  },
  {
    id: 'Update-TypeData',
    name: 'Update-TypeData',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('MemberType,MemberName,Value,SecondValue,TypeConverter,TypeAdapter,SerializationMethod,TargetTypeForDeserialization,SerializationDepth,DefaultDisplayProperty,InheritPropertySerializationSet,StringSerializationSource,DefaultDisplayPropertySet,DefaultKeyPropertySet,PropertySerializationSet,TypeName,Force,TypeData,AppendPath,PrependPath'),
    description: 'Updates the extended type data in the session.'
  },
  {
    id: 'Use-Transaction',
    name: 'Use-Transaction',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('TransactedScript'),
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
    parameters: parseSpecificParams('SourceIdentifier,Timeout'),
    description: 'Waits until a particular event is raised before continuing to run.'
  },
  {
    id: 'Write-Debug',
    name: 'Write-Debug',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Message'),
    description: 'Writes a debug message to the console.'
  },
  {
    id: 'Write-Error',
    name: 'Write-Error',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Exception, Message, ErrorRecord, Category, ErrorId, TargetObject, RecommendedAction, CategoryActivity, CategoryReason, CategoryTargetName, CategoryTargetType'),
    description: 'Writes an object to the error stream.'
  },
  {
    id: 'Write-Host',
    name: 'Write-Host',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Object, NoNewline, Separator, ForegroundColor, BackgroundColor'),
    description: 'Writes customized output to a host.',
  },
  {
    id: 'Write-Information',
    name: 'Write-Information',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('MessageData,Tags'),
    description: 'Specifies how PowerShell handles information stream data for a command.'
  },
  {
    id: 'Write-Output',
    name: 'Write-Output',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('InputObject, NoEnumerate'),
    description: 'Sends the specified objects to the next command in the pipeline.',
  },
  {
    id: 'Write-Progress',
    name: 'Write-Progress',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Activity,Status,Id,PercentComplete,SecondsRemaining,CurrentOperation,ParentId,Completed,SourceId'),
    description: 'Displays a progress bar within a PowerShell command window.'
  },
  {
    id: 'Write-Verbose',
    name: 'Write-Verbose',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Message'),
    description: 'Writes text to the verbose message stream.'
  },
  {
    id: 'Write-Warning',
    name: 'Write-Warning',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Message'),
    description: 'Writes a warning message.'
  },


  // Data Handling & Formatting
  {
    id: 'Compare-Object',
    name: 'Compare-Object',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('ReferenceObject, DifferenceObject, SyncWindow, Property, ExcludeDifferent, IncludeEqual, PassThru, Culture, CaseSensitive'),
    description: 'Compares two sets of objects.'
  },
  {
    id: 'ConvertFrom-Csv',
    name: 'ConvertFrom-Csv',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('Delimiter, UseCulture, InputObject, Header'),
    description: 'Converts character-separated value (CSV) data into PSObject type objects.'
  },
  {
    id: 'ConvertFrom-Json',
    name: 'ConvertFrom-Json',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('InputObject'),
    description: 'Converts a JSON-formatted string to a custom object.',
  },
  {
    id: 'ConvertFrom-String',
    name: 'ConvertFrom-String',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('Delimiter,PropertyNames,TemplateFile,TemplateContent,IncludeExtent,UpdateTemplate,InputObject'),
    description: 'Formats a string by using a template.'
  },
  {
    id: 'ConvertFrom-StringData',
    name: 'ConvertFrom-StringData',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('StringData'),
    description: 'Converts a string containing one or more key/value pairs to a hash table.'
  },
  {
    id: 'Convert-String',
    name: 'Convert-String',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('Example,InputObject'),
    description: 'Formats a string.'
  },
  {
    id: 'ConvertTo-Csv',
    name: 'ConvertTo-Csv',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('InputObject, Delimiter, UseCulture, NoTypeInformation'),
    description: 'Converts .NET objects into a series of character-separated value (CSV) strings.'
  },
  {
    id: 'ConvertTo-Html',
    name: 'ConvertTo-Html',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('InputObject, Property, Body, Head, Title, As, CssUri, Fragment, PostContent, PreContent'),
    description: 'Converts Microsoft .NET Framework objects into HTML that can be displayed in a Web browser.',
  },
  {
    id: 'ConvertTo-Json',
    name: 'ConvertTo-Json',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('InputObject, Depth, Compress'),
    description: 'Converts an object to a JSON-formatted string.',
  },
  {
    id: 'ConvertTo-Xml',
    name: 'ConvertTo-Xml',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('Depth, InputObject, NoTypeInformation, As'),
    description: 'Creates an XML-based representation of an object or objects.',
  },
  {
    id: 'Export-Csv',
    name: 'Export-Csv',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('InputObject, Path, LiteralPath, Force, NoClobber, Encoding, Append, Delimiter, UseCulture, NoTypeInformation'),
    description: 'Converts objects into a series of comma-separated value (CSV) strings and saves them in a CSV file.',
  },
  {
    id: 'Format-Custom',
    name: 'Format-Custom',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('Property,Depth,GroupBy,View,ShowError,DisplayError,Force,Expand,InputObject'),
    description: 'Uses a custom view to format the output.'
  },
  {
    id: 'Format-List',
    name: 'Format-List',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('Property, GroupBy, View, ShowError, DisplayError, Force, Expand, InputObject'),
    description: 'Formats the output as a list of properties in which each property is displayed on a separate line.'
  },
  {
    id: 'Format-Table',
    name: 'Format-Table',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('AutoSize, RepeatHeader, HideTableHeaders, Wrap, Property, GroupBy, View, ShowError, DisplayError, Force, Expand, InputObject'),
    description: 'Formats the output as a table.'
  },
  {
    id: 'Format-Wide',
    name: 'Format-Wide',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('Property, AutoSize, Column, GroupBy, View, ShowError, DisplayError, Force, InputObject'),
    description: 'Formats objects as a wide table that displays only one property of each object.'
  },
  {
    id: 'Group-Object',
    name: 'Group-Object',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('NoElement, AsHashTable, AsString, InputObject, Property, Culture, CaseSensitive'),
    description: 'Groups objects that contain the same value for specified properties.'
  },
  {
    id: 'Import-Csv',
    name: 'Import-Csv',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('Delimiter, Path, LiteralPath, UseCulture, Header, Encoding'),
    description: 'Creates table-like custom objects from the items in a CSV file.',
  },
  {
    id: 'Measure-Object',
    name: 'Measure-Object',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('InputObject, Property, Sum, Average, Maximum, Minimum, Line, Word, Character, IgnoreWhiteSpace'),
    description: 'Calculates the numeric properties of objects, and the characters, words, and lines in string objects.',
  },
  {
    id: 'Select-Object',
    name: 'Select-Object',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('InputObject, Property, ExcludeProperty, ExpandProperty, Unique, Last, First, Skip, SkipLast, Wait, Index'),
    description: 'Selects objects or object properties.',
  },
  {
    id: 'Select-String',
    name: 'Select-String',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('InputObject, Pattern, Path, LiteralPath, SimpleMatch, CaseSensitive, Quiet, List, Include, Exclude, NotMatch, AllMatches, Encoding, Context'),
    description: 'Finds text in strings and files.'
  },
  {
    id: 'Select-Xml',
    name: 'Select-Xml',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('Path, LiteralPath, Xml, Content, XPath, Namespace'),
    description: 'Finds text in an XML string or document.'
  },
  {
    id: 'Sort-Object',
    name: 'Sort-Object',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('Descending, Unique, InputObject, Property, Culture, CaseSensitive'),
    description: 'Sorts objects by property values.',
  },
  {
    id: 'Tee-Object',
    name: 'Tee-Object',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('InputObject, FilePath, LiteralPath, Append, Variable'),
    description: 'Saves command output in a file or variable and also sends it down the pipeline.'
  },
  {
    id: 'Where-Object',
    name: 'Where-Object',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('InputObject, FilterScript, Property, Value, EQ, CEQ, NE, CNE, GT, CGT, LT, CLT, GE, CGE, LE, CLE, Like, CLike, NotLike, CNotLike, Match, CMatch, NotMatch, CNotMatch, Contains, CContains, NotContains, CNotContains, In, CIn, NotIn, CNotIn, Is, IsNot'),
    description: 'Selects objects from a collection based on their property values.'
  },


  // Networking
  {
    id: 'Connect-PSSession',
    name: 'Connect-PSSession',
    category: 'Networking',
    parameters: parseSpecificParams('Session,ComputerName,ApplicationName,ConfigurationName,ConnectionUri,AllowRedirection,InstanceId,Name,Credential,Authentication,CertificateThumbprint,Port,UseSSL,SessionOption,ThrottleLimit,Id'),
    description: 'Reconnects to user-managed PowerShell sessions (PSSessions) that are disconnected.'
  },
  {
    id: 'Connect-WSMan',
    name: 'Connect-WSMan',
    category: 'Networking',
    parameters: parseSpecificParams('ComputerName,ApplicationName,Authentication,Credential,Port,SessionOption,SSL,ConnectionURI,OptionSet,ExtendedConnect,Locale,UILocale,Impersonation'),
    description: 'Connects to the WinRM service on a remote computer.'
  },
  {
    id: 'Disable-PSRemoting',
    name: 'Disable-PSRemoting',
    category: 'Networking',
    parameters: parseSpecificParams('Force'),
    description: 'Disables all session configurations on the computer.'
  },
  {
    id: 'Disable-PSSessionConfiguration',
    name: 'Disable-PSSessionConfiguration',
    category: 'Networking',
    parameters: parseSpecificParams('Name,Force,NoServiceRestart'),
    description: 'Disables the session configurations on the computer.'
  },
  {
    id: 'Disable-WSManCredSSP',
    name: 'Disable-WSManCredSSP',
    category: 'Networking',
    parameters: parseSpecificParams('Role'),
    description: 'Disables Credential Security Support Provider (CredSSP) authentication on a client or server computer.'
  },
  {
    id: 'Disconnect-PSSession',
    name: 'Disconnect-PSSession',
    category: 'Networking',
    parameters: parseSpecificParams('Session,IdleTimeoutSec,OutputBufferingMode,ThrottleLimit,InstanceId,Id,Name'),
    description: 'Disconnects from a PowerShell session (PSSession).'
  },
  {
    id: 'Disconnect-WSMan',
    name: 'Disconnect-WSMan',
    category: 'Networking',
    parameters: parseSpecificParams('ComputerName'),
    description: 'Disconnects from the WinRM service on a remote computer.'
  },
  {
    id: 'Enable-PSRemoting',
    name: 'Enable-PSRemoting',
    category: 'Networking',
    parameters: parseSpecificParams('Force,SkipNetworkProfileCheck'),
    description: 'Configures the computer to receive PowerShell remote commands.'
  },
  {
    id: 'Enable-PSSessionConfiguration',
    name: 'Enable-PSSessionConfiguration',
    category: 'Networking',
    parameters: parseSpecificParams('Name,Force,SecurityDescriptorSddl,SkipNetworkProfileCheck,NoServiceRestart'),
    description: 'Enables the session configurations that have been disabled.'
  },
  {
    id: 'Enable-WSManCredSSP',
    name: 'Enable-WSManCredSSP',
    category: 'Networking',
    parameters: parseSpecificParams('Role,DelegateComputer'),
    description: 'Enables Credential Security Support Provider (CredSSP) authentication on a client or on a server computer.'
  },
  {
    id: 'Enter-PSSession',
    name: 'Enter-PSSession',
    category: 'Networking',
    parameters: parseSpecificParams('ComputerName,Session,ConnectionUri,InstanceId,Id,Name,EnableNetworkAccess,VMId,VMName,Credential,ContainerId,ConfigurationName,RunAsAdministrator,Port,UseSSL,ApplicationName,AllowRedirection,SessionOption,Authentication,CertificateThumbprint'),
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
    parameters: parseSpecificParams('OutputModule,Force,Encoding,CommandName,AllowClobber,ArgumentList,CommandType,Module,FullyQualifiedModule,FormatTypeName,Certificate,Session'),
    description: 'Imports commands from another session and saves them in a Windows PowerShell module.'
  },
  {
    id: 'Get-PSSession',
    name: 'Get-PSSession',
    category: 'Networking',
    parameters: parseSpecificParams('ComputerName,ApplicationName,ConnectionUri,ConfigurationName,AllowRedirection,Name,InstanceId,Credential,Authentication,CertificateThumbprint,Port,UseSSL,ThrottleLimit,State,SessionOption,Id,ContainerId,VMId,VMName'),
    description: 'Gets the PowerShell sessions (PSSessions) in the current session.'
  },
  {
    id: 'Get-PSSessionCapability',
    name: 'Get-PSSessionCapability',
    category: 'Networking',
    parameters: parseSpecificParams('ConfigurationName,Username,Full'),
    description: 'Gets the capabilities of a specific user on a constrained remoting endpoint.'
  },
  {
    id: 'Get-PSSessionConfiguration',
    name: 'Get-PSSessionConfiguration',
    category: 'Networking',
    parameters: parseSpecificParams('Name,Force'),
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
    parameters: parseSpecificParams('ApplicationName,ComputerName,ConnectionURI,Dialect,Enumerate,Filter,OptionSet,Port,ResourceURI,SessionOption,Shallow,IncludeClassOrigin,IncludeQualifiers,IncludeSystemProperties,Property,SelectorSet,SSL,AssociationFilter,AssociationSourceFilter,ResultClass,ExcludeProperty,Authentication,Credential,Fragment,FilePath'),
    description: 'Displays management information for a resource instance.'
  },
  {
    id: 'Import-PSSession',
    name: 'Import-PSSession',
    category: 'Networking',
    parameters: parseSpecificParams('Prefix,DisableNameChecking,CommandName,AllowClobber,ArgumentList,CommandType,Module,FullyQualifiedModule,FormatTypeName,Certificate,Session'),
    description: 'Imports commands from another session into the current session.'
  },
  {
    id: 'Invoke-Command',
    name: 'Invoke-Command',
    category: 'Networking',
    parameters: parseSpecificParams('Session,ComputerName,Credential,Port,UseSSL,ConfigurationName,ApplicationName,ThrottleLimit,ConnectionUri,AsJob,InDisconnectedSession,SessionName,HideComputerName,JobName,ScriptBlock,NoNewScope,FilePath,AllowRedirection,SessionOption,Authentication,EnableNetworkAccess,RunAsAdministrator,InputObject,ArgumentList,VMId,VMName,ContainerId,CertificateThumbprint'),
    description: 'Runs commands on local and remote computers.'
  },
  {
    id: 'Invoke-RestMethod',
    name: 'Invoke-RestMethod',
    category: 'Networking',
    parameters: parseSpecificParams('Method, UseBasicParsing, Uri, WebSession, SessionVariable, Credential, UseDefaultCredentials, CertificateThumbprint, Certificate, UserAgent, DisableKeepAlive, TimeoutSec, Headers, MaximumRedirection, Proxy, ProxyCredential, ProxyUseDefaultCredentials, Body, ContentType, TransferEncoding, InFile, OutFile, PassThru'),
    description: 'Sends an HTTP or HTTPS request to a RESTful web service.',
  },
  {
    id: 'Invoke-WebRequest',
    name: 'Invoke-WebRequest',
    category: 'Networking',
    parameters: parseSpecificParams('UseBasicParsing, Uri, WebSession, SessionVariable, Credential, UseDefaultCredentials, CertificateThumbprint, Certificate, UserAgent, DisableKeepAlive, TimeoutSec, Headers, MaximumRedirection, Method, Proxy, ProxyCredential, ProxyUseDefaultCredentials, Body, ContentType, TransferEncoding, InFile, OutFile, PassThru'),
    description: 'Gets content from a web page on the Internet.',
  },
  {
    id: 'Invoke-WSManAction',
    name: 'Invoke-WSManAction',
    category: 'Networking',
    parameters: parseSpecificParams('Action,ApplicationName,ComputerName,ConnectionURI,FilePath,OptionSet,Port,ResourceURI,SelectorSet,SessionOption,SSL,ValueSet,Authentication,Credential,Locale,UILocale,Impersonation,Fragment'),
    description: 'Invokes an action on the object that is specified by the Resource URI and by the selectors.'
  },
  {
    id: 'New-PSSession',
    name: 'New-PSSession',
    category: 'Networking',
    parameters: parseSpecificParams('ComputerName,Credential,Session,Name,EnableNetworkAccess,ConfigurationName,VMId,VMName,ContainerId,RunAsAdministrator,Port,UseSSL,ApplicationName,ThrottleLimit,ConnectionUri,AllowRedirection,SessionOption,Authentication,CertificateThumbprint'),
    description: 'Creates a persistent connection to a local or remote computer.'
  },
  {
    id: 'New-PSSessionConfigurationFile',
    name: 'New-PSSessionConfigurationFile',
    category: 'Networking',
    parameters: parseSpecificParams('Path,SchemaVersion,Guid,Author,Description,CompanyName,Copyright,SessionType,TranscriptDirectory,RunAsVirtualAccount,RunAsVirtualAccountGroups,MountUserDrive,UserDriveMaximumSize,GroupManagedServiceAccount,ScriptsToProcess,RoleDefinitions,RequiredGroups,LanguageMode,ExecutionPolicy,PowerShellVersion,ModulesToImport,VisibleAliases,VisibleCmdlets,VisibleFunctions,VisibleExternalCommands,VisibleProviders,AliasDefinitions,FunctionDefinitions,VariableDefinitions,EnvironmentVariables,TypesToProcess,FormatsToProcess,AssembliesToLoad,Full'),
    description: 'Creates a file that defines a session configuration.'
  },
  {
    id: 'New-PSSessionOption',
    name: 'New-PSSessionOption',
    category: 'Networking',
    parameters: parseSpecificParams('MaximumRedirection,NoCompression,NoMachineProfile,Culture,UICulture,MaximumReceivedDataSizePerCommand,MaximumReceivedObjectSize,OutputBufferingMode,MaxConnectionRetryCount,ApplicationArguments,OpenTimeout,CancelTimeout,IdleTimeout,ProxyAccessType,ProxyAuthentication,ProxyCredential,SkipCACheck,SkipCNCheck,SkipRevocationCheck,OperationTimeout,NoEncryption,UseUTF16,IncludePortInSPN'),
    description: 'Creates an object that contains advanced options for a PSSession.'
  },
  {
    id: 'New-PSTransportOption',
    name: 'New-PSTransportOption',
    category: 'Networking',
    parameters: parseSpecificParams('MaxIdleTimeoutSec,ProcessIdleTimeoutSec,MaxSessions,MaxConcurrentCommandsPerSession,MaxSessionsPerUser,MaxMemoryPerSessionMB,MaxProcessesPerSession,MaxConcurrentUsers,IdleTimeoutSec,OutputBufferingMode'),
    description: 'Creates an object that contains transport options for a session configuration.'
  },
  {
    id: 'New-WebServiceProxy',
    name: 'New-WebServiceProxy',
    category: 'Networking',
    parameters: parseSpecificParams('Uri, Class, Namespace, Credential, UseDefaultCredential'),
    description: 'Creates a Web service proxy object that lets you use and manage the Web service in PowerShell.'
  },
  {
    id: 'New-WSManInstance',
    name: 'New-WSManInstance',
    category: 'Networking',
    parameters: parseSpecificParams('ApplicationName,ComputerName,ConnectionURI,Dialect,FilePath,OptionSet,Port,ResourceURI,SelectorSet,SessionOption,SSL,ValueSet,Authentication,Credential,Fragment'),
    description: 'Creates a new instance of a management resource.'
  },
  {
    id: 'New-WSManSessionOption',
    name: 'New-WSManSessionOption',
    category: 'Networking',
    parameters: parseSpecificParams('NoEncryption,NoMachineProfile,ProxyAccessType,ProxyAuthentication,ProxyCredential,SkipCACheck,SkipCNCheck,SkipRevocationCheck,SPNPort,OperationTimeout,UseUTF16'),
    description: 'Creates a hash table of session options that can be used with the New-PSSession, Invoke-Command, or Enter-PSSession cmdlets.'
  },
  {
    id: 'Receive-PSSession',
    name: 'Receive-PSSession',
    category: 'Networking',
    parameters: parseSpecificParams('Session,Id,ComputerName,ApplicationName,ConfigurationName,ConnectionUri,AllowRedirection,InstanceId,Name,OutTarget,JobName,Credential,Authentication,CertificateThumbprint,Port,UseSSL,SessionOption'),
    description: 'Gets the results of commands that are running in a disconnected session.'
  },
  {
    id: 'Register-PSSessionConfiguration',
    name: 'Register-PSSessionConfiguration',
    category: 'Networking',
    parameters: parseSpecificParams('ProcessorArchitecture,SessionType,Name,AssemblyName,ApplicationBase,ConfigurationTypeName,RunAsCredential,ThreadApartmentState,ThreadOptions,AccessMode,UseSharedProcess,StartupScript,MaximumReceivedDataSizePerCommandMB,MaximumReceivedObjectSizeMB,SecurityDescriptorSddl,ShowSecurityDescriptorUI,Force,NoServiceRestart,PSVersion,SessionTypeOption,TransportOption,ModulesToImport,Path'),
    description: 'Creates and registers a new session configuration.'
  },
  {
    id: 'Remove-PSSession',
    name: 'Remove-PSSession',
    category: 'Networking',
    parameters: parseSpecificParams('Session,ContainerId,VMId,VMName,InstanceId,Id,Name,ComputerName'),
    description: 'Closes one or more PowerShell sessions (PSSessions).'
  },
  {
    id: 'Remove-WSManInstance',
    name: 'Remove-WSManInstance',
    category: 'Networking',
    parameters: parseSpecificParams('ApplicationName,ComputerName,ConnectionURI,Dialect,FilePath,OptionSet,Port,ResourceURI,SelectorSet,SessionOption,SSL,Authentication,Credential,Fragment'),
    description: 'Deletes a management resource instance.'
  },
  {
    id: 'Resolve-DnsName',
    name: 'Resolve-DnsName',
    category: 'Networking',
    parameters: parseSpecificParams('Name, Type, Server, DnsOnly, CacheOnly, NoHostsFile'),
    description: 'Performs a DNS query for the specified name.',
  },
  {
    id: 'Send-MailMessage',
    name: 'Send-MailMessage',
    category: 'Networking',
    parameters: parseSpecificParams('Attachments, Bcc, Body, BodyAsHtml, Encoding, Cc, DeliveryNotificationOption, From, SmtpServer, Priority, Subject, To, Credential, UseSsl, Port'),
    description: 'Sends an e-mail message.',
  },
  {
    id: 'Set-PSSessionConfiguration',
    name: 'Set-PSSessionConfiguration',
    category: 'Networking',
    parameters: parseSpecificParams('Name,AssemblyName,ApplicationBase,ConfigurationTypeName,RunAsCredential,ThreadApartmentState,ThreadOptions,AccessMode,UseSharedProcess,StartupScript,MaximumReceivedDataSizePerCommandMB,MaximumReceivedObjectSizeMB,SecurityDescriptorSddl,ShowSecurityDescriptorUI,Force,NoServiceRestart,PSVersion,SessionTypeOption,TransportOption,ModulesToImport,Path'),
    description: 'Changes the properties of a registered session configuration.'
  },
  {
    id: 'Set-WSManInstance',
    name: 'Set-WSManInstance',
    category: 'Networking',
    parameters: parseSpecificParams('ApplicationName,ComputerName,ConnectionURI,Dialect,FilePath,OptionSet,Port,ResourceURI,SelectorSet,SessionOption,SSL,ValueSet,Authentication,Credential,Fragment'),
    description: 'Modifies the management information that is related to a resource.'
  },
  {
    id: 'Set-WSManQuickConfig',
    name: 'Set-WSManQuickConfig',
    category: 'Networking',
    parameters: parseSpecificParams('UseSSL,Force,SkipNetworkProfileCheck'),
    description: 'Configures the local computer for remote management.'
  },
  {
    id: 'Test-Connection',
    name: 'Test-Connection',
    category: 'Networking',
    parameters: parseSpecificParams('AsJob, DcomAuthentication, WsmanAuthentication, Protocol, BufferSize, ComputerName, Count, Credential, Source, Impersonation, ThrottleLimit, TimeToLive, Delay, Quiet'),
    description: 'Sends ICMP echo request packets ("pings") to one or more remote computers.',
  },
  {
    id: 'Test-PSSessionConfigurationFile',
    name: 'Test-PSSessionConfigurationFile',
    category: 'Networking',
    parameters: parseSpecificParams('Path'),
    description: 'Verifies the keys and values in a session configuration file.'
  },
  {
    id: 'Test-WSMan',
    name: 'Test-WSMan',
    category: 'Networking',
    parameters: parseSpecificParams('ComputerName,ApplicationName,Authentication,Credential,Port,ConnectionURI'),
    description: 'Tests whether the WinRM service is running on a local or remote computer.'
  },
  {
    id: 'Unregister-PSSessionConfiguration',
    name: 'Unregister-PSSessionConfiguration',
    category: 'Networking',
    parameters: parseSpecificParams('Name,Force,NoServiceRestart'),
    description: 'Deletes registered session configurations from the computer.'
  },

  // Security
  {
    id: 'ConvertFrom-SecureString',
    name: 'ConvertFrom-SecureString',
    category: 'Security',
    parameters: parseSpecificParams('SecureString, AsPlainText, Key'),
    description: 'Converts a secure string to an encrypted standard string.'
  },
  {
    id: 'ConvertTo-SecureString',
    name: 'ConvertTo-SecureString',
    category: 'Security',
    parameters: parseSpecificParams('String, AsPlainText, Force, Key'),
    description: 'Converts encrypted standard strings to secure strings.'
  },
  {
    id: 'Get-Acl',
    name: 'Get-Acl',
    category: 'Security',
    parameters: parseSpecificParams('Path, LiteralPath, InputObject, Audit, Filter, Include, Exclude'),
    description: 'Gets the security descriptor for a resource, such as a file or registry key.',
  },
  {
    id: 'Get-AuthenticodeSignature',
    name: 'Get-AuthenticodeSignature',
    category: 'Security',
    parameters: parseSpecificParams('FilePath,LiteralPath,Content'),
    description: 'Gets information about the Authenticode signature for a file or file content.'
  },
  {
    id: 'Get-CmsMessage',
    name: 'Get-CmsMessage',
    category: 'Security',
    parameters: parseSpecificParams('Path,LiteralPath,Content'),
    description: 'Gets content that has been encrypted by using the Cryptographic Message Syntax format.'
  },
  {
    id: 'Get-Credential',
    name: 'Get-Credential',
    category: 'Security',
    parameters: parseSpecificParams('UserName, Message'),
    description: 'Gets a credential object based on a user name and password.'
  },
  {
    id: 'Get-ExecutionPolicy',
    name: 'Get-ExecutionPolicy',
    category: 'Security',
    parameters: parseSpecificParams('Scope, List'),
    description: 'Gets the execution policies for the current session.',
  },
  {
    id: 'Get-PfxData',
    name: 'Get-PfxData',
    category: 'Security',
    parameters: parseSpecificParams('Path,LiteralPath,Password,ProtectTo'),
    description: 'Extracts information from PFX certificate files.'
  },
  {
    id: 'Protect-CmsMessage',
    name: 'Protect-CmsMessage',
    category: 'Security',
    parameters: parseSpecificParams('To,Content,Path,LiteralPath,OutFile,Algorithm,SecureString'),
    description: 'Encrypts content by using the Cryptographic Message Syntax format.'
  },
  {
    id: 'Set-Acl',
    name: 'Set-Acl',
    category: 'Security',
    parameters: parseSpecificParams('Path, LiteralPath, InputObject, AclObject, ClearCentralAccessPolicy, Passthru, Filter, Include, Exclude'),
    description: 'Changes the security descriptor of a specified item, such as a file or a registry key.',
  },
  {
    id: 'Set-AuthenticodeSignature',
    name: 'Set-AuthenticodeSignature',
    category: 'Security',
    parameters: parseSpecificParams('Certificate,FilePath,LiteralPath,IncludeChain,TimestampServer,HashAlgorithm,Force,PassThru'),
    description: 'Adds an Authenticode signature to a PowerShell script or other file.'
  },
  {
    id: 'Set-ExecutionPolicy',
    name: 'Set-ExecutionPolicy',
    category: 'Security',
    parameters: parseSpecificParams('ExecutionPolicy, Scope, Force'),
    description: 'Changes the user preference for the PowerShell execution policy.',
  },
  {
    id: 'Unprotect-CmsMessage',
    name: 'Unprotect-CmsMessage',
    category: 'Security',
    parameters: parseSpecificParams('To,Path,LiteralPath,Content,OutFile,EventMessage,IncludeContext,Unprotect'),
    description: 'Decrypts content that has been encrypted using the Cryptographic Message Syntax format.'
  },

  // Application Management
  {
    id: 'Add-AppxPackage',
    name: 'Add-AppxPackage',
    category: 'Application Management',
    parameters: parseSpecificParams('Path, DependencyPath, Register, DisableDevelopmentMode, ForceApplicationShutdown, ForceTargetApplicationShutdown, ForceUpdateFromAnyVersion, InstallAllResources, PackageFamilyName, RequiredContentGroupOnly, RetainFilesOnFailure, StageInPlace, StubPackageOption, UpdateIfFound, Volume'),
    description: 'Adds a signed app package to a user account.',
  },
  {
    id: 'Get-AppxPackage',
    name: 'Get-AppxPackage',
    category: 'Application Management',
    parameters: parseSpecificParams('Name, Publisher, AllUsers, User'),
    description: 'Gets a list of the app packages that are installed in a user profile.',
  },
  {
    id: 'Remove-AppxPackage',
    name: 'Remove-AppxPackage',
    category: 'Application Management',
    parameters: parseSpecificParams('Package, AllUsers, PreserveApplicationData, User'),
    description: 'Removes an app package from a user account.',
  },

  // Hyper-V
  {
    id: 'Get-VM',
    name: 'Get-VM',
    category: 'Hyper-V',
    parameters: parseSpecificParams('Name, ComputerName, Id'),
    description: 'Gets the virtual machines from one or more Hyper-V hosts.',
  },
  {
    id: 'New-VM',
    name: 'New-VM',
    category: 'Hyper-V',
    parameters: parseSpecificParams('Name, MemoryStartupBytes, BootDevice, VHDPath, Path, SwitchName, Generation, ComputerName'),
    description: 'Creates a new virtual machine.'
  },
  {
    id: 'Remove-VM',
    name: 'Remove-VM',
    category: 'Hyper-V',
    parameters: parseSpecificParams('Name, VM, ComputerName, Force, PassThru'),
    description: 'Deletes a virtual machine.'
  },
  {
    id: 'Start-VM',
    name: 'Start-VM',
    category: 'Hyper-V',
    parameters: parseSpecificParams('Name, VM, ComputerName, PassThru'),
    description: 'Starts a virtual machine.',
  },
  {
    id: 'Stop-VM',
    name: 'Stop-VM',
    category: 'Hyper-V',
    parameters: parseSpecificParams('Name, VM, ComputerName, Force, TurnOff, Save, PassThru'),
    description: 'Shuts down, turns off, or saves a virtual machine.',
  },
  {
    id: 'Checkpoint-VM',
    name: 'Checkpoint-VM',
    category: 'Hyper-V',
    parameters: parseSpecificParams('Name, VM, SnapshotName, ComputerName, AsJob, Passthru'),
    description: 'Creates a checkpoint of a virtual machine.'
  },
  {
    id: 'Get-VMSnapshot',
    name: 'Get-VMSnapshot',
    category: 'Hyper-V',
    parameters: parseSpecificParams('VMName, ComputerName, Id, Name, SnapshotType'),
    description: 'Gets the checkpoints of a virtual machine or a checkpoint.'
  },
  {
    id: 'Restore-VMSnapshot',
    name: 'Restore-VMSnapshot',
    category: 'Hyper-V',
    parameters: parseSpecificParams('Name, VMName, ComputerName, Id, Passthru'),
    description: 'Restores a virtual machine checkpoint.'
  },

  // Module Management
  {
    id: 'Get-Module',
    name: 'Get-Module',
    category: 'Module Management',
    parameters: parseSpecificParams('Name, FullyQualifiedName, All, ListAvailable, PSEdition, Refresh, PSSession, CimSession, CimResourceUri, CimNamespace'),
    description: 'Gets the modules that have been imported or that can be imported into the current session.'
  },
  {
    id: 'Import-Module',
    name: 'Import-Module',
    category: 'Module Management',
    parameters: parseSpecificParams('Global, Prefix, Name, FullyQualifiedName, Assembly, Function, Cmdlet, Variable, Alias, Force, PassThru, AsCustomObject, MinimumVersion, MaximumVersion, RequiredVersion, ModuleInfo, ArgumentList, DisableNameChecking, NoClobber, Scope, PSSession, CimSession, CimResourceUri, CimNamespace'),
    description: 'Adds modules to the current session.'
  },
  {
    id: 'New-Module',
    name: 'New-Module',
    category: 'Module Management',
    parameters: parseSpecificParams('Name, ScriptBlock, Function, Cmdlet, ReturnResult, AsCustomObject, ArgumentList'),
    description: 'Creates a new dynamic module that exists only in memory.'
  },
  {
    id: 'New-ModuleManifest',
    name: 'New-ModuleManifest',
    category: 'Module Management',
    parameters: parseSpecificParams('Path, NestedModules, Guid, Author, CompanyName, Copyright, RootModule, ModuleVersion, Description, ProcessorArchitecture, PowerShellVersion, ClrVersion, DotNetFrameworkVersion, PowerShellHostName, PowerShellHostVersion, RequiredModules, TypesToProcess, FormatsToProcess, ScriptsToProcess, RequiredAssemblies, FileList, ModuleList, FunctionsToExport, AliasesToExport, VariablesToExport, CmdletsToExport, DscResourcesToExport, CompatiblePSEditions, PrivateData, Tags, ProjectUri, LicenseUri, IconUri, ReleaseNotes, HelpInfoUri, PassThru, DefaultCommandPrefix'),
    description: 'Creates a new module manifest (.psd1) file.'
  },
  {
    id: 'Remove-Module',
    name: 'Remove-Module',
    category: 'Module Management',
    parameters: parseSpecificParams('Name, FullyQualifiedName, ModuleInfo, Force'),
    description: 'Removes modules from the current session.'
  },
  {
    id: 'Test-ModuleManifest',
    name: 'Test-ModuleManifest',
    category: 'Module Management',
    parameters: parseSpecificParams('Path'),
    description: 'Verifies that a module manifest file accurately describes the contents of a module.'
  },

  // PowerShell Snap-ins (Legacy) - Retained as per your list
  {
    id: 'Add-PSSnapin',
    name: 'Add-PSSnapin',
    category: 'PowerShell Snap-ins',
    parameters: parseSpecificParams('Name, PassThru'),
    description: 'Adds one or more Windows PowerShell snap-ins to the current session.'
  },
  {
    id: 'Get-PSSnapin',
    name: 'Get-PSSnapin',
    category: 'PowerShell Snap-ins',
    parameters: parseSpecificParams('Name, Registered'),
    description: 'Gets the Windows PowerShell snap-ins on the computer.'
  },
  {
    id: 'Remove-PSSnapin',
    name: 'Remove-PSSnapin',
    category: 'PowerShell Snap-ins',
    parameters: parseSpecificParams('Name, PassThru'),
    description: 'Removes Windows PowerShell snap-ins from the current session.'
  },
  {
    id: 'Export-PSSession',
    name: 'Export-PSSession',
    category: 'PowerShell Snap-ins', // Categorized here for grouping with PSSession cmdlets
    parameters: parseSpecificParams('OutputModule,Force,Encoding,CommandName,AllowClobber,ArgumentList,CommandType,Module,FullyQualifiedModule,FormatTypeName,Certificate,Session'),
    description: 'Imports commands from another PSSession into the current session and saves them in a PowerShell module on disk.'
  },
];

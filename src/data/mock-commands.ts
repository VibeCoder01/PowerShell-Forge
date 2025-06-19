
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
    .filter(p => p && !commonParamsToExclude.includes(p))
    .map(p => ({ name: p }));
}

export const mockCommands: BasePowerShellCommand[] = [
  // System Management
  {
    id: 'Add-Computer',
    name: 'Add-Computer',
    category: 'System Management',
    parameters: parseSpecificParams('ComputerName, LocalCredential, UnjoinDomainCredential, Credential, DomainName, OUPath, Server, Unsecure, Options, WorkgroupName, Restart, PassThru, NewName, Force'),
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
    id: 'Get-Date',
    name: 'Get-Date',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Date, Year, Month, Day, Hour, Minute, Second, Millisecond, DisplayHint, UFormat, Format'),
    description: 'Gets the current date and time.'
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
    parameters: [], // Has no specific parameters from user list after common ones.
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
    id: 'Get-Random',
    name: 'Get-Random',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('SetSeed, Maximum, Minimum, InputObject, Count'),
    description: 'Gets a random number, or selects objects randomly from a collection.'
  },
  {
    id: 'Get-Variable',
    name: 'Get-Variable',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name, ValueOnly, Include, Exclude, Scope'),
    description: 'Gets the variables in the current console.'
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
    id: 'New-Alias',
    name: 'New-Alias',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name, Value, Description, Option, PassThru, Scope, Force'),
    description: 'Creates a new alias.'
  },
  {
    id: 'New-Object',
    name: 'New-Object',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('TypeName, ComObject, ArgumentList, Strict, Property'),
    description: 'Creates an instance of a Microsoft .NET Framework or COM object.'
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
    id: 'Out-Null',
    name: 'Out-Null',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('InputObject'),
    description: 'Deletes output instead of sending it to the console.'
  },
  {
    id: 'Remove-Variable',
    name: 'Remove-Variable',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name, Include, Exclude, Force, Scope'),
    description: 'Deletes a variable and its value.'
  },
  {
    id: 'Set-Alias',
    name: 'Set-Alias',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name, Value, Description, Option, PassThru, Scope, Force'),
    description: 'Creates or changes an alias.'
  },
  {
    id: 'Set-Variable',
    name: 'Set-Variable',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Name, Value, Include, Exclude, Description, Option, Force, Visibility, PassThru, Scope'),
    description: 'Sets the value of a variable. Creates the variable if one with the same name does not exist.'
  },
  {
    id: 'Start-Sleep',
    name: 'Start-Sleep',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('Seconds, Milliseconds'),
    description: 'Suspends the activity in a script or session for the specified period of time.',
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
    id: 'Write-Output',
    name: 'Write-Output',
    category: 'PowerShell Core & Scripting',
    parameters: parseSpecificParams('InputObject, NoEnumerate'),
    description: 'Sends the specified objects to the next command in the pipeline.',
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
    id: 'ConvertFrom-StringData',
    name: 'ConvertFrom-StringData',
    category: 'Data Handling & Formatting',
    parameters: parseSpecificParams('StringData'),
    description: 'Converts a string containing one or more key/value pairs to a hash table.'
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
    id: 'New-WebServiceProxy',
    name: 'New-WebServiceProxy',
    category: 'Networking',
    parameters: parseSpecificParams('Uri, Class, Namespace, Credential, UseDefaultCredential'),
    description: 'Creates a Web service proxy object that lets you use and manage the Web service in PowerShell.'
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
    id: 'Test-Connection',
    name: 'Test-Connection',
    category: 'Networking',
    parameters: parseSpecificParams('AsJob, DcomAuthentication, WsmanAuthentication, Protocol, BufferSize, ComputerName, Count, Credential, Source, Impersonation, ThrottleLimit, TimeToLive, Delay, Quiet'),
    description: 'Sends ICMP echo request packets ("pings") to one or more remote computers.',
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
    id: 'Set-Acl',
    name: 'Set-Acl',
    category: 'Security',
    parameters: parseSpecificParams('Path, LiteralPath, InputObject, AclObject, ClearCentralAccessPolicy, Passthru, Filter, Include, Exclude'),
    description: 'Changes the security descriptor of a specified item, such as a file or a registry key.',
  },
  {
    id: 'Set-ExecutionPolicy',
    name: 'Set-ExecutionPolicy',
    category: 'Security',
    parameters: parseSpecificParams('ExecutionPolicy, Scope, Force'),
    description: 'Changes the user preference for the PowerShell execution policy.',
  },
  {
    id: 'Unblock-File',
    name: 'Unblock-File',
    category: 'Security',
    parameters: parseSpecificParams('Path, LiteralPath'),
    description: 'Unblocks files that were downloaded from the Internet.'
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

  // PowerShell Snap-ins (Legacy)
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
];


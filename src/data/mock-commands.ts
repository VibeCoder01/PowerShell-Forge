
import type { BasePowerShellCommand } from '@/types/powershell';

// Note: Common PowerShell parameters (Verbose, Debug, ErrorAction, etc.) are generally omitted 
// from the 'parameters' list here as they will be handled by a dedicated UI section.
// Descriptions are kept concise for UI purposes.

export const mockCommands: BasePowerShellCommand[] = [
  // System Management
  {
    id: 'Add-Computer',
    name: 'Add-Computer',
    category: 'System Management',
    parameters: [ { name: 'DomainName' }, { name: 'ComputerName' }, { name: 'LocalCredential' }, { name: 'Credential' }, { name: 'OUPath' }, { name: 'Server' }, { name: 'UnjoinDomainCredential' }, { name: 'WorkgroupName' }, { name: 'NewName' }, { name: 'PassThru' }, { name: 'Force' }, { name: 'Restart' }, { name: 'Unsecure' }, { name: 'Options' } ],
    description: 'Adds the local computer or remote computers to a domain or a workgroup.',
  },
  {
    id: 'Checkpoint-Computer',
    name: 'Checkpoint-Computer',
    category: 'System Management',
    parameters: [ { name: 'Description' }, { name: 'RestorePointType' } ],
    description: 'Creates a system restore point on the local computer.',
  },
  {
    id: 'Clear-EventLog',
    name: 'Clear-EventLog',
    category: 'System Management',
    parameters: [{ name: 'LogName' }, { name: 'ComputerName' }],
    description: 'Clears all entries from specified event logs on the local or remote computers.',
  },
  {
    id: 'Clear-RecycleBin',
    name: 'Clear-RecycleBin',
    category: 'System Management',
    parameters: [ { name: 'DriveLetter' }, { name: 'Force' } ],
    description: 'Clears the recycle bin on the specified drive.',
  },
  {
    id: 'Get-ComputerInfo',
    name: 'Get-ComputerInfo',
    category: 'System Management',
    parameters: [{ name: 'Property' }],
    description: 'Gets system and operating system properties.'
  },
  {
    id: 'Get-EventLog',
    name: 'Get-EventLog',
    category: 'System Management',
    parameters: [{ name: 'LogName' }, { name: 'ComputerName' }, { name: 'Newest' }, { name: 'After' }, { name: 'Before' }, { name: 'UserName' }, { name: 'InstanceId' }, { name: 'Index' }, { name: 'EntryType' }, { name: 'Source' }, { name: 'Message' }, { name: 'AsBaseObject' }, { name: 'List' }, { name: 'AsString' }],
    description: 'Gets events in local or remote event logs.',
  },
  {
    id: 'Get-HotFix',
    name: 'Get-HotFix',
    category: 'System Management',
    parameters: [{ name: 'Id' }, { name: 'Description' }, { name: 'ComputerName' }, { name: 'Credential' }],
    description: 'Gets the hotfixes that have been applied to the local and remote computers.',
  },
  {
    id: 'Get-Process',
    name: 'Get-Process',
    category: 'System Management',
    parameters: [{ name: 'Name' }, { name: 'Id' }, { name: 'InputObject' }, { name: 'IncludeUserName' }, { name: 'ComputerName' }, { name: 'Module' }, { name: 'FileVersionInfo' }],
    description: 'Gets the processes that are running on the local computer or a remote computer.',
  },
  {
    id: 'Get-Service',
    name: 'Get-Service',
    category: 'System Management',
    parameters: [{ name: 'Name' }, { name: 'ComputerName' }, { name: 'DependentServices' }, { name: 'RequiredServices' }, { name: 'DisplayName' }, { name: 'Include' }, { name: 'Exclude' }, { name: 'InputObject' }],
    description: 'Gets the services on a local or remote computer.',
  },
  {
    id: 'Restart-Computer',
    name: 'Restart-Computer',
    category: 'System Management',
    parameters: [{ name: 'ComputerName' }, { name: 'Force' }, { name: 'Wait' }, { name: 'Timeout' }, { name: 'For' }, { name: 'Delay' }, { name: 'Credential' }, { name: 'WsmanAuthentication' }, { name: 'DcomAuthentication' }, { name: 'Protocol' }, { name: 'Impersonation' }, { name: 'ThrottleLimit' }, { name: 'AsJob' }],
    description: 'Restarts the operating system on local and remote computers.',
  },
  {
    id: 'Restart-Service',
    name: 'Restart-Service',
    category: 'System Management',
    parameters: [{ name: 'Force' }, { name: 'Name' }, { name: 'InputObject' }, { name: 'PassThru' }, { name: 'DisplayName' }, { name: 'Include' }, { name: 'Exclude' }],
    description: 'Stops and then starts one or more services.',
  },
  {
    id: 'Start-Process',
    name: 'Start-Process',
    category: 'System Management',
    parameters: [{ name: 'FilePath' }, { name: 'ArgumentList' }, { name: 'Credential' }, { name: 'WorkingDirectory' }, { name: 'LoadUserProfile' }, { name: 'NoNewWindow' }, { name: 'PassThru' }, { name: 'RedirectStandardError' }, { name: 'RedirectStandardInput' }, { name: 'RedirectStandardOutput' }, { name: 'Verb' }, { name: 'WindowStyle' }, { name: 'Wait' }, { name: 'UseNewEnvironment' }],
    description: 'Starts one or more processes on the local computer.',
  },
  {
    id: 'Start-Service',
    name: 'Start-Service',
    category: 'System Management',
    parameters: [{ name: 'Name' }, { name: 'InputObject' }, { name: 'PassThru' }, { name: 'DisplayName' }, { name: 'Include' }, { name: 'Exclude' }],
    description: 'Starts one or more stopped services.',
  },
  {
    id: 'Stop-Computer',
    name: 'Stop-Computer',
    category: 'System Management',
    parameters: [{ name: 'ComputerName' }, { name: 'Force' }, { name: 'Credential' }, { name: 'WsmanAuthentication' }, { name: 'DcomAuthentication' }, { name: 'Protocol' }, { name: 'Impersonation' }, { name: 'ThrottleLimit' }, { name: 'AsJob' }],
    description: 'Shuts down local and remote computers.',
  },
  {
    id: 'Stop-Process',
    name: 'Stop-Process',
    category: 'System Management',
    parameters: [{ name: 'Name' }, { name: 'Id' }, { name: 'InputObject' }, { name: 'PassThru' }, { name: 'Force' }],
    description: 'Stops one or more running processes.',
  },
  {
    id: 'Stop-Service',
    name: 'Stop-Service',
    category: 'System Management',
    parameters: [{ name: 'Force' }, { name: 'NoWait' }, { name: 'Name' }, { name: 'InputObject' }, { name: 'PassThru' }, { name: 'DisplayName' }, { name: 'Include' }, { name: 'Exclude' }],
    description: 'Stops one or more running services.',
  },
  {
    id: 'Disable-ComputerRestore',
    name: 'Disable-ComputerRestore',
    category: 'System Management',
    parameters: [{ name: 'Drive' }],
    description: 'Disables the System Restore feature on the specified file system drive.'
  },
  {
    id: 'Enable-ComputerRestore',
    name: 'Enable-ComputerRestore',
    category: 'System Management',
    parameters: [{ name: 'Drive' }],
    description: 'Enables the System Restore feature on the specified file system drive.'
  },
  {
    id: 'Get-ComputerRestorePoint',
    name: 'Get-ComputerRestorePoint',
    category: 'System Management',
    parameters: [{ name: 'RestorePoint' }, { name: 'LastStatus' }],
    description: 'Gets the restore points on the local computer.'
  },
  {
    id: 'Restore-Computer',
    name: 'Restore-Computer',
    category: 'System Management',
    parameters: [{ name: 'RestorePoint' }],
    description: 'Starts a system restore on the local computer.'
  },

  // File & Item Management
  {
    id: 'Add-Content',
    name: 'Add-Content',
    category: 'File & Item Management',
    parameters: [{ name: 'Path' }, { name: 'LiteralPath' }, { name: 'Value' }, { name: 'Filter' }, { name: 'Include' }, { name: 'Exclude' }, { name: 'Force' }, { name: 'Credential' }, { name: 'NoNewline' }, { name: 'Encoding' }, { name: 'Stream' }, { name: 'PassThru' }],
    description: 'Adds content to the specified items, such as adding words to a file.',
  },
  {
    id: 'Clear-Content',
    name: 'Clear-Content',
    category: 'File & Item Management',
    parameters: [{ name: 'Path' }, { name: 'LiteralPath' }, { name: 'Filter' }, { name: 'Include' }, { name: 'Exclude' }, { name: 'Force' }, { name: 'Credential' }, { name: 'Stream' }],
    description: 'Deletes the content of an item, such as the text in a file, but does not delete the item.',
  },
  {
    id: 'Clear-Item',
    name: 'Clear-Item',
    category: 'File & Item Management',
    parameters: [ { name: 'Path' }, { name: 'LiteralPath' }, { name: 'Force' }, { name: 'Filter' }, { name: 'Include' }, { name: 'Exclude' }, { name: 'Credential' } ],
    description: 'Removes the content from an item, but does not delete the item.',
  },
  {
    id: 'Copy-Item',
    name: 'Copy-Item',
    category: 'File & Item Management',
    parameters: [{ name: 'Path' }, { name: 'LiteralPath' }, { name: 'Destination' }, { name: 'Container' }, { name: 'Force' }, { name: 'Filter' }, { name: 'Include' }, { name: 'Exclude' }, { name: 'Recurse' }, { name: 'PassThru' }, { name: 'Credential' }, { name: 'FromSession' }, { name: 'ToSession' }],
    description: 'Copies an item from one location to another.',
  },
  {
    id: 'Get-ChildItem',
    name: 'Get-ChildItem',
    category: 'File & Item Management',
    parameters: [{ name: 'Path' }, { name: 'LiteralPath' }, { name: 'Filter' }, { name: 'Include' }, { name: 'Exclude' }, { name: 'Recurse' }, { name: 'Depth' }, { name: 'Force' }, { name: 'Name' }, { name: 'Attributes' }, { name: 'Directory' }, { name: 'File' }, { name: 'Hidden' }, { name: 'ReadOnly' }, { name: 'System' }, { name: 'FollowSymlink' } ],
    description: 'Gets the items and child items in one or more specified locations.',
  },
  {
    id: 'Get-Content',
    name: 'Get-Content',
    category: 'File & Item Management',
    parameters: [{ name: 'Path' }, { name: 'LiteralPath' }, { name: 'ReadCount' }, { name: 'TotalCount' }, { name: 'Tail' }, { name: 'Filter' }, { name: 'Include' }, { name: 'Exclude' }, { name: 'Force' }, { name: 'Credential' }, { name: 'Delimiter' }, { name: 'Wait' }, { name: 'Raw' }, { name: 'Encoding' }, { name: 'Stream' }],
    description: 'Gets the content of the item at the specified location.',
  },
  {
    id: 'Get-Item',
    name: 'Get-Item',
    category: 'File & Item Management',
    parameters: [ { name: 'Path' }, { name: 'LiteralPath' }, { name: 'Filter' }, { name: 'Include' }, { name: 'Exclude' }, { name: 'Force' }, { name: 'Credential' }, { name: 'Stream' } ],
    description: 'Gets the item at the specified location.',
  },
  {
    id: 'Get-ItemProperty',
    name: 'Get-ItemProperty',
    category: 'File & Item Management',
    parameters: [{ name: 'Path' }, { name: 'LiteralPath' }, { name: 'Name' }, { name: 'Filter' }, { name: 'Include' }, { name: 'Exclude' }, { name: 'Credential' }],
    description: 'Gets the properties of a specified item.',
  },
  {
    id: 'Get-ItemPropertyValue',
    name: 'Get-ItemPropertyValue',
    category: 'File & Item Management',
    parameters: [{ name: 'Path' }, { name: 'LiteralPath' }, { name: 'Name' }, { name: 'Filter' }, { name: 'Include' }, { name: 'Exclude' }, { name: 'Credential' }],
    description: 'Gets the value for one or more properties of a specified item.',
  },
  {
    id: 'Get-Location',
    name: 'Get-Location',
    category: 'File & Item Management',
    parameters: [{ name: 'PSProvider' }, { name: 'PSDrive' }, { name: 'Stack' }, { name: 'StackName' }],
    description: 'Gets information about the current working location or a location stack.'
  },
  {
    id: 'Join-Path',
    name: 'Join-Path',
    category: 'File & Item Management',
    parameters: [{ name: 'Path' }, { name: 'ChildPath' }, { name: 'Resolve' }, { name: 'Credential' }],
    description: 'Combines a path and a child path into a single path.'
  },
  {
    id: 'Move-Item',
    name: 'Move-Item',
    category: 'File & Item Management',
    parameters: [{ name: 'Path' }, { name: 'LiteralPath' }, { name: 'Destination' }, { name: 'Force' }, { name: 'Filter' }, { name: 'Include' }, { name: 'Exclude' }, { name: 'PassThru' }, { name: 'Credential' }],
    description: 'Moves an item from one location to another.',
  },
  {
    id: 'New-Item',
    name: 'New-Item',
    category: 'File & Item Management',
    parameters: [{ name: 'Path' }, { name: 'Name' }, { name: 'ItemType' }, { name: 'Value' }, { name: 'Force' }, { name: 'Credential' }],
    description: 'Creates a new item.',
  },
  {
    id: 'Pop-Location',
    name: 'Pop-Location',
    category: 'File & Item Management',
    parameters: [{ name: 'PassThru' }, { name: 'StackName' }],
    description: 'Changes the current location to the location most recently pushed onto the stack.'
  },
  {
    id: 'Push-Location',
    name: 'Push-Location',
    category: 'File & Item Management',
    parameters: [{ name: 'Path' }, { name: 'LiteralPath' }, { name: 'PassThru' }, { name: 'StackName' }],
    description: 'Adds the current location to the top of a location stack.'
  },
  {
    id: 'Remove-Item',
    name: 'Remove-Item',
    category: 'File & Item Management',
    parameters: [{ name: 'Path' }, { name: 'LiteralPath' }, { name: 'Filter' }, { name: 'Include' }, { name: 'Exclude' }, { name: 'Recurse' }, { name: 'Force' }, { name: 'Credential' }, { name: 'Stream' }],
    description: 'Deletes items.',
  },
  {
    id: 'Rename-Item',
    name: 'Rename-Item',
    category: 'File & Item Management',
    parameters: [{ name: 'Path' }, { name: 'LiteralPath' }, { name: 'NewName' }, { name: 'Force' }, { name: 'PassThru' }, { name: 'Credential' }],
    description: 'Renames an item in a PowerShell provider namespace.',
  },
  {
    id: 'Set-Content',
    name: 'Set-Content',
    category: 'File & Item Management',
    parameters: [{ name: 'Path' }, { name: 'LiteralPath' }, { name: 'Value' }, { name: 'Filter' }, { name: 'Include' }, { name: 'Exclude' }, { name: 'Force' }, { name: 'Credential' }, { name: 'NoNewline' }, { name: 'Encoding' }, { name: 'Stream' }, { name: 'PassThru' }],
    description: 'Writes new content or replaces the content in a file.',
  },
  {
    id: 'Set-ItemProperty',
    name: 'Set-ItemProperty',
    category: 'File & Item Management',
    parameters: [{ name: 'Path' }, { name: 'LiteralPath' }, { name: 'Name' }, { name: 'Value' }, { name: 'InputObject' }, { name: 'PassThru' }, { name: 'Force' }, { name: 'Filter' }, { name: 'Include' }, { name: 'Exclude' }, { name: 'Credential' }],
    description: 'Creates or changes the value of a property of an item.',
  },
  {
    id: 'Set-Location',
    name: 'Set-Location',
    category: 'File & Item Management',
    parameters: [{ name: 'Path' }, { name: 'LiteralPath' }, { name: 'PassThru' }, { name: 'StackName' }],
    description: 'Sets the current working location to a specified location.'
  },
  {
    id: 'Split-Path',
    name: 'Split-Path',
    category: 'File & Item Management',
    parameters: [ { name: 'Path' }, { name: 'LiteralPath' }, { name: 'Qualifier' }, { name: 'NoQualifier' }, { name: 'Parent' }, { name: 'Leaf' }, { name: 'Resolve' }, { name: 'IsAbsolute' }, { name: 'Credential' } ],
    description: 'Returns the specified part of a path.',
  },
  {
    id: 'Test-Path',
    name: 'Test-Path',
    category: 'File & Item Management',
    parameters: [{ name: 'Path' }, { name: 'LiteralPath' }, { name: 'Filter' }, { name: 'Include' }, { name: 'Exclude' }, { name: 'PathType' }, { name: 'IsValid' }, { name: 'Credential' }, { name: 'OlderThan' }, { name: 'NewerThan' }],
    description: 'Determines whether all elements of a path exist.',
  },

  // PowerShell Core & Scripting
  {
    id: 'Add-History',
    name: 'Add-History',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'InputObject' }, { name: 'Passthru' }],
    description: 'Adds entries to the session history.'
  },
  {
    id: 'Add-Member',
    name: 'Add-Member',
    category: 'PowerShell Core & Scripting',
    parameters: [{name: 'InputObject'}, {name: 'MemberType'}, {name: 'Name'}, {name: 'Value'}, {name: 'SecondValue'}, {name: 'TypeName'}, {name: 'Force'}, {name: 'PassThru'}, {name: 'NotePropertyName'}, {name: 'NotePropertyValue'}, {name: 'NotePropertyMembers'}],
    description: 'Adds custom properties and methods to an instance of a PowerShell object.'
  },
  {
    id: 'Add-Type',
    name: 'Add-Type',
    category: 'PowerShell Core & Scripting',
    parameters: [{name: 'TypeDefinition'}, {name: 'Path'}, {name: 'LiteralPath'}, {name: 'AssemblyName'}, {name: 'MemberDefinition'}, {name: 'Namespace'}, {name: 'UsingNamespace'}, {name: 'ReferencedAssemblies'}, {name: 'OutputType'}, {name: 'Language'}, {name: 'CodeDomProvider'}, {name: 'CompilerParameters'}, {name: 'IgnoreWarnings'}, {name: 'PassThru'}, {name: 'Name'}],
    description: 'Adds a Microsoft .NET Framework type (a class or enumeration) to a PowerShell session.'
  },
  {
    id: 'Clear-History',
    name: 'Clear-History',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'Id' }, { name: 'Count' }, { name: 'CommandLine' }, { name: 'Newest' }],
    description: 'Deletes entries from the command history.'
  },
  {
    id: 'Clear-Variable',
    name: 'Clear-Variable',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'Name' }, { name: 'Include' }, { name: 'Exclude' }, { name: 'Force' }, { name: 'PassThru' }, { name: 'Scope' }],
    description: 'Deletes the value of a variable, but does not delete the variable.'
  },
  {
    id: 'Get-Alias',
    name: 'Get-Alias',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'Name' }, { name: 'Exclude' }, { name: 'Scope' }, { name: 'Definition' }],
    description: 'Gets the aliases for the current session.'
  },
  {
    id: 'Get-Command',
    name: 'Get-Command',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'Name' }, { name: 'Verb' }, { name: 'Noun' }, { name: 'Module' }, { name: 'FullyQualifiedModule' }, { name: 'CommandType' }, { name: 'TotalCount' }, { name: 'Syntax' }, { name: 'ShowCommandInfo' }, { name: 'ArgumentList' }, { name: 'All' }, { name: 'ListImported' }, { name: 'ParameterName' }, { name: 'ParameterType' }],
    description: 'Gets all commands that are installed on the computer.',
  },
  {
    id: 'Get-Date',
    name: 'Get-Date',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'Date' }, { name: 'Year' }, { name: 'Month' }, { name: 'Day' }, { name: 'Hour' }, { name: 'Minute' }, { name: 'Second' }, { name: 'Millisecond' }, { name: 'DisplayHint' }, { name: 'UFormat' }, { name: 'Format' }],
    description: 'Gets the current date and time.'
  },
  {
    id: 'Get-Help',
    name: 'Get-Help',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'Name' }, { name: 'Path' }, { name: 'Category' }, { name: 'Component' }, { name: 'Functionality' }, { name: 'Role' }, { name: 'Detailed' }, { name: 'Full' }, { name: 'Examples' }, { name: 'Parameter' }, { name: 'Online' }, { name: 'ShowWindow' }],
    description: 'Displays information about PowerShell commands and concepts.',
  },
  {
    id: 'Get-History',
    name: 'Get-History',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'Id' }, { name: 'Count' }],
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
    parameters: [{name: 'InputObject'}, {name: 'Name'}, {name: 'MemberType'}, {name: 'View'}, {name: 'Static'}, {name: 'Force'}],
    description: 'Gets the properties and methods of objects.'
  },
  {
    id: 'Get-Random',
    name: 'Get-Random',
    category: 'PowerShell Core & Scripting',
    parameters: [{name: 'InputObject'}, {name: 'Count'}, {name: 'SetSeed'}, {name: 'Maximum'}, {name: 'Minimum'}],
    description: 'Gets a random number, or selects objects randomly from a collection.'
  },
  {
    id: 'Get-Variable',
    name: 'Get-Variable',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'Name' }, { name: 'ValueOnly' }, { name: 'Include' }, { name: 'Exclude' }, { name: 'Scope' }],
    description: 'Gets the variables in the current console.'
  },
  {
    id: 'Invoke-Expression',
    name: 'Invoke-Expression',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'Command' }],
    description: 'Runs commands or expressions on the local computer.',
  },
  {
    id: 'Invoke-History',
    name: 'Invoke-History',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'Id' }],
    description: 'Runs commands from the session history.'
  },
  {
    id: 'New-Alias',
    name: 'New-Alias',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'Name' }, { name: 'Value' }, { name: 'Description' }, { name: 'Option' }, { name: 'PassThru' }, { name: 'Scope' }, { name: 'Force' }],
    description: 'Creates a new alias.'
  },
  {
    id: 'New-Object',
    name: 'New-Object',
    category: 'PowerShell Core & Scripting',
    parameters: [{name: 'TypeName'}, {name: 'ArgumentList'}, {name: 'Property'}, {name: 'ComObject'}, {name: 'Strict'}],
    description: 'Creates an instance of a Microsoft .NET Framework or COM object.'
  },
  {
    id: 'New-TimeSpan',
    name: 'New-TimeSpan',
    category: 'PowerShell Core & Scripting',
    parameters: [{name: 'Start'}, {name: 'End'}, {name: 'Days'}, {name: 'Hours'}, {name: 'Minutes'}, {name: 'Seconds'}],
    description: 'Creates a TimeSpan object.'
  },
  {
    id: 'New-Variable',
    name: 'New-Variable',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'Name' }, { name: 'Value' }, { name: 'Description' }, { name: 'Option' }, { name: 'Visibility' }, { name: 'Force' }, { name: 'PassThru' }, { name: 'Scope' }],
    description: 'Creates a new variable.'
  },
  {
    id: 'Out-Null',
    name: 'Out-Null',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'InputObject' }],
    description: 'Deletes output instead of sending it to the console.'
  },
  {
    id: 'Remove-Variable',
    name: 'Remove-Variable',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'Name' }, { name: 'Include' }, { name: 'Exclude' }, { name: 'Force' }, { name: 'Scope' }],
    description: 'Deletes a variable and its value.'
  },
  {
    id: 'Set-Alias',
    name: 'Set-Alias',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'Name' }, { name: 'Value' }, { name: 'Description' }, { name: 'Option' }, { name: 'PassThru' }, { name: 'Scope' }, { name: 'Force' }],
    description: 'Creates or changes an alias.'
  },
  {
    id: 'Set-Variable',
    name: 'Set-Variable',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'Name' }, { name: 'Value' }, { name: 'Include' }, { name: 'Exclude' }, { name: 'Description' }, { name: 'Option' }, { name: 'Force' }, { name: 'Visibility' }, { name: 'PassThru' }, { name: 'Scope' }],
    description: 'Sets the value of a variable. Creates the variable if one with the same name does not exist.'
  },
  {
    id: 'Start-Sleep',
    name: 'Start-Sleep',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'Seconds' }, { name: 'Milliseconds' }],
    description: 'Suspends the activity in a script or session for the specified period of time.',
  },
  {
    id: 'Write-Debug',
    name: 'Write-Debug',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'Message' }],
    description: 'Writes a debug message to the console.'
  },
  {
    id: 'Write-Error',
    name: 'Write-Error',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'Message' }, { name: 'Exception' }, { name: 'ErrorRecord' }, { name: 'Category' }, { name: 'ErrorId' }, { name: 'TargetObject' }, { name: 'RecommendedAction' }, { name: 'CategoryActivity' }, { name: 'CategoryReason' }, { name: 'CategoryTargetName' }, { name: 'CategoryTargetType' }],
    description: 'Writes an object to the error stream.'
  },
  {
    id: 'Write-Host',
    name: 'Write-Host',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'Object' }, { name: 'NoNewline' }, { name: 'Separator' }, { name: 'ForegroundColor' }, { name: 'BackgroundColor' }],
    description: 'Writes customized output to a host.',
  },
  {
    id: 'Write-Output',
    name: 'Write-Output',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'InputObject' }, { name: 'NoEnumerate' }],
    description: 'Sends the specified objects to the next command in the pipeline.',
  },
  {
    id: 'Write-Verbose',
    name: 'Write-Verbose',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'Message' }],
    description: 'Writes text to the verbose message stream.'
  },
  {
    id: 'Write-Warning',
    name: 'Write-Warning',
    category: 'PowerShell Core & Scripting',
    parameters: [{ name: 'Message' }],
    description: 'Writes a warning message.'
  },


  // Data Handling & Formatting
  {
    id: 'Compare-Object',
    name: 'Compare-Object',
    category: 'Data Handling & Formatting',
    parameters: [{name: 'ReferenceObject'}, {name: 'DifferenceObject'}, {name: 'Property'}, {name: 'ExcludeDifferent'}, {name: 'IncludeEqual'}, {name: 'PassThru'}, {name: 'SyncWindow'}, {name: 'Culture'}, {name: 'CaseSensitive'}],
    description: 'Compares two sets of objects.'
  },
  {
    id: 'ConvertFrom-Csv',
    name: 'ConvertFrom-Csv',
    category: 'Data Handling & Formatting',
    parameters: [{name: 'InputObject'}, {name: 'Delimiter'}, {name: 'Header'}, {name: 'UseCulture'}],
    description: 'Converts character-separated value (CSV) data into PSObject type objects.'
  },
  {
    id: 'ConvertFrom-Json',
    name: 'ConvertFrom-Json',
    category: 'Data Handling & Formatting',
    parameters: [{ name: 'InputObject' }],
    description: 'Converts a JSON-formatted string to a custom object.',
  },
  {
    id: 'ConvertFrom-StringData',
    name: 'ConvertFrom-StringData',
    category: 'Data Handling & Formatting',
    parameters: [{name: 'StringData'}],
    description: 'Converts a string containing one or more key/value pairs to a hash table.'
  },
  {
    id: 'ConvertTo-Csv',
    name: 'ConvertTo-Csv',
    category: 'Data Handling & Formatting',
    parameters: [{name: 'InputObject'}, {name: 'Delimiter'}, {name: 'NoTypeInformation'}, {name: 'UseCulture'}],
    description: 'Converts .NET objects into a series of character-separated value (CSV) strings.'
  },
  {
    id: 'ConvertTo-Html',
    name: 'ConvertTo-Html',
    category: 'Data Handling & Formatting',
    parameters: [ { name: 'InputObject' }, { name: 'Property' }, { name: 'Body' }, { name: 'Head' }, { name: 'Title' }, { name: 'As' }, { name: 'CssUri' }, { name: 'Fragment' }, { name: 'PostContent' }, { name: 'PreContent' } ],
    description: 'Converts Microsoft .NET Framework objects into HTML that can be displayed in a Web browser.',
  },
  {
    id: 'ConvertTo-Json',
    name: 'ConvertTo-Json',
    category: 'Data Handling & Formatting',
    parameters: [{ name: 'InputObject' }, { name: 'Depth' }, { name: 'Compress' }],
    description: 'Converts an object to a JSON-formatted string.',
  },
  {
    id: 'ConvertTo-Xml',
    name: 'ConvertTo-Xml',
    category: 'Data Handling & Formatting',
    parameters: [ { name: 'InputObject' }, { name: 'Depth' }, { name: 'NoTypeInformation' }, { name: 'As' } ],
    description: 'Creates an XML-based representation of an object or objects.',
  },
  {
    id: 'Export-Csv',
    name: 'Export-Csv',
    category: 'Data Handling & Formatting',
    parameters: [{ name: 'InputObject' }, { name: 'Path' }, { name: 'LiteralPath' }, { name: 'Force' }, { name: 'NoClobber' }, { name: 'Encoding' }, { name: 'Append' }, { name: 'Delimiter' }, { name: 'UseCulture' }, { name: 'NoTypeInformation' }],
    description: 'Converts objects into a series of comma-separated value (CSV) strings and saves them in a CSV file.',
  },
  {
    id: 'Format-List',
    name: 'Format-List',
    category: 'Data Handling & Formatting',
    parameters: [{ name: 'Property' }, { name: 'GroupBy' }, { name: 'View' }, { name: 'ShowError' }, { name: 'DisplayError' }, { name: 'Force' }, { name: 'Expand' }, { name: 'InputObject' }],
    description: 'Formats the output as a list of properties in which each property is displayed on a separate line.'
  },
  {
    id: 'Format-Table',
    name: 'Format-Table',
    category: 'Data Handling & Formatting',
    parameters: [{ name: 'Property' }, { name: 'AutoSize' }, { name: 'RepeatHeader' }, { name: 'HideTableHeaders' }, { name: 'Wrap' }, { name: 'GroupBy' }, { name: 'View' }, { name: 'ShowError' }, { name: 'DisplayError' }, { name: 'Force' }, { name: 'Expand' }, { name: 'InputObject' }],
    description: 'Formats the output as a table.'
  },
  {
    id: 'Format-Wide',
    name: 'Format-Wide',
    category: 'Data Handling & Formatting',
    parameters: [{ name: 'Property' }, { name: 'AutoSize' }, { name: 'Column' }, { name: 'GroupBy' }, { name: 'View' }, { name: 'ShowError' }, { name: 'DisplayError' }, { name: 'Force' }, { name: 'InputObject' }],
    description: 'Formats objects as a wide table that displays only one property of each object.'
  },
  {
    id: 'Group-Object',
    name: 'Group-Object',
    category: 'Data Handling & Formatting',
    parameters: [{ name: 'InputObject' }, { name: 'Property' }, { name: 'Culture' }, { name: 'CaseSensitive' }, { name: 'NoElement' }, { name: 'AsHashTable' }, { name: 'AsString' }],
    description: 'Groups objects that contain the same value for specified properties.'
  },
  {
    id: 'Import-Csv',
    name: 'Import-Csv',
    category: 'Data Handling & Formatting',
    parameters: [{ name: 'Path' }, { name: 'LiteralPath' }, { name: 'Delimiter' }, { name: 'UseCulture' }, { name: 'Header' }, { name: 'Encoding' }],
    description: 'Creates table-like custom objects from the items in a CSV file.',
  },
  {
    id: 'Measure-Object',
    name: 'Measure-Object',
    category: 'Data Handling & Formatting',
    parameters: [{ name: 'InputObject' }, { name: 'Property' }, { name: 'Sum' }, { name: 'Average' }, { name: 'Maximum' }, { name: 'Minimum' }, { name: 'Line' }, { name: 'Word' }, { name: 'Character' }, { name: 'IgnoreWhiteSpace' }],
    description: 'Calculates the numeric properties of objects, and the characters, words, and lines in string objects.',
  },
  {
    id: 'Select-Object',
    name: 'Select-Object',
    category: 'Data Handling & Formatting',
    parameters: [{ name: 'InputObject' }, { name: 'Property' }, { name: 'ExcludeProperty' }, { name: 'ExpandProperty' }, { name: 'Unique' }, { name: 'Last' }, { name: 'First' }, { name: 'Skip' }, { name: 'SkipLast' }, { name: 'Wait' }, { name: 'Index' }],
    description: 'Selects objects or object properties.',
  },
  {
    id: 'Select-String',
    name: 'Select-String',
    category: 'Data Handling & Formatting',
    parameters: [{name: 'Pattern'}, {name: 'Path'}, {name: 'LiteralPath'}, {name: 'InputObject'}, {name: 'SimpleMatch'}, {name: 'CaseSensitive'}, {name: 'Quiet'}, {name: 'List'}, {name: 'Include'}, {name: 'Exclude'}, {name: 'NotMatch'}, {name: 'AllMatches'}, {name: 'Encoding'}, {name: 'Context'}],
    description: 'Finds text in strings and files.'
  },
  {
    id: 'Select-Xml',
    name: 'Select-Xml',
    category: 'Data Handling & Formatting',
    parameters: [{name: 'Xml'}, {name: 'Path'}, {name: 'LiteralPath'}, {name: 'Content'}, {name: 'XPath'}, {name: 'Namespace'}],
    description: 'Finds text in an XML string or document.'
  },
  {
    id: 'Sort-Object',
    name: 'Sort-Object',
    category: 'Data Handling & Formatting',
    parameters: [{ name: 'InputObject' }, { name: 'Property' }, { name: 'Descending' }, { name: 'Unique' }, { name: 'Culture' }, { name: 'CaseSensitive' }],
    description: 'Sorts objects by property values.',
  },
  {
    id: 'Tee-Object',
    name: 'Tee-Object',
    category: 'Data Handling & Formatting',
    parameters: [{name: 'InputObject'}, {name: 'FilePath'}, {name: 'LiteralPath'}, {name: 'Variable'}, {name: 'Append'}],
    description: 'Saves command output in a file or variable and also sends it down the pipeline.'
  },
  {
    id: 'Where-Object',
    name: 'Where-Object',
    category: 'Data Handling & Formatting',
    parameters: [{name: 'InputObject'}, {name: 'Property'}, {name: 'Value'}, {name: 'FilterScript'} /* Operators like EQ, NE, etc. are used with Property/Value or in FilterScript */],
    description: 'Selects objects from a collection based on their property values.'
  },


  // Networking
  {
    id: 'Invoke-RestMethod',
    name: 'Invoke-RestMethod',
    category: 'Networking',
    parameters: [{ name: 'Uri' }, { name: 'Method' }, { name: 'Body' }, { name: 'Headers' }, { name: 'ContentType' }, { name: 'Credential' }, { name: 'UseDefaultCredentials' }, { name: 'CertificateThumbprint' }, { name: 'Certificate' }, { name: 'UserAgent' }, { name: 'DisableKeepAlive' }, { name: 'TimeoutSec' }, { name: 'MaximumRedirection' }, { name: 'Proxy' }, { name: 'ProxyCredential' }, { name: 'ProxyUseDefaultCredentials' }, { name: 'InFile' }, { name: 'OutFile' }, { name: 'PassThru' }, { name: 'WebSession' }, { name: 'SessionVariable' }, { name: 'TransferEncoding' }],
    description: 'Sends an HTTP or HTTPS request to a RESTful web service.',
  },
  {
    id: 'Invoke-WebRequest',
    name: 'Invoke-WebRequest',
    category: 'Networking',
    parameters: [{ name: 'Uri' }, { name: 'WebSession' }, { name: 'SessionVariable' }, { name: 'Credential' }, { name: 'UseDefaultCredentials' }, { name: 'CertificateThumbprint' }, { name: 'Certificate' }, { name: 'UserAgent' }, { name: 'DisableKeepAlive' }, { name: 'TimeoutSec' }, { name: 'Headers' }, { name: 'MaximumRedirection' }, { name: 'Method' }, { name: 'Proxy' }, { name: 'ProxyCredential' }, { name: 'ProxyUseDefaultCredentials' }, { name: 'Body' }, { name: 'ContentType' }, { name: 'TransferEncoding' }, { name: 'InFile' }, { name: 'OutFile' }, { name: 'PassThru' }, { name: 'UseBasicParsing' }],
    description: 'Gets content from a web page on the Internet.',
  },
  {
    id: 'New-WebServiceProxy',
    name: 'New-WebServiceProxy',
    category: 'Networking',
    parameters: [{ name: 'Uri' }, { name: 'Class' }, { name: 'Namespace' }, { name: 'Credential' }, { name: 'UseDefaultCredential' }],
    description: 'Creates a Web service proxy object that lets you use and manage the Web service in PowerShell.'
  },
  {
    id: 'Resolve-DnsName',
    name: 'Resolve-DnsName',
    category: 'Networking',
    parameters: [{ name: 'Name' }, { name: 'Type' }, { name: 'Server' }, { name: 'DnsOnly' }, { name: 'CacheOnly' }, { name: 'NoHostsFile' }],
    description: 'Performs a DNS query for the specified name.',
  },
  {
    id: 'Send-MailMessage',
    name: 'Send-MailMessage',
    category: 'Networking',
    parameters: [ { name: 'From' }, { name: 'To' }, { name: 'Subject' }, { name: 'Body' }, { name: 'SmtpServer' }, { name: 'Cc' }, { name: 'Bcc' }, { name: 'Attachments' }, { name: 'Priority' }, { name: 'DeliveryNotificationOption' }, { name: 'Encoding' }, { name: 'BodyAsHtml' }, { name: 'Credential' }, { name: 'UseSsl' }, { name: 'Port' } ],
    description: 'Sends an e-mail message.',
  },
  {
    id: 'Test-Connection',
    name: 'Test-Connection',
    category: 'Networking',
    parameters: [{ name: 'ComputerName' }, { name: 'Count' }, { name: 'Delay' }, { name: 'BufferSize' }, { name: 'TimeToLive' }, { name: 'Quiet' }, { name: 'Source' }, { name: 'Credential' }, { name: 'DcomAuthentication' }, { name: 'WsmanAuthentication' }, { name: 'Protocol' }, { name: 'Impersonation' }, { name: 'ThrottleLimit' }, { name: 'AsJob' }],
    description: 'Sends ICMP echo request packets ("pings") to one or more remote computers.',
  },

  // Security
  {
    id: 'ConvertFrom-SecureString',
    name: 'ConvertFrom-SecureString',
    category: 'Security',
    parameters: [{ name: 'SecureString' }, { name: 'AsPlainText' }, { name: 'Key' }],
    description: 'Converts a secure string to an encrypted standard string.'
  },
  {
    id: 'ConvertTo-SecureString',
    name: 'ConvertTo-SecureString',
    category: 'Security',
    parameters: [{ name: 'String' }, { name: 'AsPlainText' }, { name: 'Force' }, { name: 'Key' }],
    description: 'Converts encrypted standard strings to secure strings.'
  },
  {
    id: 'Get-Acl',
    name: 'Get-Acl',
    category: 'Security',
    parameters: [{ name: 'Path' }, { name: 'LiteralPath' }, { name: 'InputObject' }, { name: 'Audit' }, { name: 'Filter' }, { name: 'Include' }, { name: 'Exclude' }],
    description: 'Gets the security descriptor for a resource, such as a file or registry key.',
  },
  {
    id: 'Get-Credential',
    name: 'Get-Credential',
    category: 'Security',
    parameters: [{ name: 'UserName' }, { name: 'Message' }],
    description: 'Gets a credential object based on a user name and password.'
  },
  {
    id: 'Get-ExecutionPolicy',
    name: 'Get-ExecutionPolicy',
    category: 'Security',
    parameters: [{ name: 'Scope' }, { name: 'List' }],
    description: 'Gets the execution policies for the current session.',
  },
  {
    id: 'Set-Acl',
    name: 'Set-Acl',
    category: 'Security',
    parameters: [{ name: 'Path' }, { name: 'LiteralPath' }, { name: 'InputObject' }, { name: 'AclObject' }, { name: 'ClearCentralAccessPolicy' }, { name: 'Passthru' }, { name: 'Filter' }, { name: 'Include' }, { name: 'Exclude' }],
    description: 'Changes the security descriptor of a specified item, such as a file or a registry key.',
  },
  {
    id: 'Set-ExecutionPolicy',
    name: 'Set-ExecutionPolicy',
    category: 'Security',
    parameters: [{ name: 'ExecutionPolicy' }, { name: 'Scope' }, { name: 'Force' }],
    description: 'Changes the user preference for the PowerShell execution policy.',
  },
  {
    id: 'Unblock-File',
    name: 'Unblock-File',
    category: 'Security',
    parameters: [{ name: 'Path' }, { name: 'LiteralPath' }],
    description: 'Unblocks files that were downloaded from the Internet.'
  },

  // Application Management
  {
    id: 'Add-AppxPackage',
    name: 'Add-AppxPackage',
    category: 'Application Management',
    parameters: [{ name: 'Path' }, { name: 'DependencyPath' }, { name: 'Register' }, { name: 'DisableDevelopmentMode' }, { name: 'ForceApplicationShutdown' }, { name: 'ForceTargetApplicationShutdown' }, { name: 'ForceUpdateFromAnyVersion' }, { name: 'InstallAllResources' }, { name: 'PackageFamilyName' }, { name: 'RequiredContentGroupOnly' }, { name: 'RetainFilesOnFailure' }, { name: 'StageInPlace' }, { name: 'StubPackageOption' }, { name: 'UpdateIfFound' }, { name: 'Volume' }],
    description: 'Adds a signed app package to a user account.',
  },
  {
    id: 'Get-AppxPackage',
    name: 'Get-AppxPackage',
    category: 'Application Management',
    parameters: [{ name: 'Name' }, { name: 'Publisher' }, { name: 'AllUsers' }, { name: 'User' }],
    description: 'Gets a list of the app packages that are installed in a user profile.',
  },
  {
    id: 'Remove-AppxPackage',
    name: 'Remove-AppxPackage',
    category: 'Application Management',
    parameters: [{ name: 'Package' }, { name: 'AllUsers' }, { name: 'PreserveApplicationData' }, { name: 'User' }],
    description: 'Removes an app package from a user account.',
  },

  // Hyper-V
  {
    id: 'Get-VM',
    name: 'Get-VM',
    category: 'Hyper-V',
    parameters: [{ name: 'Name' }, { name: 'ComputerName' }, { name: 'Id' }],
    description: 'Gets the virtual machines from one or more Hyper-V hosts.',
  },
  {
    id: 'New-VM',
    name: 'New-VM',
    category: 'Hyper-V',
    parameters: [{ name: 'Name' }, { name: 'MemoryStartupBytes' }, { name: 'BootDevice' }, { name: 'VHDPath' }, { name: 'Path' }, { name: 'SwitchName' }, { name: 'Generation' }, { name: 'ComputerName' }],
    description: 'Creates a new virtual machine.'
  },
  {
    id: 'Remove-VM',
    name: 'Remove-VM',
    category: 'Hyper-V',
    parameters: [{ name: 'Name' }, { name: 'VM' }, { name: 'ComputerName' }, { name: 'Force' }, { name: 'PassThru' }],
    description: 'Deletes a virtual machine.'
  },
  {
    id: 'Start-VM',
    name: 'Start-VM',
    category: 'Hyper-V',
    parameters: [{ name: 'Name' }, { name: 'VM' }, { name: 'ComputerName' }, { name: 'PassThru' }],
    description: 'Starts a virtual machine.',
  },
  {
    id: 'Stop-VM',
    name: 'Stop-VM',
    category: 'Hyper-V',
    parameters: [{ name: 'Name' }, { name: 'VM' }, { name: 'ComputerName' }, { name: 'Force' }, { name: 'TurnOff' }, { name: 'Save' }, { name: 'PassThru' }],
    description: 'Shuts down, turns off, or saves a virtual machine.',
  },
  {
    id: 'Checkpoint-VM',
    name: 'Checkpoint-VM',
    category: 'Hyper-V',
    parameters: [{name: 'Name'}, {name: 'VM'}, {name: 'SnapshotName'}, {name: 'ComputerName'}, {name: 'AsJob'}, {name: 'Passthru'}],
    description: 'Creates a checkpoint of a virtual machine.'
  },
  {
    id: 'Get-VMSnapshot',
    name: 'Get-VMSnapshot',
    category: 'Hyper-V',
    parameters: [{name: 'VMName'}, {name: 'ComputerName'}, {name: 'Id'}, {name: 'Name'}, {name: 'SnapshotType'}],
    description: 'Gets the checkpoints of a virtual machine or a checkpoint.'
  },
  {
    id: 'Restore-VMSnapshot',
    name: 'Restore-VMSnapshot',
    category: 'Hyper-V',
    parameters: [{name: 'Name'}, {name: 'VMName'}, {name: 'ComputerName'}, {name: 'Id'}, {name: 'Passthru'}],
    description: 'Restores a virtual machine checkpoint.'
  },

  // Module Management
  {
    id: 'Get-Module',
    name: 'Get-Module',
    category: 'Module Management',
    parameters: [{name: 'Name'}, {name: 'ListAvailable'}, {name: 'All'}, {name: 'Refresh'}, {name: 'PSSession'}, {name: 'CimSession'}, {name: 'FullyQualifiedName'}],
    description: 'Gets the modules that have been imported or that can be imported into the current session.'
  },
  {
    id: 'Import-Module',
    name: 'Import-Module',
    category: 'Module Management',
    parameters: [{name: 'Name'}, {name: 'Assembly'}, {name: 'ModuleInfo'}, {name: 'Global'}, {name: 'Prefix'}, {name: 'Function'}, {name: 'Cmdlet'}, {name: 'Variable'}, {name: 'Alias'}, {name: 'Force'}, {name: 'PassThru'}, {name: 'AsCustomObject'}, {name: 'MinimumVersion'}, {name: 'MaximumVersion'}, {name: 'RequiredVersion'}, {name: 'ArgumentList'}, {name: 'DisableNameChecking'}, {name: 'NoClobber'}, {name: 'Scope'}, {name: 'PSSession'}, {name: 'CimSession'}],
    description: 'Adds modules to the current session.'
  },
  {
    id: 'New-Module',
    name: 'New-Module',
    category: 'Module Management',
    parameters: [{name: 'Name'}, {name: 'ScriptBlock'}, {name: 'Function'}, {name: 'Cmdlet'}, {name: 'ReturnResult'}, {name: 'AsCustomObject'}, {name: 'ArgumentList'}],
    description: 'Creates a new dynamic module that exists only in memory.'
  },
  {
    id: 'New-ModuleManifest',
    name: 'New-ModuleManifest',
    category: 'Module Management',
    parameters: [{name: 'Path'}, {name: 'RootModule'}, {name: 'ModuleVersion'}, {name: 'Author'}, {name: 'Description'}, {name: 'CompanyName'}, {name: 'Copyright'}, {name: 'NestedModules'}, {name: 'Guid'}, {name: 'ProcessorArchitecture'}, {name: 'PowerShellVersion'}, {name: 'ClrVersion'}, {name: 'DotNetFrameworkVersion'}, {name: 'PowerShellHostName'}, {name: 'PowerShellHostVersion'}, {name: 'RequiredModules'}, {name: 'TypesToProcess'}, {name: 'FormatsToProcess'}, {name: 'ScriptsToProcess'}, {name: 'RequiredAssemblies'}, {name: 'FileList'}, {name: 'ModuleList'}, {name: 'FunctionsToExport'}, {name: 'AliasesToExport'}, {name: 'VariablesToExport'}, {name: 'CmdletsToExport'}, {name: 'DscResourcesToExport'}, {name: 'CompatiblePSEditions'}, {name: 'PrivateData'}, {name: 'Tags'}, {name: 'ProjectUri'}, {name: 'LicenseUri'}, {name: 'IconUri'}, {name: 'ReleaseNotes'}, {name: 'HelpInfoUri'}, {name: 'PassThru'}, {name: 'DefaultCommandPrefix'}],
    description: 'Creates a new module manifest (.psd1) file.'
  },
  {
    id: 'Remove-Module',
    name: 'Remove-Module',
    category: 'Module Management',
    parameters: [{name: 'Name'}, {name: 'ModuleInfo'}, {name: 'Force'}, {name: 'FullyQualifiedName'}],
    description: 'Removes modules from the current session.'
  },
  {
    id: 'Test-ModuleManifest',
    name: 'Test-ModuleManifest',
    category: 'Module Management',
    parameters: [{name: 'Path'}],
    description: 'Verifies that a module manifest file accurately describes the contents of a module.'
  },

  // PowerShell Snap-ins (Legacy, but some environments might use them)
  {
    id: 'Add-PSSnapin',
    name: 'Add-PSSnapin',
    category: 'PowerShell Snap-ins',
    parameters: [{name: 'Name'}, {name: 'PassThru'}],
    description: 'Adds one or more Windows PowerShell snap-ins to the current session.'
  },
  {
    id: 'Get-PSSnapin',
    name: 'Get-PSSnapin',
    category: 'PowerShell Snap-ins',
    parameters: [{name: 'Name'}, {name: 'Registered'}],
    description: 'Gets the Windows PowerShell snap-ins on the computer.'
  },
  {
    id: 'Remove-PSSnapin',
    name: 'Remove-PSSnapin',
    category: 'PowerShell Snap-ins',
    parameters: [{name: 'Name'}, {name: 'PassThru'}],
    description: 'Removes Windows PowerShell snap-ins from the current session.'
  },
];

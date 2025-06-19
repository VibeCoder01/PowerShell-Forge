
import type { BasePowerShellCommand } from '@/types/powershell';

export const mockCommands: BasePowerShellCommand[] = [
  {
    id: 'Get-Process',
    name: 'Get-Process',
    parameters: [{ name: 'Name' }, { name: 'Id' }, { name: 'ComputerName' }],
    description: 'Gets the processes that are running on the local computer or a remote computer.',
  },
  {
    id: 'Start-Process',
    name: 'Start-Process',
    parameters: [{ name: 'FilePath' }, { name: 'ArgumentList' }, { name: 'Verb' }, { name: 'WorkingDirectory' }],
    description: 'Starts one or more processes on the local computer.',
  },
  {
    id: 'Stop-Process',
    name: 'Stop-Process',
    parameters: [{ name: 'Name' }, { name: 'Id' }, { name: 'Force' }],
    description: 'Stops one or more running processes.',
  },
  {
    id: 'Get-Service',
    name: 'Get-Service',
    parameters: [{ name: 'Name' }, { name: 'DisplayName' }, { name: 'ComputerName' }],
    description: 'Gets the services on a local or remote computer.',
  },
  {
    id: 'Start-Service',
    name: 'Start-Service',
    parameters: [{ name: 'Name' }, { name: 'DisplayName' }],
    description: 'Starts one or more stopped services.',
  },
  {
    id: 'Stop-Service',
    name: 'Stop-Service',
    parameters: [{ name: 'Name' }, { name: 'DisplayName' }, { name: 'Force' }],
    description: 'Stops one or more running services.',
  },
  {
    id: 'Set-ItemProperty',
    name: 'Set-ItemProperty',
    parameters: [{ name: 'Path' }, { name: 'Name' }, { name: 'Value' }],
    description: 'Creates or changes the value of a property of an item.',
  },
  {
    id: 'New-Item',
    name: 'New-Item',
    parameters: [{ name: 'Path' }, { name: 'Name' }, { name: 'ItemType' }, { name: 'Value' }],
    description: 'Creates a new item.',
  },
  {
    id: 'Remove-Item',
    name: 'Remove-Item',
    parameters: [{ name: 'Path' }, { name: 'Recurse' }, { name: 'Force' }],
    description: 'Deletes items.',
  },
  {
    id: 'Write-Host',
    name: 'Write-Host',
    parameters: [{ name: 'Object' }, { name: 'ForegroundColor' }, { name: 'BackgroundColor' }],
    description: 'Writes customized output to a host.',
  },
  {
    id: 'Get-Content',
    name: 'Get-Content',
    parameters: [{ name: 'Path' }, { name: 'TotalCount' }, {name: 'Raw'}],
    description: 'Gets the content of the item at the specified location.',
  },
  {
    id: 'Set-Content',
    name: 'Set-Content',
    parameters: [{ name: 'Path' }, { name: 'Value' }],
    description: 'Adds to, replaces, or clears content in an item.',
  },
  {
    id: 'Get-ChildItem',
    name: 'Get-ChildItem',
    parameters: [{ name: 'Path' }, { name: 'Recurse' }, { name: 'File' }, { name: 'Directory' }, { name: 'Filter' }],
    description: 'Gets the items and child items in one or more specified locations.',
  },
  {
    id: 'Copy-Item',
    name: 'Copy-Item',
    parameters: [{ name: 'Path' }, { name: 'Destination' }, { name: 'Recurse' }, { name: 'Force' }],
    description: 'Copies an item from one location to another.',
  },
  {
    id: 'Move-Item',
    name: 'Move-Item',
    parameters: [{ name: 'Path' }, { name: 'Destination' }, { name: 'Force' }],
    description: 'Moves an item from one location to another.',
  },
  {
    id: 'Invoke-WebRequest',
    name: 'Invoke-WebRequest',
    parameters: [{ name: 'Uri' }, { name: 'Method' }, { name: 'OutFile' }, { name: 'Body' }, { name: 'Headers' }],
    description: 'Gets content from a web page on the Internet.',
  },
  {
    id: 'Test-Path',
    name: 'Test-Path',
    parameters: [{ name: 'Path' }, { name: 'PathType' }],
    description: 'Determines whether all elements of a path exist.',
  },
  {
    id: 'Start-Sleep',
    name: 'Start-Sleep',
    parameters: [{ name: 'Seconds' }, { name: 'Milliseconds' }],
    description: 'Suspends the activity in a script or session for the specified period of time.',
  },
  {
    id: 'ConvertTo-Json',
    name: 'ConvertTo-Json',
    parameters: [{ name: 'InputObject' }, { name: 'Depth' }, { name: 'Compress' }],
    description: 'Converts an object to a JSON-formatted string.',
  },
  {
    id: 'Export-Csv',
    name: 'Export-Csv',
    parameters: [{ name: 'InputObject' }, { name: 'Path' }, { name: 'NoTypeInformation' }, { name: 'Delimiter' }],
    description: 'Converts objects into a series of comma-separated value (CSV) strings and saves them in a CSV file.',
  },
  {
    id: 'Import-Csv',
    name: 'Import-Csv',
    parameters: [{ name: 'Path' }, { name: 'Delimiter' }, { name: 'Header' }],
    description: 'Creates table-like custom objects from the items in a CSV file.',
  },
];

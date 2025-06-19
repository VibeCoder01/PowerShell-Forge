import type { PowerShellCommand } from '@/types/powershell';

export const mockCommands: PowerShellCommand[] = [
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
];

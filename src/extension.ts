import { commands, ExtensionContext, window, workspace } from 'vscode'
import { execute } from './interface-to-builder'
import { IWindow } from './interfaces/window.interface'
import { getWorkspaceFolder } from './utils/workspace-util'

export const activate = () => {
  const workspaceRoot: string = getWorkspaceFolder(workspace.workspaceFolders)
  commands.registerCommand('extension.interfaceToBuilder', () => {
    execute(workspaceRoot, window as IWindow)
  })
}

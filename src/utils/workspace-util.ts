import { WorkspaceFolder } from 'vscode'
import { IVSCodeWindow } from '../interfaces/vscode.interfaces'

export const getWorkspaceFolder = (
  folders: WorkspaceFolder[] | undefined
): string => {
  if (!folders) {
    return ''
  }

  const folder = folders[0] || {}
  const uri = folder.uri

  return uri.fsPath
}

export const isWorkspaceLoaded = (
  workspaceRoot: string,
  window: IVSCodeWindow
) => {
  if (workspaceRoot === '') {
    window.showErrorMessage(
      'Please open a directory before creating a builder.'
    )
    return false
  }
  return true
}

export const isTextEditorOpen = (window: IVSCodeWindow) => {
  if (!window.activeTextEditor) {
    window.showErrorMessage(
      'No open text editor. Please open an interface file.'
    )
    return false
  }
  return true
}

export const isTextInEditor = (text: string | null, window: IVSCodeWindow) => {
  if (!text) {
    window.showErrorMessage('No text found. Please open an interface file.')
    return false
  }
  return true
}

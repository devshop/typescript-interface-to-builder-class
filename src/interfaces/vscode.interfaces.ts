// creating an interface for the VS Code Extension window namespace so that
// intellisense can be used when the namespace is passed in as an argument
// in the contructor. this makes it easier to mock the window in the tests

import { TextEditor } from 'vscode'

export interface IVSCodeWindow {
  activeTextEditor: TextEditor
  showErrorMessage(message: string): Thenable<string>
  showInformationMessage(message: string): Thenable<string>
}

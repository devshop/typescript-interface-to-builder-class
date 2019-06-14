import * as fs from 'fs'
import * as path from 'path'
// tslint:disable-next-line: no-implicit-dependencies
import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'extension.interfaceToBuilder',
    () => {
      const uppercaseFirstLetter = (s: string) =>
        s.charAt(0).toUpperCase() + s.slice(1)

      const verifyWorkspaceLoaded = () => {
        if (!vscode.workspace.workspaceFolders) {
          vscode.window.showErrorMessage(
            'Please open a directory before creating a builder.'
          )
          return false
        }
        return true
      }

      const verifyTextEditorOpen = () => {
        if (!vscode.window.activeTextEditor) {
          vscode.window.showErrorMessage(
            'No open text editor. Please open an interface file.'
          )
          return false
        }
        return true
      }

      const verifyTextInEditor = (text: string | null) => {
        if (!text) {
          vscode.window.showErrorMessage(
            'No text found. Please open an interface file.'
          )
          return false
        }
        return true
      }

      const verifyInterfaceInText = (text: string) => {
        if (!text.includes('export interface')) {
          vscode.window.showErrorMessage(
            'No interface found. "export interface" must be in your code.'
          )
          return false
        }
        return true
      }

      const getInterfaceName = (text: string) => {
        // Search for the first word after "export interface" to find the name of the interface.
        const interfaceNames = text.match(/(?<=\bexport interface\s)(\w+)/)
        if (!interfaceNames) {
          vscode.window.showErrorMessage('Could not find the interface name.')
          return null
        }
        return interfaceNames[0]
      }

      const getClassName = (text: string) => {
        // Check if the interface name has an "I" at the start. If it does, remove the the "I".
        if (/\b[I]/.test(text)) {
          return text.substring(1)
        }
        return text
      }

      const getInterfaceProperties = (text: string) => {
        // Find all the properties defined in the interface by looking for words before a colon(:)
        const properties = text.match(/(\w*[^\s])(?=:)/gm)
        if (!properties) {
          vscode.window.showErrorMessage(
            'Could not find any properties defined in the interface.'
          )
          return null
        }
        return properties
      }

      const getInterfacePropertyTypes = (text: string) => {
        // Find all the property types defined in the interface by looking for words after a colon(:)
        const types = text.match(/(?<=:\s)(.*)/g)
        if (!types) {
          vscode.window.showErrorMessage(
            'Could not find any property types defined in the interface.'
          )
          return null
        }
        return types
      }

      const saveBuilderFile = (editor: vscode.TextEditor, text: string) => {
        const filePath = editor!.document.uri.fsPath
        const fileName = filePath.match(/[a-z.-]+(?=\.ts)/)![0]
        let folderPath = filePath.substring(0, filePath.lastIndexOf('/'))

        if (!folderPath) {
          folderPath = filePath.substring(0, filePath.lastIndexOf('\\'))
        }

        // Write the file to the current editor directory.
        fs.writeFile(
          path.join(folderPath, `${fileName}.builder.ts`),
          text,
          err => {
            if (err) {
              vscode.window.showErrorMessage(`File save failed: ${err}`)
              return
            }
          }
        )

        vscode.window.showInformationMessage(
          `Builder class saved to: ${path.join(
            folderPath,
            `${fileName}.builder.ts`
          )}`
        )
      }

      const getInitalPropertyValue = (type: string) => {
        switch (type) {
          case 'string[]':
            return `[undefined]`
          case 'number':
            return 1
          default:
            return undefined
        }
      }

      const start = async () => {
        const isWorkspaceLoaded = verifyWorkspaceLoaded()
        if (!isWorkspaceLoaded) {
          return
        }

        const isEditorOpen = verifyTextEditorOpen()
        if (!isEditorOpen) {
          return
        }

        const editor = vscode.window.activeTextEditor
        const text = editor!.document.getText()

        const isTextInEditor = verifyTextInEditor(text)
        if (!isTextInEditor) {
          return
        }

        const isInterfaceInText = verifyInterfaceInText(text)
        if (!isInterfaceInText) {
          return
        }

        const interfaceName = getInterfaceName(text)
        if (!interfaceName) {
          return
        }

        const properties = getInterfaceProperties(text)
        const types = getInterfacePropertyTypes(text)
        if (!properties || !types) {
          return
        }

        const propertyDefinitions: string[] = []
        const propertyLocalAssignments: string[] = []
        const propertyExternalAssignments: string[] = []

        properties.forEach((p, i) => {
          const type = types[i]
          const value = getInitalPropertyValue(type)
          propertyDefinitions.push(`private ${p}: ${type} = ${value}`)
          propertyLocalAssignments.push(`${p}: this.${p}`)
          const propertyExternalAssignment = `public with${uppercaseFirstLetter(
            p
          )}(value: ${type}) {\r\n    this.${p} = value\r\n    return this\r\n  }`
          propertyExternalAssignments.push(propertyExternalAssignment)
        })

        // TODO: Make the indenting prettier.
        const classString = `export class ${getClassName(
          interfaceName
        )}Builder {
  ${propertyDefinitions.join('\r\n  ')}

  public build(): ${interfaceName} {
    return {
      ${propertyLocalAssignments.join(',\r\n      ')}
    }
  }

  ${propertyExternalAssignments.join('\r\n\r\n  ')}
}\r\n`

        saveBuilderFile(editor!, classString)
      }

      start()
    }
  )

  context.subscriptions.push(disposable)
}

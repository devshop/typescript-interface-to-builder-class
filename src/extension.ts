import * as fs from 'fs'
import * as path from 'path'
import * as vscode from 'vscode'

interface IPropertyOutput {
  definitions: string[]
  externalSetters: string[]
  localSetters: string[]
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'extension.interfaceToBuilder',
    () => {
      const b = '\r\n' // line break
      const t = '  ' // tab (indenting)

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
        // Search for the first word after "export interface"
        // to find the name of the interface.
        const interfaceNames = text.match(/(?<=\bexport interface\s)(\w+)/)
        if (!interfaceNames) {
          vscode.window.showErrorMessage('Could not find the interface name.')
          return null
        }
        return interfaceNames[0]
      }

      const getClassName = (text: string) => {
        // Check if the interface name has an "I" at the start
        // If it does, remove the the "I"
        if (/\b[I]/.test(text)) {
          return text.substring(1)
        }
        return text
      }

      // TODO: Add support for optional types
      const getInterfaceProperties = (text: string) => {
        // Find all the properties defined in the interface
        // by looking for words before a colon(:)
        const properties = text.match(/(\w*[^\s])(?=:)/gm)
        if (!properties) {
          vscode.window.showErrorMessage(
            'Could not find any properties defined in the interface.'
          )
          return null
        }
        return properties
      }

      const getInterfaceDatatypes = (text: string) => {
        // Find all the property types defined in the interface
        // by looking for words after a colon(:)
        const datatypes = text.match(/(?<=:\s)(.*)/g)
        if (!datatypes) {
          vscode.window.showErrorMessage(
            'Could not find any datatypes defined in the interface.'
          )
          return null
        }
        return datatypes
      }

      const generatePropertyOutput = (
        properties: string[],
        datatypes: string[]
      ): IPropertyOutput => {
        const output: IPropertyOutput = {
          definitions: [],
          externalSetters: [],
          localSetters: []
        }
        properties.forEach((p, i) => {
          const datatype = datatypes[i]
          const value = getInitalPropertyValue(datatype)
          const className = uppercaseFirstLetter(p)
          output.definitions.push(`private ${p}: ${datatype} = ${value}`)
          // Strip any '?' from optional properties
          p = p.replace('?', '')
          output.localSetters.push(`${p}: this.${p}`)
          let propertyExternalSetter = ''
          propertyExternalSetter += `public with${className}(value: ${datatype}) {${b}`
          propertyExternalSetter += `${t}${t}this.${p} = value${b}`
          propertyExternalSetter += `${t}${t}return this${b}`
          propertyExternalSetter += `${t}}`
          output.externalSetters.push(propertyExternalSetter)
        })
        return output
      }

      const generateClass = (
        interfaceName: string,
        output: IPropertyOutput
      ): string => {
        const className = getClassName(interfaceName)
        const definitions = output.definitions.join(`${b}${t}`)
        const localSetters = output.localSetters.join(`,${b}${t}${t}${t}`)
        const externalSetters = output.externalSetters.join(`${b}${b}${t}`)
        let classString = ''
        classString += `export class ${className}Builder {${b}`
        classString += `${t}${definitions}${b}${b}`
        classString += `${t}public build(): ${interfaceName} {${b}`
        classString += `${t}${t}return {${b}`
        classString += `${t}${t}${t}${localSetters}${b}`
        classString += `${t}${t}}${b}`
        classString += `${t}}${b}${b}`
        classString += `${t}${externalSetters}${b}`
        classString += `}${b}`
        return classString
      }

      const saveBuilderFile = (editor: vscode.TextEditor, text: string) => {
        const filePath = editor!.document.uri.fsPath
        const fileName = filePath.match(/[a-z.-]+(?=\.ts)/)![0]
        let folderPath = filePath.substring(0, filePath.lastIndexOf('/'))
        if (!folderPath) {
          folderPath = filePath.substring(0, filePath.lastIndexOf('\\'))
        }
        // Writes the file to the current editor directory
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

      const getInitalPropertyValue = (datatype: string) => {
        switch (datatype) {
          case 'string':
            return undefined
          case 'number':
            return 1
          case 'boolean':
            return false
          case 'string[]':
            return `[undefined]`
          case 'number[]':
            return `[1]`
          case 'boolean[]':
            return `[false]`
          default:
            return undefined
        }
      }

      const start = () => {
        const isWorkspaceLoaded = verifyWorkspaceLoaded()
        if (!isWorkspaceLoaded) {
          return
        }
        const isEditorOpen = verifyTextEditorOpen()
        if (!isEditorOpen) {
          return
        }
        const editor = vscode.window.activeTextEditor
        if (!editor) {
          return
        }
        const text = editor.document.getText()
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
        const datatypes = getInterfaceDatatypes(text)
        if (!properties || !datatypes) {
          return
        }
        const propertyOutput = generatePropertyOutput(properties, datatypes)
        const classString = generateClass(interfaceName, propertyOutput)
        saveBuilderFile(editor, classString)
      }

      start()
    }
  )

  context.subscriptions.push(disposable)
}

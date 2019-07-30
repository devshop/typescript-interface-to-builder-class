import * as fs from 'fs'
import * as path from 'path'
import * as vscode from 'vscode'
import { IPropertyOutput } from './interfaces/property-output.interface'
import { IVSCodeWindow } from './interfaces/vscode.interfaces'
import {
  getClassName,
  getInitalPropertyValue,
  getInterfaceDatatypes,
  getInterfaceName,
  getInterfaceProperties,
  getLineEndings,
  uppercaseFirstLetter
} from './utils/string-util'
import {
  isTextEditorOpen,
  isTextInEditor,
  isWorkspaceLoaded
} from './utils/workspace-util'

const lineBreak = '\r\n'
const indent = '  ' // (e.g. tab vs spaces)
let lineEnding = '' // line-ending (e.g. semicolon)

export const execute = (workspaceRoot: string, window: IVSCodeWindow) => {
  if (!isWorkspaceLoaded(workspaceRoot, window)) return
  if (!isTextEditorOpen(window)) return
  const editor = window.activeTextEditor
  const text = editor.document.getText()
  if (!isTextInEditor(text, window)) return
  lineEnding = getLineEndings(text)
  const interfaceName = getInterfaceName(text, window)
  if (!interfaceName) return
  const properties = getInterfaceProperties(text, window)
  const datatypes = getInterfaceDatatypes(text, window)
  if (!properties || !datatypes) return
  const propertyOutput = generatePropertyOutput(properties, datatypes)
  const classString = generateClass(interfaceName, propertyOutput)
  saveBuilderFile(window, editor, classString)
}

export const generatePropertyOutput = (
  properties: string[],
  datatypes: string[]
): IPropertyOutput => {
  const output: IPropertyOutput = {
    definitions: [],
    externalSetters: [],
    localSetters: []
  }
  properties.forEach((p, i) => {
    const t = indent
    const b = lineBreak
    const e = lineEnding
    const datatype = datatypes[i]
    const value = getInitalPropertyValue(datatype)
    let className = uppercaseFirstLetter(p)
    className = className.replace('?', '')
    output.definitions.push(`private ${p}: ${datatype} = ${value}${e}`)
    // Strip any '?' from optional properties
    p = p.replace('?', '')
    output.localSetters.push(`${p}: this.${p}`)
    let propertyExternalSetter = ''
    propertyExternalSetter += `public with${className}(value: ${datatype}) {${b}`
    propertyExternalSetter += `${t}${t}this.${p} = value${e}${b}`
    propertyExternalSetter += `${t}${t}return this${e}${b}`
    propertyExternalSetter += `${t}}`
    output.externalSetters.push(propertyExternalSetter)
  })
  return output
}

export const generateClass = (
  interfaceName: string,
  output: IPropertyOutput
): string => {
  const t = indent
  const b = lineBreak
  const e = lineEnding
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
  classString += `${t}${t}}${e}${b}`
  classString += `${t}}${b}${b}`
  classString += `${t}${externalSetters}${b}`
  classString += `}${b}`
  return classString
}

export const saveBuilderFile = (
  window: IVSCodeWindow,
  editor: vscode.TextEditor,
  text: string
) => {
  const filePath = editor!.document.uri.fsPath
  const fileName = filePath.match(/[^\\/]+(?=\.ts)/)![0]
  // Try to match the file naming convention.
  const numOfDots = fileName.split('.').length
  let builder = 'Builder'
  if (numOfDots > 1) {
    builder = '.builder'
  }
  let folderPath = filePath.substring(0, filePath.lastIndexOf('/'))
  if (!folderPath) {
    folderPath = filePath.substring(0, filePath.lastIndexOf('\\'))
  }
  // Writes the file to the current editor directory
  fs.writeFile(path.join(folderPath, `${fileName}${builder}.ts`), text, err => {
    if (err) {
      window.showErrorMessage(`File save failed: ${err}`)
      return
    }
  })
  window.showInformationMessage(
    `Builder class saved to: ${path.join(
      folderPath,
      `${fileName}${builder}.ts`
    )}`
  )
}

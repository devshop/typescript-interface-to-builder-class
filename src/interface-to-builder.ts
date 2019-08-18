import * as fs from 'fs'
import * as path from 'path'
import * as vscode from 'vscode'

import { getClassName, getInterfaceName } from './utils/interface-name-util'
import { getLineEndings, uppercaseFirstLetter } from './utils/string-util'
import {
  isTextEditorOpen,
  isTextInEditor,
  isWorkspaceLoaded
} from './utils/workspace-util'

import { IPropertyOutput } from './interfaces/property-output.interface'
import { IWindow } from './interfaces/window.interface'
import { getInitalPropertyValue } from './utils/initial-property-value-util'
import { getInterfaceDataTypes } from './utils/interface-data-types-util'
import { getInterfaceProperties } from './utils/interface-properties-util'

const lineBreak = '\r\n'
const indent = '  ' // (e.g. tab vs spaces)
let lineEnding = '' // line-ending (e.g. semicolon)

export const execute = (workspaceRoot: string, window: IWindow) => {
  if (!isWorkspaceLoaded(workspaceRoot, window)) return
  if (!isTextEditorOpen(window)) return
  const editor = window.activeTextEditor
  const text = editor.document.getText()
  if (!isTextInEditor(text, window)) return
  if (text.includes('(')) {
    window.showErrorMessage(
      'Methods defined in interfaces are not currently supported.'
    )
    return
  }
  lineEnding = getLineEndings(text)
  const interfaceName = getInterfaceName(text, window)
  if (!interfaceName) return
  const properties = getInterfaceProperties(text, window)
  const dataTypes = getInterfaceDataTypes(text, window)
  if (!properties || !dataTypes) return
  const propertyOutput = generatePropertyOutput(properties, dataTypes)
  const classString = generateClass(interfaceName, propertyOutput)
  saveBuilderFile(window, editor, classString)
}

export const generatePropertyOutput = (
  properties: string[],
  dataTypes: string[]
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
    const dataType = dataTypes[i]
    const value = getInitalPropertyValue(dataType)
    let className = uppercaseFirstLetter(p)
    className = className.replace('?', '')
    output.definitions.push(`private ${p}: ${dataType} = ${value}${e}`)
    // Strip any '?' from optional properties
    p = p.replace('?', '')
    output.localSetters.push(`${p}: this.${p}`)
    let propertyExternalSetter = ''
    propertyExternalSetter += `public with${className}(value: ${dataType}) {${b}`
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
  window: IWindow,
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

  // Writes the file to the current editor directory
  try {
    let folderPath = filePath.substring(0, filePath.lastIndexOf('/'))
    if (!folderPath) {
      folderPath = filePath.substring(0, filePath.lastIndexOf('\\'))
    }
    fs.writeFileSync(path.join(folderPath, `${fileName}${builder}.ts`), text)
    window.showInformationMessage(
      `Builder class saved to: ${path.join(
        folderPath,
        `${fileName}${builder}.ts`
      )}`
    )
  } catch (err) {
    window.showErrorMessage(`File save failed: ${err}`)
  }
}

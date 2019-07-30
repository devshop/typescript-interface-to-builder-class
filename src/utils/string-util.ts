import { IVSCodeWindow } from '../interfaces/vscode.interfaces'

export const uppercaseFirstLetter = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1)

export const getLineEndings = (text: string) => {
  const semicolon = text.includes(';')
  if (semicolon) {
    return ';'
  } else {
    return ''
  }
}

export const getInterfaceName = (text: string, window: IVSCodeWindow) => {
  // Search for the first word after "export interface"
  // to find the name of the interface.
  const interfaceNames = text.match(/(?<=\bexport interface\s)(\w+)/)
  if (!interfaceNames) {
    window.showErrorMessage('Could not find the interface name.')
    return null
  }
  return interfaceNames[0]
}

export const getClassName = (text: string) => {
  // Check if the interface name has an "I" at the start
  // If it does, remove the the "I"
  if (/\b[I]/.test(text)) {
    return text.substring(1)
  }
  return text
}

export const getInterfaceProperties = (text: string, window: IVSCodeWindow) => {
  // Find all the properties defined in the interface
  // by looking for words before a colon(:)
  const properties = text.match(/(\w*[^\s])(?=:)/gm)
  if (!properties) {
    window.showErrorMessage(
      'Could not find any properties defined in the interface.'
    )
    return null
  }
  return properties
}

export const getInterfaceDatatypes = (text: string, window: IVSCodeWindow) => {
  // Find all the property types defined in the interface
  // by looking for words after a colon(:)
  const datatypes = text.match(/(?<=:\s)([^\n\r;]+)/g)
  if (!datatypes) {
    window.showErrorMessage(
      'Could not find any datatypes defined in the interface.'
    )
    return null
  }
  return datatypes
}

export const getInitalPropertyValue = (datatype: string) => {
  if (datatype.includes('[]')) {
    return '[]'
  }

  switch (datatype) {
    case 'string':
      return undefined
    case 'number':
      return 1
    case 'boolean':
      return false
    default:
      return undefined
  }
}

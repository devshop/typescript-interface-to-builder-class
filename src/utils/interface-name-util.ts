import { IWindow } from '../interfaces/window.interface'

/**
 * Extracts the name of the inferface.
 *
 * @param text      The interface text
 * @param window    The VSCode Window
 */
export const getInterfaceName = (text: string, window: IWindow) => {
  // Search for the first word after "export interface"
  // to find the name of the interface.
  const interfaceNames = text.match(/(?<=\bexport interface\s)(\w+)/)
  if (!interfaceNames) {
    window.showErrorMessage('Could not find the interface name.')
    return null
  }
  return interfaceNames[0]
}

/**
 * Converts the interface name into a class name.
 *
 * @param text The name of the interface
 */
export const getClassName = (text: string) => {
  // Check if the interface name has an "I" at the start. If it does, remove the the "I".
  if (/\b[I]/.test(text)) {
    return text.substring(1)
  }
  return text
}

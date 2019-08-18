import { IWindow } from '../interfaces/window.interface'

/**
 * Extracts the property data types that are defined in the interface.
 *
 * @param text      The interface text
 * @param window    The VSCode Window
 */
export const getInterfaceDataTypes = (text: string, window: IWindow) => {
  // Find all the property types defined in the interface
  // by looking for words after a colon(:)
  const dataTypes = text.match(/(?<=:\s)([^\n\r;]+)/g)
  if (!dataTypes) {
    window.showErrorMessage(
      'Could not find any data types defined in the interface.'
    )
    return null
  }
  return dataTypes
}

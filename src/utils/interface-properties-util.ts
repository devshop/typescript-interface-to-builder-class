import { IWindow } from '../interfaces/window.interface'

/**
 * Extracts the properties that are defined in the interface.
 *
 * @param text      The interface text
 * @param window    The VSCode Window
 */
export const getInterfaceProperties = (text: string, window: IWindow) => {
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

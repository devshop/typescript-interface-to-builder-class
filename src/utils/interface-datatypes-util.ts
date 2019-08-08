import { IWindow } from '../interfaces/window.interface'

/**
 * Extracts the property datatypes that are defined in the interface.
 *
 * @param text      The interface text
 * @param window    The VSCode Window
 */
export const getInterfaceDatatypes = (text: string, window: IWindow) => {
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

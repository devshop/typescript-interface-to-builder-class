/**
 * Determines the default value to set the builder property to, based on the provided interface datatype.
 *
 * @param datatype The datatype of the property (e.g. number)
 */
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

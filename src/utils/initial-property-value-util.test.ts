import { getInitalPropertyValue } from './initial-property-value-util'

describe('Initial Property Value Util', () => {
  it('should return the inital property value of `[]` when the data type is an array', () => {
    // Arrange
    const dataType = 'string[]'
    const expectedValue = '[]'

    // Act
    const value = getInitalPropertyValue(dataType)

    // Assert
    expect(value).toBe(expectedValue)
  })

  it('should return the inital property value of `undefined` when the data type is a string', () => {
    // Arrange
    const dataType = 'string'
    const expectedValue = undefined

    // Act
    const value = getInitalPropertyValue(dataType)

    // Assert
    expect(value).toBe(expectedValue)
  })

  it('should return the inital property value of `1` when the data type is a number', () => {
    // Arrange
    const dataType = 'number'
    const expectedValue = 1

    // Act
    const value = getInitalPropertyValue(dataType)

    // Assert
    expect(value).toBe(expectedValue)
  })

  it('should return the inital property value of `false` when the data type is a boolean', () => {
    // Arrange
    const dataType = 'boolean'
    const expectedValue = false

    // Act
    const value = getInitalPropertyValue(dataType)

    // Assert
    expect(value).toBe(expectedValue)
  })

  it('should return the inital property value of `undefined` when the data type is a unknown', () => {
    // Arrange
    const dataType = 'foo'
    const expectedValue = undefined

    // Act
    const value = getInitalPropertyValue(dataType)

    // Assert
    expect(value).toBe(expectedValue)
  })
})

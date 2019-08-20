import { getInterfaceDataTypes } from './interface-data-types-util'

describe('Interface Datatypes Util', () => {
  it('should return null and an error message if no data types are found in the file', () => {
    // Arrange
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    const text = `export interface ITest {}`
    const expectedDataTypes = null

    // Act
    const dataTypes = getInterfaceDataTypes(text, windowMock as any)

    // Assert
    expect(dataTypes).toBe(expectedDataTypes)
    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'Could not find any data types defined in the interface.'
    )
  })

  it('should return a list of data types and no error message if data types are found in the file', () => {
    // Arrange
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    const text = `export interface ITest {
      foo: string
      bar: number
    }`
    const expectedDataTypes = ['string', 'number']

    // Act
    const dataTypes = getInterfaceDataTypes(text, windowMock as any)

    // Assert
    expect(dataTypes).toEqual(expectedDataTypes)
    expect(windowMock.showErrorMessage).not.toHaveBeenCalled()
  })
})

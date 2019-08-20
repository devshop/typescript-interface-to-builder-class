import { getClassName, getInterfaceName } from './interface-name-util'

describe('Interface Name Util', () => {
  it('should return the name of the interface in the file', () => {
    // Arrange
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    const text = `export interface ITest {
      foo: string
    }`
    const expectedName = 'ITest'

    // Act
    const name = getInterfaceName(text, windowMock as any)

    // Assert
    expect(name).toBe(expectedName)
    expect(windowMock.showErrorMessage).not.toHaveBeenCalled()
  })

  it('should return null and an error message if the interface name in the file is not found', () => {
    // Arrange
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    const text = 'foo bar'
    const expectedName = null

    // Act
    const name = getInterfaceName(text, windowMock as any)

    // Assert
    expect(name).toBe(expectedName)
    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'Could not find the interface name.'
    )
  })

  it('should return a classname by removing the `I` from the interface name if one is defined', () => {
    // Arrange
    const text = 'IFoo'
    const expectedName = 'Foo'

    // Act
    const name = getClassName('IFoo')

    // Assert
    expect(name).toBe(expectedName)
  })

  it('should return a classname from the interface name when the interface name does not include an `I`', () => {
    // Arrange
    const text = 'Foo'
    const expectedName = 'Foo'

    // Act
    const name = getClassName(text)

    // Assert
    expect(name).toBe(expectedName)
  })
})

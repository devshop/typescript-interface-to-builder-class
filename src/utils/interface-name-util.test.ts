import { getClassName, getInterfaceName } from './interface-name-util'

describe('Interface Name Util', () => {
  it('should return the name of the interface in the file', () => {
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    const name = getInterfaceName(
      `export interface ITest {
        foo: string
      }`,
      windowMock as any
    )
    expect(name).toBe('ITest')
    expect(windowMock.showErrorMessage).not.toHaveBeenCalled()
  })

  it('should return null and an error message if the interface name in the file is not found', () => {
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    const name = getInterfaceName('foo bar', windowMock as any)
    expect(name).toBe(null)
    expect(windowMock.showErrorMessage).toHaveBeenCalled()
  })

  it('should return a classname by removing the `I` from the interface name if one is defined', () => {
    const name = getClassName('IFoo')
    expect(name).toBe('Foo')
  })

  it('should return a classname from the interface name when the interface name does not include an `I`', () => {
    const name = getClassName('Foo')
    expect(name).toBe('Foo')
  })
})

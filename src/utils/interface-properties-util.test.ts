import { getInterfaceProperties } from './interface-properties-util'

describe('Interface Properties Util', () => {
  it('should return null and an error message if no properties are found in the file', () => {
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    const properties = getInterfaceProperties('foo bar', windowMock as any)
    expect(properties).toBe(null)
    expect(windowMock.showErrorMessage).toHaveBeenCalled()
  })

  it('should return a list of properties and no error message if properties are found in the file', () => {
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    const properties = getInterfaceProperties(
      `export interface ITest {
        foo: string
        bar: number
      }`,
      windowMock as any
    )
    expect(properties).toEqual(['foo', 'bar'])
    expect(windowMock.showErrorMessage).not.toHaveBeenCalled()
  })
})

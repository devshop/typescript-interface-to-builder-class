import { getInterfaceDataTypes } from './interface-data-types-util'

describe('Interface Datatypes Util', () => {
  it('should return null and an error message if no data types are found in the file', () => {
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    const dataTypes = getInterfaceDataTypes(
      `export interface ITest {}`,
      windowMock as any
    )
    expect(dataTypes).toBe(null)
    expect(windowMock.showErrorMessage).toHaveBeenCalled()
  })

  it('should return a list of data types and no error message if data types are found in the file', () => {
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    const dataTypes = getInterfaceDataTypes(
      `export interface ITest {
        foo: string
        bar: number
      }`,
      windowMock as any
    )
    expect(dataTypes).toEqual(['string', 'number'])
    expect(windowMock.showErrorMessage).not.toHaveBeenCalled()
  })
})

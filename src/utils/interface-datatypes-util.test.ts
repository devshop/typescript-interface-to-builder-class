import { getInterfaceDatatypes } from './interface-datatypes-util'

describe('Interface Datatypes Util', () => {
  it('should return null and an error message if no datatypes are found in the file', () => {
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    const datatypes = getInterfaceDatatypes(
      `export interface ITest {}`,
      windowMock as any
    )
    expect(datatypes).toBe(null)
    expect(windowMock.showErrorMessage).toHaveBeenCalled()
  })

  it('should return a list of datatypes and no error message if datatypes are found in the file', () => {
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    const datatypes = getInterfaceDatatypes(
      `export interface ITest {
        foo: string
        bar: number
      }`,
      windowMock as any
    )
    expect(datatypes).toEqual(['string', 'number'])
    expect(windowMock.showErrorMessage).not.toHaveBeenCalled()
  })
})

import {
  getClassName,
  getInitalPropertyValue,
  getInterfaceDatatypes,
  getInterfaceName,
  getInterfaceProperties,
  getLineEndings,
  uppercaseFirstLetter
} from './string-util'

describe('String Util', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should uppercase the first letter of a word', () => {
    const word = uppercaseFirstLetter('fooBar')
    expect(word).toBe('FooBar')
  })

  it('should determine the line ending used in the file when no semicolons are present', () => {
    const endings = getLineEndings(
      `export interface ITest {
        foo: string
      }`
    )
    expect(endings).toBe('')
  })

  it('should determine the line ending used in the file when semicolons are present', () => {
    const endings = getLineEndings(
      `export interface ITest {
        foo: string;
      }`
    )
    expect(endings).toBe(';')
  })

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

  it('should return a classname from the interface name', () => {
    const name = getClassName('Foo')
    expect(name).toBe('Foo')
  })

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

  it('should return the inital property value of `[]` when the datatype is an array', () => {
    expect(getInitalPropertyValue('string[]')).toBe('[]')
  })

  it('should return the inital property value of `undefined` when the datatype is a string', () => {
    expect(getInitalPropertyValue('string')).toBe(undefined)
  })

  it('should return the inital property value of `1` when the datatype is a number', () => {
    expect(getInitalPropertyValue('number')).toBe(1)
  })

  it('should return the inital property value of `false` when the datatype is a boolean', () => {
    expect(getInitalPropertyValue('boolean')).toBe(false)
  })

  it('should return the inital property value of `undefined` when the datatype is a unknown', () => {
    expect(getInitalPropertyValue('foo')).toBe(undefined)
  })
})

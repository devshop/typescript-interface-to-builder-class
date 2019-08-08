import { getInitalPropertyValue } from './initial-property-value-util'

describe('Initial Property Value Util', () => {
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

import { getLineEndings, uppercaseFirstLetter } from './string-util'

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
})

import { getLineEndings, uppercaseFirstLetter } from './string-util'

describe('String Util', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should uppercase the first letter of a string', () => {
    // Arrange
    const str = 'fooBar'
    const expectedOutput = 'FooBar'

    // Act
    const output = uppercaseFirstLetter(str)

    // Assert
    expect(output).toBe(expectedOutput)
  })

  it('should determine the line ending used in the file when no semicolons are present', () => {
    // Arrange
    const text = `export interface ITest {
      foo: string
    }`
    const expectedEndings = ''

    // Act
    const endings = getLineEndings(text)

    // Assert
    expect(endings).toBe(expectedEndings)
  })

  it('should determine the line ending used in the file when semicolons are present', () => {
    // Arrange
    const text = `export interface ITest {
      foo: string;
    }`
    const expectedEndings = ';'

    // Act
    const endings = getLineEndings(text)

    // Assert
    expect(endings).toBe(expectedEndings)
  })
})

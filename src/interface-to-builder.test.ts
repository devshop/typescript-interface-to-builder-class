import * as fs from 'fs'
import * as interfaceToBuilder from './interface-to-builder'

import { IPropertyOutput } from './interfaces/property-output.interface'
import { PropertyOutputBuilder } from './interfaces/property-output.interface.builder'

jest.mock('fs')

describe('Interface To Builder', () => {
  const testRootLinux = 'fake/path/to/test'
  const testRootWindows = 'fake\\path\\to\\test'

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should stop execution if workspace is not loaded', () => {
    // Arrange
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    jest.spyOn(interfaceToBuilder, 'generatePropertyOutput')
    jest.spyOn(interfaceToBuilder, 'generateClass')
    jest.spyOn(interfaceToBuilder, 'saveBuilderFile')

    // Act
    interfaceToBuilder.execute('', windowMock as any)

    // Assert
    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'Please open a directory before creating a builder.'
    )
    expect(interfaceToBuilder.generatePropertyOutput).not.toHaveBeenCalled()
    expect(interfaceToBuilder.generateClass).not.toHaveBeenCalled()
    expect(interfaceToBuilder.saveBuilderFile).not.toHaveBeenCalled()
  })

  it('should stop execution if text editor is not open', () => {
    // Arrange
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    jest.mock('./utils/workspace-util', () => ({
      isTextEditorOpen: jest.fn().mockReturnValue(false)
    }))
    jest.spyOn(interfaceToBuilder, 'generatePropertyOutput')
    jest.spyOn(interfaceToBuilder, 'generateClass')
    jest.spyOn(interfaceToBuilder, 'saveBuilderFile')

    // Act
    interfaceToBuilder.execute(testRootLinux, windowMock as any)

    // Assert
    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'No open text editor. Please open an interface file.'
    )
    expect(interfaceToBuilder.generatePropertyOutput).not.toHaveBeenCalled()
    expect(interfaceToBuilder.generateClass).not.toHaveBeenCalled()
    expect(interfaceToBuilder.saveBuilderFile).not.toHaveBeenCalled()
  })

  it('should stop execution if no text is not found in the active text editor', () => {
    // Arrange
    const windowMock = {
      activeTextEditor: {
        document: {
          getText: jest.fn().mockReturnValue('')
        }
      },
      showErrorMessage: jest.fn()
    }
    jest.mock('./utils/workspace-util', () => ({
      isTextEditorOpen: jest.fn().mockReturnValue(true)
    }))
    jest.mock('./utils/string-util', () => ({
      isTextInEditor: jest.fn().mockReturnValue(true)
    }))
    jest.spyOn(interfaceToBuilder, 'generatePropertyOutput')
    jest.spyOn(interfaceToBuilder, 'generateClass')
    jest.spyOn(interfaceToBuilder, 'saveBuilderFile')

    // Act
    interfaceToBuilder.execute(testRootLinux, windowMock as any)

    // Assert
    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'No text found. Please open an interface file.'
    )
    expect(interfaceToBuilder.generatePropertyOutput).not.toHaveBeenCalled()
    expect(interfaceToBuilder.generateClass).not.toHaveBeenCalled()
    expect(interfaceToBuilder.saveBuilderFile).not.toHaveBeenCalled()
  })

  it('should stop execution if a method is found in the active text editor', () => {
    // Arrange
    const windowMock = {
      activeTextEditor: {
        document: {
          getText: jest
            .fn()
            .mockReturnValue(
              'export interface ITest { foo(bar: string): string }'
            )
        }
      },
      showErrorMessage: jest.fn()
    }
    jest.mock('./utils/workspace-util', () => ({
      isTextEditorOpen: jest.fn().mockReturnValue(true)
    }))
    jest.mock('./utils/string-util', () => ({
      isTextInEditor: jest.fn().mockReturnValue(true)
    }))
    jest.spyOn(interfaceToBuilder, 'generatePropertyOutput')
    jest.spyOn(interfaceToBuilder, 'generateClass')
    jest.spyOn(interfaceToBuilder, 'saveBuilderFile')

    // Act
    interfaceToBuilder.execute(testRootLinux, windowMock as any)

    // Assert
    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'Methods defined in interfaces are not currently supported.'
    )
    expect(interfaceToBuilder.generatePropertyOutput).not.toHaveBeenCalled()
    expect(interfaceToBuilder.generateClass).not.toHaveBeenCalled()
    expect(interfaceToBuilder.saveBuilderFile).not.toHaveBeenCalled()
  })

  it('should stop execution if no interface name is found in the active text editor', () => {
    // Arrange
    const windowMock = {
      activeTextEditor: {
        document: {
          getText: jest.fn().mockReturnValue('foo')
        }
      },
      showErrorMessage: jest.fn()
    }
    jest.mock('./utils/workspace-util', () => ({
      isTextEditorOpen: jest.fn().mockReturnValue(true)
    }))
    jest.mock('./utils/string-util', () => ({
      isTextInEditor: jest.fn().mockReturnValue(true)
    }))
    jest.spyOn(interfaceToBuilder, 'generatePropertyOutput')
    jest.spyOn(interfaceToBuilder, 'generateClass')
    jest.spyOn(interfaceToBuilder, 'saveBuilderFile')

    // Act
    interfaceToBuilder.execute(testRootLinux, windowMock as any)

    // Assert
    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'Could not find the interface name.'
    )
    expect(interfaceToBuilder.generatePropertyOutput).not.toHaveBeenCalled()
    expect(interfaceToBuilder.generateClass).not.toHaveBeenCalled()
    expect(interfaceToBuilder.saveBuilderFile).not.toHaveBeenCalled()
  })

  it('should stop execution if no properties are found in the active text editor', () => {
    // Arrange
    const windowMock = {
      activeTextEditor: {
        document: {
          getText: jest.fn().mockReturnValue('export interface ITest {}')
        }
      },
      showErrorMessage: jest.fn()
    }
    jest.mock('./utils/workspace-util', () => ({
      isTextEditorOpen: jest.fn().mockReturnValue(true)
    }))
    jest.mock('./utils/string-util', () => ({
      isTextInEditor: jest.fn().mockReturnValue(true)
    }))
    jest.spyOn(interfaceToBuilder, 'generatePropertyOutput')
    jest.spyOn(interfaceToBuilder, 'generateClass')
    jest.spyOn(interfaceToBuilder, 'saveBuilderFile')

    // Act
    interfaceToBuilder.execute(testRootLinux, windowMock as any)

    // Assert
    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'Could not find any properties defined in the interface.'
    )
    expect(interfaceToBuilder.generatePropertyOutput).not.toHaveBeenCalled()
    expect(interfaceToBuilder.generateClass).not.toHaveBeenCalled()
    expect(interfaceToBuilder.saveBuilderFile).not.toHaveBeenCalled()
  })

  it('should continue execution if all checks are okay', () => {
    // Arrange
    const windowMock = {
      activeTextEditor: {
        document: {
          getText: jest
            .fn()
            .mockReturnValue('export interface ITest { foo: string }'),
          uri: {
            fsPath: `${testRootLinux}/bar.ts`
          }
        }
      },
      showErrorMessage: jest.fn(),
      showInformationMessage: jest.fn()
    }
    jest.mock('./utils/workspace-util', () => ({
      isTextEditorOpen: jest.fn().mockReturnValue(true)
    }))
    jest.mock('./utils/string-util', () => ({
      isTextInEditor: jest.fn().mockReturnValue(true)
    }))
    jest.spyOn(interfaceToBuilder, 'generatePropertyOutput')
    jest.spyOn(interfaceToBuilder, 'generateClass')
    jest.spyOn(interfaceToBuilder, 'saveBuilderFile')

    // Act
    interfaceToBuilder.execute(testRootLinux, windowMock as any)

    // Assert
    expect(windowMock.showErrorMessage).not.toHaveBeenCalled()
    expect(windowMock.showInformationMessage).toHaveBeenCalled()
    expect(interfaceToBuilder.generatePropertyOutput).toHaveBeenCalled()
    expect(interfaceToBuilder.generateClass).toHaveBeenCalled()
    expect(interfaceToBuilder.saveBuilderFile).toHaveBeenCalled()
  })

  it('should save the file with `.builder` if a `.` is found in the filename', () => {
    // Arrange
    const windowMock = {
      activeTextEditor: {
        document: {
          getText: jest
            .fn()
            .mockReturnValue('export interface ITest { foo: string }'),
          uri: {
            fsPath: `${testRootLinux}/bar.interface.ts`
          }
        }
      },
      showErrorMessage: jest.fn(),
      showInformationMessage: jest.fn()
    }
    jest.spyOn(interfaceToBuilder, 'generatePropertyOutput')
    jest.spyOn(interfaceToBuilder, 'generateClass')
    jest.spyOn(interfaceToBuilder, 'saveBuilderFile')

    // Act
    interfaceToBuilder.execute(testRootLinux, windowMock as any)

    // Assert
    expect(windowMock.showErrorMessage).not.toHaveBeenCalled()
    expect(windowMock.showInformationMessage).toHaveBeenCalled()
    expect(interfaceToBuilder.generatePropertyOutput).toHaveBeenCalled()
    expect(interfaceToBuilder.generateClass).toHaveBeenCalled()
    expect(interfaceToBuilder.saveBuilderFile).toHaveBeenCalled()
  })

  it('should generate the property output text', () => {
    // Arrange
    const propertyOutput: IPropertyOutput = new PropertyOutputBuilder()
      .withDefinitions(['private firstName: string = undefined'])
      .withExternalSetters([
        `public withFirstName(value: string) {
          this.firstName = value
          return this
        }`
      ])
      .withLocalSetters(['firstName: this.firstName'])
      .build()

    // Act
    const output = interfaceToBuilder.generatePropertyOutput(
      ['firstName'],
      ['string']
    )

    // Assert
    expect(output.definitions[0].replace(/\s+/g, '')).toEqual(
      propertyOutput.definitions[0].replace(/\s+/g, '')
    )
    expect(output.externalSetters[0].replace(/\s+/g, '')).toEqual(
      propertyOutput.externalSetters[0].replace(/\s+/g, '')
    )
    expect(output.localSetters[0].replace(/\s+/g, '')).toEqual(
      propertyOutput.localSetters[0].replace(/\s+/g, '')
    )
  })

  it('should generate the class text', () => {
    // Arrange
    const propertyOutput: IPropertyOutput = new PropertyOutputBuilder()
      .withDefinitions([
        'private firstName: string = undefined',
        'private lastName: string = undefined',
        'private age: number = 1'
      ])
      .withExternalSetters([
        `public withFirstName(value: string) {
          this.firstName = value
          return this
        }`,
        `public withLastName(value: string) {
          this.lastName = value
          return this
        }`,
        `public withAge(value: number) {
          this.age = value
          return this
        }`
      ])
      .withLocalSetters([
        'firstName: this.firstName',
        'lastName: this.lastName',
        'age: this.age'
      ])
      .build()

    // Act
    const classString = interfaceToBuilder.generateClass('Foo', propertyOutput)

    // Assert
    expect(classString.replace(/\s+/g, '')).toBe(
      `export class FooBuilder {
        private firstName: string = undefined
        private lastName: string = undefined
        private age: number = 1

        public build(): Foo {
          return {
            firstName: this.firstName,
            lastName: this.lastName,
            age: this.age
          }
        }

        public withFirstName(value: string) {
          this.firstName = value
          return this
        }

        public withLastName(value: string) {
          this.lastName = value
          return this
        }

        public withAge(value: number) {
          this.age = value
          return this
        }
      }`.replace(/\s+/g, '')
    )
  })

  it('should save the builder file in linux os', () => {
    // Arrange
    const windowMock = {
      activeTextEditor: {
        document: {
          getText: jest
            .fn()
            .mockReturnValue('export interface ITest { foo: string }'),
          uri: {
            fsPath: `${testRootLinux}/bar.interface.ts`
          }
        }
      },
      showErrorMessage: jest.fn(),
      showInformationMessage: jest.fn()
    }

    // Act
    interfaceToBuilder.saveBuilderFile(
      windowMock as any,
      windowMock.activeTextEditor as any,
      'foo'
    )

    // Assert
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
    expect(windowMock.showErrorMessage).not.toHaveBeenCalled()
    expect(windowMock.showInformationMessage).toHaveBeenCalled()
  })

  it('should save the builder file in windows os', () => {
    // Arrange
    const windowMock = {
      activeTextEditor: {
        document: {
          getText: jest
            .fn()
            .mockReturnValue('export interface ITest { foo: string }'),
          uri: {
            fsPath: `${testRootWindows}\\bar.interface.ts`
          }
        }
      },
      showErrorMessage: jest.fn(),
      showInformationMessage: jest.fn()
    }

    // Act
    interfaceToBuilder.saveBuilderFile(
      windowMock as any,
      windowMock.activeTextEditor as any,
      'foo'
    )

    // Assert
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
    expect(windowMock.showErrorMessage).not.toHaveBeenCalled()
    expect(windowMock.showInformationMessage).toHaveBeenCalled()
  })

  it('should show error message when saving file fails', () => {
    // Arrange
    const windowMock = {
        activeTextEditor: {
          document: {
            getText: jest
              .fn()
              .mockReturnValue('export interface ITest { foo: string }'),
            uri: {
              fsPath: `${testRootLinux}/bar.interface.ts`
            }
          }
        },
        showErrorMessage: jest.fn(),
        showInformationMessage: jest.fn()
      }
      // tslint:disable-next-line: variable-name
    ;(fs.writeFileSync as any).mockImplementation(() => {
      throw new Error('Some error')
    })

    // Act
    interfaceToBuilder.saveBuilderFile(
      windowMock as any,
      windowMock.activeTextEditor as any,
      'foo'
    )

    // Assert
    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'File save failed: Error: Some error'
    )
    expect(windowMock.showInformationMessage).not.toHaveBeenCalled()
  })
})

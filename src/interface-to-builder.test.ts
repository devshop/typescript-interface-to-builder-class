import * as interfaceToBuilder from './interface-to-builder'

describe('Interface To Builder', () => {
  const testRoot = 'fake/path/to/test'

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should stop execution if workspace is not loaded', () => {
    const windowMock = {
      showErrorMessage: jest.fn()
    }

    jest.spyOn(interfaceToBuilder, 'generatePropertyOutput')
    jest.spyOn(interfaceToBuilder, 'generateClass')
    jest.spyOn(interfaceToBuilder, 'saveBuilderFile')

    interfaceToBuilder.execute('', windowMock as any)

    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'Please open a directory before creating a builder.'
    )
    expect(interfaceToBuilder.generatePropertyOutput).not.toHaveBeenCalled()
    expect(interfaceToBuilder.generateClass).not.toHaveBeenCalled()
    expect(interfaceToBuilder.saveBuilderFile).not.toHaveBeenCalled()
  })

  it('should stop execution if text editor is not open', () => {
    const windowMock = {
      showErrorMessage: jest.fn()
    }

    jest.mock('./utils/workspace-util', () => ({
      isTextEditorOpen: jest.fn().mockReturnValue(false)
    }))

    jest.spyOn(interfaceToBuilder, 'generatePropertyOutput')
    jest.spyOn(interfaceToBuilder, 'generateClass')
    jest.spyOn(interfaceToBuilder, 'saveBuilderFile')

    interfaceToBuilder.execute(testRoot, windowMock as any)

    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'No open text editor. Please open an interface file.'
    )
    expect(interfaceToBuilder.generatePropertyOutput).not.toHaveBeenCalled()
    expect(interfaceToBuilder.generateClass).not.toHaveBeenCalled()
    expect(interfaceToBuilder.saveBuilderFile).not.toHaveBeenCalled()
  })

  it('should stop execution if no text is not found in the active text editor', () => {
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

    interfaceToBuilder.execute(testRoot, windowMock as any)

    expect(windowMock.showErrorMessage).toHaveBeenCalled()
    expect(interfaceToBuilder.generatePropertyOutput).not.toHaveBeenCalled()
    expect(interfaceToBuilder.generateClass).not.toHaveBeenCalled()
    expect(interfaceToBuilder.saveBuilderFile).not.toHaveBeenCalled()
  })

  it('should stop execution if no interface name is found in the active text editor', () => {
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

    interfaceToBuilder.execute(testRoot, windowMock as any)

    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'Could not find the interface name.'
    )
    expect(interfaceToBuilder.generatePropertyOutput).not.toHaveBeenCalled()
    expect(interfaceToBuilder.generateClass).not.toHaveBeenCalled()
    expect(interfaceToBuilder.saveBuilderFile).not.toHaveBeenCalled()
  })

  it('should stop execution if no properties are found in the active text editor', () => {
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

    interfaceToBuilder.execute(testRoot, windowMock as any)

    expect(windowMock.showErrorMessage).toHaveBeenCalled()
    expect(interfaceToBuilder.generatePropertyOutput).not.toHaveBeenCalled()
    expect(interfaceToBuilder.generateClass).not.toHaveBeenCalled()
    expect(interfaceToBuilder.saveBuilderFile).not.toHaveBeenCalled()
  })

  it('should continue execution if all checks are okay', () => {
    const windowMock = {
      activeTextEditor: {
        document: {
          getText: jest
            .fn()
            .mockReturnValue('export interface ITest { foo: string }'),
          uri: {
            fsPath: `${testRoot}/bar.ts`
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

    interfaceToBuilder.execute(testRoot, windowMock as any)

    expect(windowMock.showErrorMessage).not.toHaveBeenCalled()
    expect(windowMock.showInformationMessage).toHaveBeenCalled()
    expect(interfaceToBuilder.generatePropertyOutput).toHaveBeenCalled()
    expect(interfaceToBuilder.generateClass).toHaveBeenCalled()
    expect(interfaceToBuilder.saveBuilderFile).toHaveBeenCalled()
  })

  it('should stop execution if no properties are found in the active text editor', () => {
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

    interfaceToBuilder.execute(testRoot, windowMock as any)

    expect(windowMock.showErrorMessage).toHaveBeenCalled()
    expect(interfaceToBuilder.generatePropertyOutput).not.toHaveBeenCalled()
    expect(interfaceToBuilder.generateClass).not.toHaveBeenCalled()
    expect(interfaceToBuilder.saveBuilderFile).not.toHaveBeenCalled()
  })

  it('should save the file with `.builder` if a `.` is found in the filename', () => {
    const windowMock = {
      activeTextEditor: {
        document: {
          getText: jest
            .fn()
            .mockReturnValue('export interface ITest { foo: string }'),
          uri: {
            fsPath: `${testRoot}/bar.interface.ts`
          }
        }
      },
      showErrorMessage: jest.fn(),
      showInformationMessage: jest.fn()
    }

    jest.spyOn(interfaceToBuilder, 'generatePropertyOutput')
    jest.spyOn(interfaceToBuilder, 'generateClass')
    jest.spyOn(interfaceToBuilder, 'saveBuilderFile')

    interfaceToBuilder.execute(testRoot, windowMock as any)

    expect(windowMock.showErrorMessage).not.toHaveBeenCalled()
    expect(windowMock.showInformationMessage).toHaveBeenCalled()
    expect(interfaceToBuilder.generatePropertyOutput).toHaveBeenCalled()
    expect(interfaceToBuilder.generateClass).toHaveBeenCalled()
    expect(interfaceToBuilder.saveBuilderFile).toHaveBeenCalled()
  })
})

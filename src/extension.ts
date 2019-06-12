import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('extension.interfaceToBuilder', () => {

		const uppercaseFirstLetter = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

		const start = async () => {

			if (!vscode.workspace.workspaceFolders) {
				return vscode.window.showErrorMessage('Please open a directory before creating a builder.');
			}

			var editor = vscode.window.activeTextEditor;
			
			if (!editor) {
				vscode.window.showErrorMessage('No open text editor. Please open an interface file.');
				return;
			}

			var text = editor.document.getText();

			if (!text) {
				vscode.window.showErrorMessage('No text found. Please open an interface file.');
				return;
			}

			if (!text.includes('export interface')) {
				vscode.window.showErrorMessage('No interface found. "export interface" must be in your code.');
				return;
			}	

			// Search for the first word after "export interface" to find the name of the interface.
			const interfaceNames = text.match(/(?<=\bexport interface\s)(\w+)/);

			if (!interfaceNames) {
				vscode.window.showErrorMessage('Could not find the interface name.');
				return;
			}

			let interfaceName = interfaceNames[0];
			let className = interfaceName;

			// Check if the interface name has an "I" at the start. If it does, remove the the "I".
			if (/\b[I]/.test(className)) {
				className = className.substring(1);
			}

			// Find all the properties defined in the interface.
			const properties = text.match(/(\w*[^\s])(?=:)/gm);

			if (!properties) {
				vscode.window.showErrorMessage('Could not find any properties defined in the interface.');
				return;
			}

			// Find all the property types defined in the interface.
			const types = text.match(/(?<=:\s)(.*)/g);

			if (!types) {
				vscode.window.showErrorMessage('Could not find any property types defined in the interface.');
				return;
			}
			
			const propertyDefinitions: string[] = [];
			const propertyLocalAssignments: string[] = [];
			const propertyExternalAssignments: string[] = [];

			properties.forEach((p, i) => {
				const type = types[i];
				let initValue;

				switch (type) {
					case 'string': 
						initValue = `''`;
						break;
					case 'number': 
						initValue = 1;
						break;
					default:
						initValue = `''`;
				}

				const propertyDefinition = `private ${p}: ${type} = ${initValue}`;
				propertyDefinitions.push(propertyDefinition);

				const propertyLocalAssignment = `${p}: this.${p}`;
				propertyLocalAssignments.push(propertyLocalAssignment);

				const propertyExternalAssignment = `public with${uppercaseFirstLetter(p)}(value: ${type}) {\n    this.${p} = value\n    return this\n  }`;
				propertyExternalAssignments.push(propertyExternalAssignment);
			});

			// TODO: Make the indenting prettier.
			const classString = `export class ${className}Builder {
  ${propertyDefinitions.join('\n  ')}

  public build(): ${interfaceName} {
    return {
      ${propertyLocalAssignments.join(',\n      ')}
    }
  }

  ${propertyExternalAssignments.join('\n\n  ')}
}`;

			const filePath = editor.document.uri.toString();
			const fileName = filePath.match(/[a-z.-]+(?=\.ts)/);
			const folderPath = filePath.substring(0, filePath.lastIndexOf('/'));

			console.log(filePath);
			console.log(fileName);
			console.log(folderPath);

			// console.log(editor.document.uri.toString().split(":")[1]);
			console.log(editor.document.uri.fsPath);

			// Write the file to the current editor directory.
			fs.writeFile(path.join(folderPath, `${fileName}.ts`),
			classString, 
			err => {
				if (err) {
					console.log(err);
					vscode.window.showErrorMessage("File save failed");
				}
			});

			vscode.window.showInformationMessage('Generated buidler class from interface.');
		};

		start();		
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
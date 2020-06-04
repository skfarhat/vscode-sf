// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
// import * as fs from 'fs';
// import { type } from 'os';

let fs = require("fs");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// const config = Config.get();
	// Config.check (config);
	// console.log(config);

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-ext" is now active!');

	// const browsableFilenames = vscode.workspace.getConfiguration().get('browsableFilenames');
	const notesDirectory = vscode.workspace.getConfiguration().get('sfext.notesDirectory');
	const openFile = (path) => vscode.commands.executeCommand('vscode.open', vscode.Uri.file(path))

	let disposable1 = vscode.commands.registerCommand('vscode-ext.openNote', function() {
		const quickPickOptions = {}
		fs.readdir(notesDirectory, (err, data) => {
			if (typeof err !== 'undefined') {
				const ignoreRegex = /.git|.DS_Store/
				const filteredFiles = data.filter(item => !item.match(ignoreRegex))
				vscode.window.showQuickPick(filteredFiles, quickPickOptions).then(
					selected => openFile(`${notesDirectory}/${selected}`),
					err => vscode.window.showErrorMessage('Failed', err)
				)
			}
		})

		// const options = {
		// 	defaultUri: vscode.Uri.file(notesDirectory),
		// 	openLabel: 'Open Note',
		// 	canseSelectFiles: true,
		// 	canSelectMany: false,
		// 	canSelectFolders: false,
		// }
		// vscode.window.showOpenDialog(options).then(
		// 	(selectedUri) => vscode.commands.executeCommand('vscode.open', selectedUri),
		// 	(err) => vscode.window.showErrorMessage('Could not open selected note', err)
		// )
	})

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable2 = vscode.commands.registerCommand('vscode-ext.helloWorld', function () {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello from vscode-ext!');
		let uri = vscode.Uri.file('/Users/sami/d/dev/TODO');
		console.log(uri)
		vscode.commands.executeCommand('vscode.open', uri)
		.then(success=>console.log('success', success))
		.catch(exc => console.log('exception', exc));
		// vscode.commands.getCommands().then((data) => console.log(data));
	});

	let toggleOutline = vscode.commands.registerCommand('sf-ext.toggleOutline', function () {
		vscode.window.showInformationMessage('sf-ext toggleOutline');
		vscode.commands.executeCommand('outline.focus');
	});


	context.subscriptions.push(disposable1);
	context.subscriptions.push(disposable2);
	context.subscriptions.push(toggleOutline);

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')

let fs = require("fs")
let os = require('os')

// Config values
const notesDirectory = expandHomeDirectory(vscode.workspace.getConfiguration().get('sf.notesDirectory'))


// ============================================================================
// FUNCTIONS
// ============================================================================


function isSet(item) {
	return item !== null && typeof(item) !== 'undefined'
}

function expandHomeDirectory(path) {
	// Expand home directory squiggle if present
	if (path.startsWith('~')) {
		path = path.replace('~', os.homedir())
	}
	return path
}

/**
 * Open file with Visual Studio
 * @param {string} path path to the file to be opened
 */
function openFile(path) {
	vscode.commands.executeCommand('vscode.open', vscode.Uri.file(path))
}

/**
 * Returns a Promise which contains the list of files in the user-configured
 * notes directory.
 */
function getNoteFiles() {
	return new Promise((resolve, reject) => {
		fs.readdir(notesDirectory, (err, data) => {
			if (isSet(err) || !isSet(data)) {
				const msg = `Could not open requested directory ${notesDirectory}`
				vscode.window.showErrorMessage(msg)
				reject(msg)
			} else {
				const ignoreRegex = /.git|.DS_Store/
				const filteredFiles = data.filter(item => !item.match(ignoreRegex))
				resolve(filteredFiles)
			}
		})
	})
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "sf" is now active!')

	let openNoteCommand = vscode.commands.registerCommand('sf.openNote', function() {
		vscode.window.showQuickPick(getNoteFiles(), {}).then(
			selected => {
				if (isSet(selected)) {
					openFile(`${notesDirectory}/${selected}`)
				}
			}
		)
	})
	context.subscriptions.push(openNoteCommand)
}

exports.activate = activate

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')

let fs = require("fs")
let os = require('os')

// Config values
const configNoteDirs = vscode.workspace.getConfiguration().get('sf.noteDirectories')
const noteDirs = configNoteDirs.map(expandHomeDirectory)

var noteParents = {}


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
function refreshNoteFiles() {
  for (var i in noteDirs) {
    // Remove trailing /
	const noteDir = noteDirs[i].replace(/\/$/, '');
    fs.readdir(noteDir, (err, data) => {
      if (!isSet(err) && isSet(data)) {
        const filteredNotes = data.filter(
          (item) => !item.match(/.git|.DS_Store/)
        )
        for (var j in filteredNotes) {
          const note = filteredNotes[j]
          if (note in noteParents) {
            // Note with similar name exists already
			// show full path in.
			// Replace previous one with adjusted one
			const parent = noteParents[note]
			noteParents[`${parent}/${note}`] = ''
			delete noteParents[note]
			// Next insert the current one
			noteParents[`${noteDir}/${note}`] = ''
          } else {
            noteParents[note] = noteDir
          }
        }
      }
    })
  }
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  refreshNoteFiles();

  let openNoteCommand = vscode.commands.registerCommand(
    "sf.openNote",
    function () {
      vscode.window
        .showQuickPick(Object.keys(noteParents), {})
        .then((selected) => {
          if (isSet(selected)) {
            const parent = noteParents[selected];
            openFile(`${parent}/${selected}`);
          }
        });
    }
  );
  context.subscriptions.push(openNoteCommand);
}

exports.activate = activate

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

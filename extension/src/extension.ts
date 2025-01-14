import * as cp from "node:child_process";
import * as path from "node:path";
import * as vscode from "vscode";

// Function to execute the autover CLI command
const runAutover = (type: "major" | "minor" | "patch") => {
	const cliPath = path.join(
		__dirname,
		"node_modules/@dpaulos6/autover/bin/autover.js",
	); // Adjust the path if needed
	cp.exec(`${cliPath} bump ${type}`, (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage(`Error bumping version: ${stderr}`);
			return;
		}
		vscode.window.showInformationMessage(`Version bumped to ${stdout.trim()}`);
	});
};

export function activate(context: vscode.ExtensionContext) {
	console.log('Your extension "autover" is now active!');

	// Register command for bumping version
	const bumpMajorCommand = vscode.commands.registerCommand(
		"autover.bumpMajor",
		() => {
			runAutover("major");
		},
	);

	const bumpMinorCommand = vscode.commands.registerCommand(
		"autover.bumpMinor",
		() => {
			runAutover("minor");
		},
	);

	const bumpPatchCommand = vscode.commands.registerCommand(
		"autover.bumpPatch",
		() => {
			runAutover("patch");
		},
	);

	context.subscriptions.push(
		bumpMajorCommand,
		bumpMinorCommand,
		bumpPatchCommand,
	);
}

export function deactivate() {}

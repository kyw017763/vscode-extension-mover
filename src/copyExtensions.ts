import * as vscode from 'vscode';
import * as copyPaste from 'copy-paste';

export default async (extensionData: string, extensionCnt: number) => {
  copyPaste.copy(extensionData, () => {
    vscode.window.showInformationMessage(`Hello, It\'s Extension Mover!\r\n${extensionCnt} extension install command are copied!`);
  });
};
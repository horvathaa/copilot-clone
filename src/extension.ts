import * as vscode from 'vscode';

import { search } from './utils/search';
import { matchSearchPhrase } from './utils/matchSearchPhrase';

export function activate(_: vscode.ExtensionContext) {

    const provider: vscode.CompletionItemProvider = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        provideInlineCompletionItems: async (document, position: vscode.Position, context, token) => {

            const textBeforeCursor = document.getText(
                new vscode.Range(position.with(undefined, 0), position)
            );
            const SetCompletion = new vscode.CompletionItem('SET');
            SetCompletion.insertText = new vscode.SnippetString(textBeforeCursor);
            
            SetCompletion.command = { command: 'editor.action.triggerSuggest', title: 'Search completions...' };
            const match = matchSearchPhrase(textBeforeCursor);
            // let items: any[] = [];
            // console.log('match', match);
            // Generate and return completion items
            let completionItems = [];
            if (match?.searchPhrase === 'console') {
                completionItems.push(
                    new vscode.CompletionItem('console.log'),
                    new vscode.CompletionItem('console.error')
                );
            }

            if (match) {
                let rs;
                try {
                    rs = await search(match.searchPhrase);
                    console.log('rs', rs);
                    if (rs) {
                        completionItems = rs.results.map(item => {
                            const output = `\n${match.commentSyntax} Source: ${item.sourceURL} ${match.commentSyntaxEnd}\n${item.code}`;
                            return {
                                text: output,
                                insertText: output,
                                range: new vscode.Range(position.translate(0, output.length), position)
                            };
                        });
                    }
                } catch (err: any) {
                    vscode.window.showErrorMessage(err.toString());
                }
            }
            else {
                console.error('no match');
            }
            return {completionItems};
        },
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    vscode.languages.registerInlineCompletionItemProvider({pattern: "**"}, provider);
}

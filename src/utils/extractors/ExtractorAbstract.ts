import { getConfig, getSearchURL } from "../../config";
import { FetchPageResult, fetchPageTextContent } from "../fetchPageContent";
import { TerminalLink, TerminalLinkContext, TerminalLinkProvider, CancellationToken, ProviderResult, window } from "vscode";

export default abstract class ExtractorAbstract {

    abstract name: string;
    abstract URL: string;

    isEnabled() {
        const config = getConfig();
        return this.URL in config.settings.sites && config.settings.sites[this.URL];
    }

    /**
     * Return a list of Source URLs from Google Search's result
     */
    extractURLFromKeyword = (keyword: string): Promise<string[]> => {

        return new Promise((resolve, reject) => {

            fetchPageTextContent(getSearchURL(this.URL, keyword))
                .then(rs => {
                    const regex = new RegExp(`(https://${this.URL}/[a-z0-9-/]+)`, "gi");
                    let urls = rs.textContent.match(regex);
                    urls && (urls = urls.filter((url, i, list) => list.indexOf(url) === i));
                    resolve(urls || []);
                })
                .catch(reject);
        });
    };

    // Extract snippets from URL content
    abstract extractSnippets: (options: FetchPageResult) => SnippetResult[];
}


// export function extractTextContent(url: string): Promise<FetchPageResult> {
//     return new Promise((resolve, reject) => {
//         return fetch(url)
//             .then(rs => rs.text())
//             .then(textContent => resolve({textContent, url}))
//             .catch(reject);
//     });
// }

export type SnippetResult = {
    votes: number,
    code: string,
    hasCheckMark: boolean,
    sourceURL: string,
}

interface CatseyeTerminalLink extends TerminalLink {
    startIndex: number
    content: string
}

export class ExtractorTerminalLinkProvider implements TerminalLinkProvider {
    public provideTerminalLinks(
        context: TerminalLinkContext,
        token: CancellationToken
    ): ProviderResult<CatseyeTerminalLink[]> {
        const list: number[] = [];
        for (let i = 1; i <= 10; i++) {
            list.push(i);
        }
        console.log('context', context);
        const view = window.activeTextEditor?.viewColumn;
        if (view) {
            console.log('hi');
            console.log('hewwo???');
            const startIndex = 0;
            const lengthOfLink = context.line.length;
            const tooltip = 'Add to Selected Annotation';

            return [
                {
                    startIndex,
                    length: lengthOfLink,
                    tooltip,
                    content: context.line,
                },
            ];
        } else {
            return [];
        }
    }

    public async handleTerminalLink(link: CatseyeTerminalLink): Promise<void> {
        const view = window.activeTextEditor?.viewColumn;
        view?.addTerminalMessage(link.content);
        console.log('hi');
        console.log('another edit')
        // let reg = /^\d+$/; // check if string contains only numbers
        return fetch(url)
        .then(rs => rs.text())
        .then(textContent => resolve({textContent, url}))
        .catch(reject);
        console.log('link', link);
    }
}

export type SnippetPageResult = {
    results: SnippetResult[],
    url: string
}

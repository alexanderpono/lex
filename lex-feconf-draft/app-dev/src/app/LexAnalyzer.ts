import {
    AppDocument,
    CanonicTextItem,
    CompiledLine,
    defaultCompiledLine,
    IndexData,
    Table
} from '@src/app.types';
import { AppStateManager } from '@src/AppStateManager';

const NOT_FOUND = 10000;

export class LexAnalyzer {
    constructor(private stateManager: AppStateManager) {}

    parseText = (srcText: string) => {
        let buf = srcText;

        let iter = 0;
        const MAX_ITER = this.stateManager.getStepNo();
        let currentPosInLine = 1;
        let lineNo = 1;

        let document: AppDocument = {
            spaces: this.stateManager.getSpaces(),
            limiters: this.stateManager.getLimiters(),
            ids: [],
            compiled: this.stateManager.getCompiled(),
            text: [],
            strings: []
        };

        while (buf.length > 0 && iter < MAX_ITER) {
            const indexData = this.getIndex(buf, document.compiled);
            if (indexData.pos !== NOT_FOUND) {
                const limiterOrSpaceNotInBufStart = indexData.pos > 0;
                if (limiterOrSpaceNotInBufStart) {
                    const newId = buf.substring(0, indexData.pos);
                    document = this.addIdToText(newId, lineNo, currentPosInLine, document);
                    currentPosInLine += newId.length;
                    buf = buf.substring(indexData.pos);
                } else {
                    document = this.addLimiterOrSpaceToText(
                        indexData,
                        lineNo,
                        currentPosInLine,
                        document
                    );
                    currentPosInLine += indexData.lexem.lexem.length;
                    buf = buf.substring(indexData.lexem.lexem.length);
                    if (indexData.lexem.lexem === '\n') {
                        lineNo++;
                        currentPosInLine = 1;
                    }
                }
            } else {
                document = this.addIdToText(buf, lineNo, currentPosInLine, document);
                buf = '';
            }
            iter++;
        }

        this.stateManager.setInputString(buf);
        this.stateManager.setText(document.text);
        this.stateManager.setIds(document.ids);
        this.stateManager.setLineNo(lineNo);
        this.stateManager.setCurrentPosInLine(currentPosInLine);
        return iter;
    };

    getIndex = (s: string, compiled: CompiledLine[]): IndexData => {
        let bestIndex = NOT_FOUND;
        let bestCompiledLine = defaultCompiledLine;
        compiled.forEach((line: CompiledLine) => {
            const index = s.indexOf(line.lexem);
            if (index >= 0) {
                if (index < bestIndex) {
                    bestIndex = index;
                    bestCompiledLine = line;
                }
            }
        });

        return { pos: bestIndex, lexem: bestCompiledLine };
    };

    buildStrings = () => {
        const srcText = this.stateManager.getText();
        let state = 'work';
        let buffer: CanonicTextItem[] = [];

        let document: AppDocument = {
            spaces: this.stateManager.getSpaces(),
            limiters: this.stateManager.getLimiters(),
            ids: [],
            compiled: this.stateManager.getCompiled(),
            text: [],
            strings: []
        };

        srcText.forEach((token: CanonicTextItem) => {
            if (state === 'work' && token.lexem === "'") {
                state = 'openedString';
                return;
            }
            if (state === 'openedString' && token.lexem === "'") {
                const newId = this.concatString(buffer);

                document = this.addStringToText(newId, buffer[0].lineNo, buffer[0].pos, document);
                buffer = [];
                state = 'work';
                return;
            }
            if (state === 'openedString' && token.lexem === '\n') {
                console.error('Незавершенная строковая константа', buffer[0].lineNo, buffer[0].pos);
                document.text = [...document.text, ...buffer];
                buffer = [];
                return;
            }

            if (state === 'openedString') {
                buffer = [...buffer, token];
                return;
            }

            if (state === 'work') {
                if (token.tableId === 'i') {
                    document = this.addIdToText(token.lexem, token.lineNo, token.pos, document);
                } else {
                    document.text = [...document.text, token];
                }
                return;
            }
        });

        this.stateManager.setText(document.text);
        this.stateManager.setIds(document.ids);
        this.stateManager.setStrings(document.strings);
    };

    addIdToText = (
        newId: string,
        lineNo: number,
        currentPosInLine: number,
        doc: AppDocument
    ): AppDocument => {
        const posInIds = doc.ids.findIndex((id: string) => id === newId);
        const newDoc = { ...doc };
        let newTextItem: CanonicTextItem = {
            tableId: Table.IDS,
            tableIndex: posInIds,
            lineNo,
            pos: currentPosInLine,
            lexem: newId
        };
        if (posInIds < 0) {
            newDoc.ids = [...newDoc.ids, newId];
            newTextItem.tableIndex = newDoc.ids.length - 1;
        }

        newDoc.text = [...newDoc.text, newTextItem];
        return newDoc;
    };

    concatString = (text: CanonicTextItem[]): string => {
        return text.map((token: CanonicTextItem) => token.lexem).join('');
    };

    addLimiterOrSpaceToText = (
        indexData: IndexData,
        lineNo: number,
        currentPosInLine: number,
        doc: AppDocument
    ) => {
        const newTextItem: CanonicTextItem = {
            tableId: indexData.lexem.tableId,
            tableIndex: indexData.lexem.tableIndex,
            lineNo,
            pos: currentPosInLine,
            lexem: indexData.lexem.lexem
        };
        return { ...doc, text: [...doc.text, newTextItem] };
    };

    addStringToText = (
        newId: string,
        lineNo: number,
        currentPosInLine: number,
        doc: AppDocument
    ): AppDocument => {
        const posInStrings = doc.strings.findIndex((id: string) => id === newId);
        const newDoc = { ...doc };
        let newTextItem: CanonicTextItem = {
            tableId: Table.STRINGS,
            tableIndex: posInStrings,
            lineNo,
            pos: currentPosInLine,
            lexem: newId
        };
        if (posInStrings < 0) {
            newDoc.strings = [...newDoc.strings, newId];
            newTextItem.tableIndex = newDoc.strings.length - 1;
        }

        newDoc.text = [...newDoc.text, newTextItem];
        return newDoc;
    };

    removeComments = () => {
        const srcText = this.stateManager.getText();
        let state = 'work';
        let buffer: CanonicTextItem[] = [];

        let document: AppDocument = {
            spaces: this.stateManager.getSpaces(),
            limiters: this.stateManager.getLimiters(),
            ids: [],
            compiled: this.stateManager.getCompiled(),
            text: [],
            strings: []
        };

        srcText.forEach((token: CanonicTextItem) => {
            if (state === 'work' && token.lexem === '/') {
                buffer = [token];
                state = 'firstSlash';
                return;
            }
            if (state === 'firstSlash' && token.lexem === '/') {
                state = 'comment';
                return;
            }
            if (state === 'comment' && token.lexem === '\n') {
                document.text = [...document.text, token];
                state = 'work';
                return;
            }

            if (state === 'firstSlash') {
                document.text = [...document.text, buffer[0]];
                buffer = [];
                document.text = [...document.text, token];
                state = 'work';
                return;
            }

            if (state === 'work') {
                switch (token.tableId) {
                    case Table.IDS:
                        document = this.addIdToText(token.lexem, token.lineNo, token.pos, document);
                        break;

                    case Table.STRINGS:
                        document = this.addStringToText(
                            token.lexem,
                            token.lineNo,
                            token.pos,
                            document
                        );
                        break;

                    default:
                        document.text = [...document.text, token];
                }
                return;
            }
        });

        this.stateManager.setText(document.text);
        this.stateManager.setIds(document.ids);
        this.stateManager.setStrings(document.strings);
    };

    removeWhitespace = () => {
        const srcText = this.stateManager.getText();
        let state = 'work';

        let document: AppDocument = {
            spaces: this.stateManager.getSpaces(),
            limiters: this.stateManager.getLimiters(),
            ids: [],
            compiled: this.stateManager.getCompiled(),
            text: [],
            strings: []
        };

        srcText.forEach((token: CanonicTextItem) => {
            if (state === 'work' && token.tableId === Table.SPACES) {
                state = 'work';
                return;
            }
            if (state === 'work') {
                switch (token.tableId) {
                    case Table.IDS:
                        document = this.addIdToText(token.lexem, token.lineNo, token.pos, document);
                        break;

                    case Table.STRINGS:
                        document = this.addStringToText(
                            token.lexem,
                            token.lineNo,
                            token.pos,
                            document
                        );
                        break;

                    default:
                        document.text = [...document.text, token];
                }
                return;
            }
        });

        this.stateManager.setText(document.text);
        this.stateManager.setIds(document.ids);
        this.stateManager.setStrings(document.strings);
    };

    compile = () => {
        const limiters = this.stateManager.getLimiters();
        const spaces = this.stateManager.getSpaces();

        let compiled: CompiledLine[] = [];
        compiled = [
            ...limiters.map(
                (lexem: string, index: number): CompiledLine => ({
                    tableId: Table.LIMITERS,
                    tableIndex: index,
                    lexem
                })
            ),
            ...spaces.map(
                (lexem: string, index: number): CompiledLine => ({
                    tableId: Table.SPACES,
                    tableIndex: index,
                    lexem
                })
            )
        ];
        this.stateManager.setCompiled(compiled);
        return this;
    };
}

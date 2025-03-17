import React from 'react';
import styles from './LexView.scss';
import { CanonicTextItem, SyntaxAnalyzeState, SyntaxNode, Table } from '@src/app.types';

interface LexViewProps {
    inputString: string;
    limiters: string[];
    spaces: string[];
    ids: string[];
    text: CanonicTextItem[];
    showInputFile: boolean;
    showPrettyText: boolean;
    showLimitersTable: boolean;
    showSpacesTable: boolean;
    showIdsTable: boolean;
    showCanonicText: boolean;
    formatIds: boolean;
    formatComments: boolean;
    showLineNumbers: boolean;
    strings: string[];
    showStringsTable: boolean;
    showText: boolean;
    program: SyntaxAnalyzeState;
    showProgram: boolean;
    consoleText: string;
    showConsole: boolean;
}

const formatLexem = (s: string) => {
    if (s === ' ') {
        return `'${s}'`;
    }
    if (s === '\n') {
        return `'\\n'`;
    }
    return s;
};

const prettify = (
    text: CanonicTextItem[],
    formatIds: boolean,
    formatComments: boolean,
    showLineNumbers: boolean
): React.ReactElement => {
    let lineNo = 0;
    let curLineContent = [];
    let lines = [];
    let isComment = false;
    const getIdClassName = () => (formatIds ? (isComment ? 'comment' : 'id') : '');
    const getLimiterClassName = () => (formatComments ? (isComment ? 'comment' : 'limiter') : '');
    text.forEach((token: CanonicTextItem, index: number) => {
        if (token.lineNo > lineNo) {
            if (curLineContent.length > 0) {
                const prevLine = <p key={lineNo}>{curLineContent}</p>;
                lines.push(prevLine);
            }
            curLineContent = [];
            isComment = false;
            lineNo = token.lineNo;
            if (showLineNumbers) {
                curLineContent.push(<span className="line-number" key={0}>{`${lineNo}: `}</span>);
            }
        }
        let formattedLexem = <span key={token.pos}>{token.lexem}</span>;
        if (token.tableId === Table.IDS) {
            formattedLexem = (
                <span key={token.pos} className={getIdClassName()}>
                    {token.lexem}
                </span>
            );
        }
        if (token.tableId === Table.STRINGS) {
            formattedLexem = (
                <span key={token.pos} className={getIdClassName()}>
                    '{token.lexem}'
                </span>
            );
        }
        if (token.tableId === Table.LIMITERS) {
            if (token.lexem === '/') {
                if (index + 1 < text.length) {
                    const nextToken = text[index + 1];
                    if (nextToken.lexem === '/' && nextToken.lineNo === token.lineNo) {
                        if (formatComments) {
                            isComment = true;
                        }
                    }
                }
            }
            formattedLexem = (
                <span key={token.pos} className={getLimiterClassName()}>
                    {token.lexem}
                </span>
            );
        }
        curLineContent.push(formattedLexem);
    });
    if (curLineContent.length > 0) {
        const prevLine = <p key={lineNo}>{curLineContent}</p>;
        lines.push(prevLine);
    }

    return <section>{lines}</section>;
};

const toText = (text: CanonicTextItem[]): React.ReactElement => {
    const els = text.map((token: CanonicTextItem) => {
        if (token.tableId === Table.STRINGS) {
            return <span>{`'${token.lexem}'`}</span>;
        }

        return <span>{token.lexem}</span>;
    });

    return <section>{els}</section>;
};

const operandToString = (text: CanonicTextItem[], node: SyntaxAnalyzeState) => {
    if (node.type === SyntaxNode.ID) {
        const token = text[node.valPos];
        return token.lexem;
    }
    if (node.type === SyntaxNode.EXPRESSION) {
        return operandToString(text, node.operand1);
    }
    return '';
};

const paramsToString = (text: CanonicTextItem[], program: SyntaxAnalyzeState) => {
    switch (program.parameters.type) {
        case SyntaxNode.STRING:
            return "'" + text[program.parameters.valPos].lexem + "'";
        case SyntaxNode.EXPRESSION: {
            const op1 = operandToString(text, program.parameters.operand1);
            if (program.parameters.operation !== '') {
                const op2 = operandToString(text, program.parameters.operand2);
                return `${op1}${program.parameters.operation}${op2}`;
            }
            return op1;
            break;
        }
        default:
            return '?';
    }
};

const printProgramInstructions = (text: CanonicTextItem[], program: SyntaxAnalyzeState) => {
    if (program.id === -1) {
        return '';
    }
    const id: CanonicTextItem = text[program.id];
    return `CALL ${id.lexem} [${paramsToString(text, program)}]`; //${params.join(',')}
};

export const LexView: React.FC<LexViewProps> = ({
    inputString,
    limiters,
    spaces,
    ids,
    text,
    showInputFile,
    showPrettyText,
    showLimitersTable,
    showSpacesTable,
    showIdsTable,
    showCanonicText,
    formatIds,
    formatComments,
    showLineNumbers,
    strings,
    showStringsTable,
    showText,
    program,
    showProgram,
    consoleText,
    showConsole
}) => {
    return (
        <div className={styles.tmp}>
            <div className="tables">
                {showInputFile && (
                    <section>
                        <p>input file</p>
                        <pre className="inputString">{inputString ? inputString : '  '}</pre>
                    </section>
                )}

                {showLimitersTable && (
                    <section>
                        <p>limiters(l)</p>
                        <table className="lexTable">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Lexem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {limiters.map((lexem, index) => {
                                    return (
                                        <tr key={`limiters-${index}`}>
                                            <td>{index + 1}</td>
                                            <td>{lexem}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </section>
                )}

                {showSpacesTable && (
                    <section>
                        <p>spaces(s)</p>
                        <table className="lexTable">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Lexem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {spaces.map((lexem, index) => {
                                    return (
                                        <tr key={`spaces-${index}`}>
                                            <td>{index + 1}</td>
                                            <td>{lexem !== '\n' ? `'${lexem}'` : `'\\n'`}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </section>
                )}

                {showIdsTable && (
                    <section>
                        <p>ids(i)</p>
                        <table className="lexTable">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Lexem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ids.map((lexem, index) => {
                                    return (
                                        <tr key={`ids-${index}`}>
                                            <td>{index + 1}</td>
                                            <td>{lexem}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </section>
                )}

                {showStringsTable && (
                    <section className="stringsTable">
                        <p>strings(str)</p>
                        <table className="lexTable">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Lexem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {strings.map((lexem, index) => {
                                    return (
                                        <tr key={`limiters-${index}`}>
                                            <td>{index + 1}</td>
                                            <td>{lexem}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </section>
                )}

                {showCanonicText && (
                    <section>
                        <p>canonic text</p>
                        <div className="text">
                            <table className="lexTable">
                                <thead>
                                    <tr>
                                        <th>table</th>
                                        <th>t-index</th>
                                        <th>line</th>
                                        <th>pos</th>
                                        <th>string</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {text.map((token: CanonicTextItem, index) => {
                                        return (
                                            <tr key={`text-${index}`}>
                                                <td>{token.tableId}</td>
                                                <td>{token.tableIndex}</td>
                                                <td>{token.lineNo}</td>
                                                <td>{token.pos}</td>
                                                <td>{formatLexem(token.lexem)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {showPrettyText && (
                    <section>
                        <p>pretty text</p>
                        <pre className="text-restored">
                            {prettify(text, formatIds, formatComments, showLineNumbers)}
                        </pre>
                    </section>
                )}

                {showText && (
                    <section>
                        <p>text</p>
                        <pre className="simple-text">{toText(text)}</pre>
                    </section>
                )}

                {showProgram && (
                    <section>
                        <p>instructions</p>
                        <pre className="program">{printProgramInstructions(text, program)}</pre>
                    </section>
                )}

                {showConsole && (
                    <section>
                        <p>console</p>
                        <pre className="console">{consoleText}</pre>
                    </section>
                )}
            </div>
        </div>
    );
};

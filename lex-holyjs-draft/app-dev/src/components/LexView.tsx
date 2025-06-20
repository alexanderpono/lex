import React from 'react';
import styles from './LexView.scss';
import { CanonicTextItem, Show, SyntaxAnalyzeState, SyntaxNode, Table } from '@src/app.types';
import { expressionToReversePolish } from './expressionToReversePolish';
import { ImageBuilder } from './ViewPort/ImageBuilder';

const TREE_CANVAS_WIDTH = 400;
const TREE_CANVAS_HEIGHT = 282;
const CORPORATE_COLOR = '#00aae6';
const SYNTAX_NODE_HEIGHT = 40;
const SYNTAX_NODE_H2 = 20;
const SYNTAX_NODE_WIDTH = 40;
const SYNTAX_NODE_W2 = 20;

interface LexViewProps {
    inputString: string;
    limiters: string[];
    spaces: string[];
    ids: string[];
    text: CanonicTextItem[];
    formatIds: boolean;
    formatComments: boolean;
    strings: string[];
    program: SyntaxAnalyzeState;
    consoleText: string;
    show: Show;
    targetId: string;
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

const paramsToString = (text: CanonicTextItem[], program: SyntaxAnalyzeState) => {
    return expressionToReversePolish(text, program, [], false).join(',');
};

const printProgramInstructions = (
    text: CanonicTextItem[],
    program: SyntaxAnalyzeState,
    reversePolish: string[]
) => {
    if (program.id === -1) {
        return '';
    }
    const id: CanonicTextItem = text[program.id];
    return `CALL ${id.lexem} [${reversePolish.join(',')}]`;
};

export const LexView: React.FC<LexViewProps> = ({
    inputString,
    limiters,
    spaces,
    ids,
    text,
    formatIds,
    formatComments,
    strings,
    program,
    consoleText,
    show,
    targetId
}) => {
    let reversePolish = [];
    if (program.id !== -1) {
        reversePolish = expressionToReversePolish(text, program.parameters, [], false);
    }

    React.useEffect(() => {
        if (program.code === true && program.parameters?.code === true) {
            setTimeout(() => {
                const target = document.getElementById(`${targetId}-tree`);
                if (target) {
                    renderSyntaxTree(text, program.parameters, reversePolish, `${targetId}-tree`);
                }
            }, 0);
        }
    }, []);
    return (
        <div className={styles.tmp}>
            <div className="tables">
                {(show & Show.inputFile) > 0 && (
                    <section>
                        <p className="table-caption">input file</p>
                        <pre className="inputString">{inputString ? inputString : '  '}</pre>
                    </section>
                )}

                {(show & Show.limitersTable) > 0 && (
                    <section>
                        <p className="table-caption">limiters(l)</p>
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

                {(show & Show.spacesTable) > 0 && (
                    <section>
                        <p className="table-caption">spaces(s)</p>
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

                {(show & Show.idsTable) > 0 && (
                    <section>
                        <p className="table-caption">ids(i)</p>
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

                {(show & Show.stringsTable) > 0 && (
                    <section className="stringsTable">
                        <p className="table-caption">strings(str)</p>
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

                {(show & Show.canonicText) > 0 && (
                    <section>
                        <p className="table-caption">canonic text</p>
                        <div className="vscroll">
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

                {(show & Show.prettyText) > 0 && (
                    <section>
                        <p className="table-caption">pretty text</p>
                        <pre className="text-restored">
                            {prettify(
                                text,
                                formatIds,
                                formatComments,
                                (show & Show.lineNumbers) > 0
                            )}
                        </pre>
                    </section>
                )}

                {(show & Show.text) > 0 && (
                    <section>
                        <p className="table-caption">text</p>
                        <pre className="simple-text">{toText(text)}</pre>
                    </section>
                )}

                {(show & Show.program) > 0 && (
                    <section>
                        <p className="table-caption">instructions</p>
                        <pre className="program">
                            {printProgramInstructions(text, program, reversePolish)}
                        </pre>
                    </section>
                )}

                {(show & Show.console) > 0 && (
                    <section>
                        <p className="table-caption">console</p>
                        <pre className="console">{consoleText}</pre>
                    </section>
                )}
                {(show & Show.mathTree) > 0 && (
                    <section>
                        <p className="table-caption">mathTree</p>
                        <div id={`${targetId}-tree`}>tree</div>
                    </section>
                )}
            </div>
        </div>
    );
};

const getLevelsCount = (n: number) => {
    let count = n >= 2 ? 2 : 1;
    let workN = n;
    let loopIndex = 0;
    const maxLoopIndex = 10;
    while (workN > 1 && loopIndex < maxLoopIndex) {
        workN = workN >> 1;
        count++;
        loopIndex++;
    }
    return count;
};

const renderSyntaxTree = (
    text: CanonicTextItem[],
    node: SyntaxAnalyzeState,
    reversePolish: string[],
    targetId: string
) => {
    const image = ImageBuilder.create()
        .setDomTarget(targetId)
        .setSize(TREE_CANVAS_WIDTH, TREE_CANVAS_HEIGHT)
        .createContext()
        .clear()
        .lineColor(CORPORATE_COLOR)
        .lineWidth(1)
        .border()
        .border()
        .border()
        .font('bold 20px sans-serif');

    const isParent = (nodeChar: string) => ['+', '-', '*', '/'].indexOf(nodeChar) >= 0;
    const parentsCount = reversePolish.filter((char: string) => isParent(char)).length;
    const levelsCount = getLevelsCount(parentsCount);

    nodesToRender = [];
    const minStepY = SYNTAX_NODE_HEIGHT;
    const stepYFromLevelsCount = Math.floor(TREE_CANVAS_HEIGHT / (levelsCount + 1));
    const stepY = stepYFromLevelsCount > minStepY ? stepYFromLevelsCount : minStepY;
    getRenderNodeCommand(0, text, node, null, false, stepY);

    image.lineColor(CORPORATE_COLOR);
    image.fillColor(CORPORATE_COLOR);
    image.lineWidth(2);
    nodesToRender.forEach((node: NodeToRender) => {
        if (node.parentX !== null && node.parentY !== null) {
            image.line(
                node.parentX,
                node.parentY + SYNTAX_NODE_W2,
                node.x,
                node.y + SYNTAX_NODE_H2
            );
        }
    });

    image.fillColor('#fff');
    nodesToRender.forEach((node: NodeToRender) => {
        image.drawCircle(node.x, node.y + SYNTAX_NODE_H2, SYNTAX_NODE_H2);
    });

    image.fillColor(CORPORATE_COLOR);
    nodesToRender.forEach((node: NodeToRender) => {
        let dx = -6 - (node.caption.length - 1) * 5;
        image.text(node.x + dx, node.y + SYNTAX_NODE_H2 + 6, node.caption);
    });

    image.buildImage();
};

interface NodeToRender {
    x: number;
    y: number;
    levelNo: number;
    caption: string;
    parentX: number;
    parentY: number;
}
let nodesToRender: NodeToRender[] = [];
const getRenderNodeCommand = (
    levelNo: number,
    text: CanonicTextItem[],
    node: SyntaxAnalyzeState,
    parentNode: NodeToRender,
    isLeft: boolean,
    stepY: number
) => {
    const maxNodesInLevel = 2 ** levelNo;
    let renderX = 0;
    const portWidth = TREE_CANVAS_WIDTH;
    if (levelNo === 0) {
        renderX = portWidth / 2;
    } else {
        const stepX = portWidth / (maxNodesInLevel + 1);
        renderX = Math.floor(isLeft ? parentNode.x - stepX / 2 : parentNode.x + stepX / 2);
    }

    let renderY = (levelNo + 0.5) * stepY;
    const curNode: NodeToRender = {
        x: renderX,
        y: renderY,
        levelNo,
        caption: node.type === SyntaxNode.EXPRESSION ? node.operation : text[node.valPos].lexem,
        parentX: levelNo === 0 ? null : parentNode.x,
        parentY: levelNo === 0 ? null : parentNode.y
    };
    nodesToRender.push(curNode);

    if (node.type === SyntaxNode.EXPRESSION) {
        getRenderNodeCommand(levelNo + 1, text, node.operand1, curNode, true, stepY);
        getRenderNodeCommand(levelNo + 1, text, node.operand2, curNode, false, stepY);
    }
};

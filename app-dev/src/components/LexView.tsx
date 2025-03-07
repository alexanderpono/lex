import React from 'react';
import styles from './LexView.scss';
import { CanonicTextItem } from '@src/app.types';

interface LexViewProps {
    inputString: string;
    limiters: string[];
    spaces: string[];
    ids: string[];
    text: CanonicTextItem[];
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

export const LexView: React.FC<LexViewProps> = ({ inputString, limiters, spaces, ids, text }) => {
    return (
        <div>
            <pre className={styles.inputString}>{inputString ? inputString : ' '}</pre>
            <div className={styles.tables}>
                <section>
                    <p>limiters:</p>
                    <table className={styles.lexTable}>
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

                <section>
                    <p>spaces:</p>
                    <table className={styles.lexTable}>
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

                <section>
                    <p>ids:</p>
                    <table className={styles.lexTable}>
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

                <section>
                    <p>text:</p>
                    <table className={styles.lexTable}>
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
                </section>
            </div>
        </div>
    );
};

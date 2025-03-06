import React from 'react';
import styles from './LexView.scss';

interface LexViewProps {
    inputString: string;
    limiters: string[];
    spaces: string[];
    ids: string[];
}

export const LexView: React.FC<LexViewProps> = ({ inputString, limiters, spaces, ids }) => {
    return (
        <div>
            <pre className={styles.inputString}>{inputString}</pre>
            <div className={styles.tables}>
                <section>
                    <p>limiters:</p>
                    <table className={styles.lexTable}>
                        <tr>
                            <th>ID</th>
                            <th>Lexem</th>
                        </tr>
                        {limiters.map((lexem, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{lexem}</td>
                                </tr>
                            );
                        })}
                    </table>
                </section>

                <section>
                    <p>spaces:</p>
                    <table className={styles.lexTable}>
                        <tr>
                            <th>ID</th>
                            <th>Lexem</th>
                        </tr>
                        {spaces.map((lexem, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{lexem !== '\n' ? `'${lexem}'` : `'\\n'`}</td>
                                </tr>
                            );
                        })}
                    </table>
                </section>

                <section>
                    <p>ids:</p>
                    <table className={styles.lexTable}>
                        <tr>
                            <th>ID</th>
                            <th>Lexem</th>
                        </tr>
                        {ids.map((lexem, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{lexem}</td>
                                </tr>
                            );
                        })}
                    </table>
                </section>
            </div>
        </div>
    );
};

import React from 'react';
import styles from './EditorView.scss';
import { defaultPoint2D, EditorControllerForUI, Point2D } from '@src/editor/EditorController.types';
import { useSelector } from 'react-redux';
import { edSelect } from '@src/store/editorReducer.selectors';
import { CanonicTextItem, Table } from '@src/app.types';

interface EditorViewProps {
    ctrl: EditorControllerForUI;
}

export const EditorView: React.FC<EditorViewProps> = ({ ctrl }) => {
    const rawText = useSelector(edSelect.rawText);
    const tokenList = useSelector(edSelect.tokenList);
    const prettyText = prettify(tokenList, true, true, false);
    const cursorPos = useSelector(edSelect.cursorPos);
    const lineNumbers = useSelector(edSelect.lineNumbers);
    const sampleCharRef = React.useRef();
    const editorRef = React.useRef();
    const [sampleSize, setSampleSize] = React.useState({ ...defaultPoint2D });

    const getSampleSize = (): Point2D => {
        const sampleEl = sampleCharRef.current as HTMLElement;
        if (sampleEl) {
            return { x: sampleEl.clientWidth, y: sampleEl.clientHeight };
        } else {
            return { x: 1, y: 1 };
        }
    };

    React.useEffect(() => {
        const newSampleSize = getSampleSize();
        ctrl.onUIMount(newSampleSize);
        setSampleSize(newSampleSize);
    }, []);

    const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const el = editorRef.current as HTMLElement;
        if (el) {
            el.focus();
            ctrl.onClick(e);
        }
    };
    const cursorY = (cursorPos.y - 1) * sampleSize.y;
    const arLength = cursorPos.x - 1 >= 0 ? cursorPos.x - 1 : 0;
    const cursorSpaces = new Array(arLength).fill(' ').join('');
    return (
        <div className={styles.editor} ref={editorRef}>
            <div className={styles.lineNumbersArea}>
                <pre>{lineNumbers}</pre>
            </div>
            <div
                className={styles.editArea}
                onClick={onClick}
                tabIndex={1}
                onKeyDown={ctrl.handleKeyDown}
            >
                <pre className={styles.cursor} style={{ top: cursorY }} data-type={'cursor'}>
                    {cursorSpaces}
                    <span className={styles.cursorChar} data-type={'cursorChar'}>
                        &#8739;
                    </span>
                </pre>
                <pre className={styles.text} data-type={'text'}>
                    {prettyText}
                </pre>
                <pre className={styles.sampleChar} ref={sampleCharRef}>
                    {' '}
                </pre>
            </div>
        </div>
    );
};

function prettify(
    text: CanonicTextItem[],
    formatIds: boolean,
    formatComments: boolean,
    showLineNumbers: boolean
): React.ReactElement {
    let lineNo = 0;
    let curLineContent = [];
    let lines = [];
    let isComment = false;
    const getIdClassName = () => (formatIds ? (isComment ? 'comment' : 'id') : '');
    const getLimiterClassName = () => (formatComments ? (isComment ? 'comment' : 'limiter') : '');
    text.forEach((token: CanonicTextItem, index: number) => {
        if (token.lineNo > lineNo) {
            if (curLineContent.length > 0) {
                const prevLine = (
                    <p key={lineNo} data-type="p" data-line={lineNo}>
                        {curLineContent}
                    </p>
                );
                lines.push(prevLine);
            }
            curLineContent = [];
            isComment = false;
            lineNo = token.lineNo;
            if (showLineNumbers) {
                curLineContent.push(<span className="line-number" key={0}>{`${lineNo}: `}</span>);
            }
        }
        let formattedLexem = (
            <span key={token.pos} data-type="span" data-line={lineNo}>
                {token.lexem}
            </span>
        );
        if (token.tableId === Table.IDS) {
            formattedLexem = (
                <span
                    key={token.pos}
                    className={getIdClassName()}
                    data-type="span"
                    data-line={lineNo}
                >
                    {token.lexem}
                </span>
            );
        }
        if (token.tableId === Table.STRINGS) {
            formattedLexem = (
                <span
                    key={token.pos}
                    className={getIdClassName()}
                    data-type="span"
                    data-line={lineNo}
                >
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
                <span
                    key={token.pos}
                    className={getLimiterClassName()}
                    data-type="span"
                    data-line={lineNo}
                >
                    {token.lexem}
                </span>
            );
        }
        curLineContent.push(formattedLexem);
    });
    if (curLineContent.length > 0) {
        const prevLine = (
            <p key={lineNo} data-type="p" data-line={lineNo}>
                {curLineContent}
            </p>
        );
        lines.push(prevLine);
    }

    return <section>{lines}</section>;
}

import React from 'react';
import styles from './EditorView.scss';
import { defaultPoint2D, EditorControllerForUI, Point2D } from '@src/editor/EditorController.types';
import { useSelector } from 'react-redux';
import { edSelect } from '@src/store/editorReducer.selectors';

interface EditorViewProps {
    ctrl: EditorControllerForUI;
}

export const EditorView: React.FC<EditorViewProps> = ({ ctrl }) => {
    const rawText = useSelector(edSelect.rawText);
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
                    {rawText}
                </pre>
                <pre className={styles.sampleChar} ref={sampleCharRef}>
                    {' '}
                </pre>
            </div>
        </div>
    );
};

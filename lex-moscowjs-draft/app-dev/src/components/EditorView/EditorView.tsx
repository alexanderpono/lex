import React from 'react';
import styles from './EditorView.scss';
import { defaultPoint2D, EditorControllerForUI, Point2D } from '@src/editor/EditorController.types';
import { useSelector } from 'react-redux';
import { edSelect } from '@src/store/editorReducer.selectors';

interface EditorViewProps {
    ctrl: EditorControllerForUI;
    targetId: string;
}

export const EditorView: React.FC<EditorViewProps> = ({ ctrl, targetId }) => {
    const rawText = useSelector(edSelect.rawText);
    const cursorPos = useSelector(edSelect.cursorPos);
    const [sampleSize, setSampleSize] = React.useState({ ...defaultPoint2D });

    const myHtmlId = `${targetId}-editor`;
    const sampleHtmlId = `${targetId}-sampleChar`;
    const cursorHtmlId = `${targetId}-cursor`;
    const getSampleSize = (): Point2D => {
        const sampleEl = document.getElementById(sampleHtmlId);
        return { x: sampleEl.clientWidth, y: sampleEl.clientHeight };
    };

    React.useEffect(() => {
        const newSampleSize = getSampleSize();
        ctrl.onUIMount(newSampleSize);
        setSampleSize(newSampleSize);
    }, []);
    const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const el = document.getElementById(myHtmlId);
        if (el) {
            el.focus();
            ctrl.onClick(e);
        }
    };
    const cursorY = (cursorPos.y - 1) * sampleSize.y;
    const arLength = cursorPos.x - 1 >= 0 ? cursorPos.x - 1 : 0;
    const cursorSpaces = new Array(arLength).fill(' ').join('');
    return (
        <div
            className={styles.editor}
            id={myHtmlId}
            onClick={onClick}
            tabIndex={1}
            onKeyDown={ctrl.handleKeyDown}
        >
            <pre className={styles.text}>{rawText}</pre>
            <pre className={styles.sampleChar} id={sampleHtmlId}>
                {' '}
            </pre>
            <pre className={styles.cursor} id={cursorHtmlId} style={{ top: cursorY }}>
                {cursorSpaces}
                <span className={styles.cursorChar}>&#8739;</span>
            </pre>
        </div>
    );
};

import { CanonicTextItem } from '@src/app.types';
import { Point2D } from '@src/editor/EditorController.types';

interface RootState {
    editor: {
        rawText: string;
        cursorPos: Point2D;
        tokenList: CanonicTextItem[];
    };
}

export const edSelect = {
    rawText: (state: RootState) => {
        return state.editor.rawText;
    },
    cursorPos: (state: RootState) => {
        return state.editor.cursorPos;
    },
    lineNumbers: (state: RootState): string => {
        const rawText = state.editor.rawText;
        const lines = rawText.split('\n');
        return lines.map((_, index) => index + 1).join('\n');
    },
    tokenList: (state: RootState) => {
        return state.editor.tokenList;
    }
};

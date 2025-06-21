import { Point2D } from '@src/editor/EditorController.types';

interface RootState {
    editor: {
        rawText: string;
        cursorPos: Point2D;
    };
}

export const edSelect = {
    rawText: (state: RootState) => {
        return state.editor.rawText;
    },
    cursorPos: (state: RootState) => {
        return state.editor.cursorPos;
    }
};

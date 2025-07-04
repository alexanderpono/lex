import { getStore } from './store';
import { editor, EditorExternalState } from './editorReducer';
import { EditorState } from '@src/editor/Editor.types';
import { Point2D } from '@src/editor/EditorController.types';
import { CanonicTextItem } from '@src/app.types';

const dispatch = (action) => getStore().dispatch(action);

export class EditorStateManager {
    getEditor = (): EditorExternalState => getStore().getState().editor;
    editor = (editorState: EditorState) => dispatch(editor.editor(editorState));

    rawText = (rawText: string) => dispatch(editor.rawText(rawText));
    cursorPos = (cursorPos: Point2D) => dispatch(editor.cursorPos(cursorPos));
    tokenList = (tokenList: CanonicTextItem[]) => dispatch(editor.tokenList(tokenList));

    static create(): EditorStateManager {
        return new EditorStateManager();
    }
}

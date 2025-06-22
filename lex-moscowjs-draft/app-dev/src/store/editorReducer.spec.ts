import { getFromState, getVal, num, rndAr, rndSize, str } from '@src/testFramework';
import {
    defaultEditorExternalState,
    editor,
    EditorEvent,
    editorReducer,
    EditorExternalState
} from './editorReducer';
import { defaultEditorState } from '@src/editor/Editor.types';
import { defaultPoint2D } from '@src/editor/EditorController.types';
import { CanonicTextItem, defaultCanonicTextItem } from '@src/app.types';
describe('editorReducer', () => {
    const rndStr = str();
    const rndEditor = { ...defaultEditorState };
    const rndCursorPos = { ...defaultPoint2D, x: num() };
    const rndTokenList = rndAr(rndSize(1, 3), () => ({
        ...defaultCanonicTextItem,
        tableIndex: num()
    })) as CanonicTextItem[];

    test.each`
        actions                             | testName                                               | event                     | stateSelector  | value
        ${[editor.editor(rndEditor)]}       | ${'sets .editor for EditorEvent.EDITOR action'}        | ${EditorEvent.EDITOR}     | ${'editor'}    | ${rndEditor}
        ${[editor.rawText(rndStr)]}         | ${'sets .rawText for EditorEvent.RAW_TEXT action'}     | ${EditorEvent.RAW_TEXT}   | ${'rawText'}   | ${rndStr}
        ${[editor.cursorPos(rndCursorPos)]} | ${'sets .cursorPos for EditorEvent.CURSOR_POS action'} | ${EditorEvent.CURSOR_POS} | ${'cursorPos'} | ${rndCursorPos}
        ${[editor.tokenList(rndTokenList)]} | ${'sets .tokenList for EditorEvent.TOKEN_LIST action'} | ${EditorEvent.TOKEN_LIST} | ${'tokenList'} | ${rndTokenList}
    `('$testName', async ({ actions, event, stateSelector, value }) => {
        let state: EditorExternalState = { ...defaultEditorExternalState };
        actions.forEach((action) => {
            state = editorReducer(state, action);
        });
        expect(state.event).toEqual(event);
        if (stateSelector !== null) {
            expect(getFromState(state, stateSelector)).toEqual(getVal(actions, value));
        }
    });
});

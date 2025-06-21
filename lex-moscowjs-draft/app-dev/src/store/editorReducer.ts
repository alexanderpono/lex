import { defaultEditorState, EditorState } from '@src/editor/Editor.types';
import { defaultPoint2D, Point2D } from '@src/editor/EditorController.types';
import { handleActions } from 'redux-actions';

export enum EditorEvent {
    DEFAULT = '',
    EDITOR = 'EDITOR/EDITOR',
    RAW_TEXT = 'EDITOR/RAW_TEXT',
    CURSOR_POS = 'EDITOR/CURSOR_POS'
}

export interface EditorExternalState {
    event: EditorEvent;
    editor: EditorState;
    rawText: string;
    cursorPos: Point2D;
}

export const defaultEditorExternalState: EditorExternalState = {
    event: EditorEvent.DEFAULT,
    editor: defaultEditorState,
    rawText: '',
    cursorPos: defaultPoint2D
};

export interface EditorAction {
    type: EditorEvent.EDITOR;
    payload: {
        editor: EditorState;
    };
}

export interface RawTextAction {
    type: EditorEvent.RAW_TEXT;
    payload: {
        rawText: string;
    };
}

export interface CursorPosAction {
    type: EditorEvent.CURSOR_POS;
    payload: {
        cursorPos: Point2D;
    };
}

export const editor = {
    editor: (editor: EditorState): EditorAction => ({
        type: EditorEvent.EDITOR,
        payload: { editor }
    }),
    rawText: (rawText: string): RawTextAction => ({
        type: EditorEvent.RAW_TEXT,
        payload: { rawText }
    }),
    cursorPos: (cursorPos: Point2D): CursorPosAction => ({
        type: EditorEvent.CURSOR_POS,
        payload: { cursorPos }
    })
};

export const editorReducer = handleActions(
    {
        [EditorEvent.EDITOR]: (state: EditorExternalState, action) => ({
            ...state,
            event: EditorEvent.EDITOR,
            editor: (action as unknown as EditorAction).payload.editor
        }),
        [EditorEvent.RAW_TEXT]: (state: EditorExternalState, action) => ({
            ...state,
            event: EditorEvent.RAW_TEXT,
            rawText: (action as unknown as RawTextAction).payload.rawText
        }),
        [EditorEvent.CURSOR_POS]: (state: EditorExternalState, action) => ({
            ...state,
            event: EditorEvent.CURSOR_POS,
            cursorPos: (action as unknown as CursorPosAction).payload.cursorPos
        })
    },
    defaultEditorExternalState
);

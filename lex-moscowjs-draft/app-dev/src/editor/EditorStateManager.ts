import { defaultEditorState, EditorState } from './Editor.types';

export class EditorStateManager {
    private state: EditorState;

    constructor() {
        this.state = { ...defaultEditorState };
    }

    getState = () => this.state;
}

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { defaultPoint2D, EditorControllerForUI, Point2D } from './EditorController.types';
// import { EditorStateManager } from './EditorStateManager';
import { getStore } from '@src/store/store';
import { EditorView } from '@src/components/EditorView/EditorView';
import { EditorStateManager } from '@src/store/EditorStateManager';

enum State {
    DEFAULT = '',
    WORK = 'WORK',
    ANY = '*'
}
type SttRecord = [State, string, string, State];
const STATE = 0;
const EVENT = 1;
const HANDLER = 2;
const NEW_STATE = 3;

export class EditorController implements EditorControllerForUI {
    private state: State = State.WORK;
    private STT: SttRecord[] = [
        [State.WORK, 'Enter', 'handleKbEnter', State.WORK],
        [State.WORK, 'Backspace', 'handleKbBackspace', State.WORK]
    ];
    private sampleSize: Point2D = { ...defaultPoint2D };

    constructor(private editorTargetId: string, private showEditor: boolean) {}

    findSttRecord = (eventName: string): number => {
        const index = this.STT.findIndex((rule: SttRecord) => {
            return rule[STATE] === this.state && rule[EVENT] === eventName;
        });
        return index;
    };

    run = () => {
        console.log('EditorController::run()');

        console.log('EditorController::run() editorTargetId=', this.editorTargetId);
        const rawText = this.getStoreLocal();
        EditorStateManager.create().rawText(rawText);
        this.render();
    };

    render = () => {
        const target = document.getElementById(this.editorTargetId);
        if (!target) {
            console.error('target not found:', this.editorTargetId);
            return;
        }
        render(
            <Provider store={getStore()}>
                {this.showEditor && (
                    <section>
                        <EditorView
                            ctrl={this}
                            // editorState={editorState}
                            targetId={this.editorTargetId}
                        />
                    </section>
                )}
            </Provider>,
            target
        );
        return this;
    };

    storeLocal = (rawText: string) => {
        const key = `${this.editorTargetId}-rawText`;
        localStorage.setItem(key, rawText);
    };

    getStoreLocal = (): string => {
        const key = `${this.editorTargetId}-rawText`;
        const result = localStorage.getItem(key);
        return result ? result : '';
    };

    isPrintable = (keyCode: number): boolean => {
        return (
            // keyCode === 13 ||
            keyCode === 32 ||
            (keyCode >= 48 && keyCode <= 90) ||
            (keyCode >= 48 && keyCode <= 90) ||
            (keyCode >= 106 && keyCode <= 111) ||
            (keyCode >= 186 && keyCode <= 222)
        );
    };

    handleKeyDown = (e) => {
        console.log(`Нажата клавиша: ${e.key}`, e.keyCode);
        const rawText = EditorStateManager.create().getEditor().rawText;
        console.log('keyDown() rawText=', rawText);

        const isPrintable = this.isPrintable(e.keyCode);
        if (isPrintable) {
            const newText = `${rawText}${e.key}`;
            EditorStateManager.create().rawText(newText);
            this.storeLocal(newText);
        } else {
            const recordIndex = this.findSttRecord(e.key);
            console.log('recordIndex=', recordIndex);
            if (recordIndex >= 0) {
                const sttRecord = this.STT[recordIndex];
                this[sttRecord[HANDLER]](sttRecord, e);
                this.state = sttRecord[NEW_STATE];
            }
        }
    };

    handleKbEnter = (sttRecord: SttRecord, e) => {
        console.log('handleKbEnter() sttRecord, e=', sttRecord, e);
        const rawText = EditorStateManager.create().getEditor().rawText;
        const newText = `${rawText}\n`;
        EditorStateManager.create().rawText(newText);
        this.storeLocal(newText);
    };

    handleKbBackspace = (sttRecord: SttRecord, e) => {
        console.log('handleKbBackspace() sttRecord, e=', sttRecord, e);
        const rawText = EditorStateManager.create().getEditor().rawText;
        const newText = rawText
            .split('')
            .slice(0, rawText.length - 1)
            .join('');
        EditorStateManager.create().rawText(newText);
        this.storeLocal(newText);
    };

    getMaxCursorPosFromText = (): Point2D => {
        const rawText = EditorStateManager.create().getEditor().rawText;
        const lines = rawText.split('\n');
        const maxY = lines.length;
        const lastLine = lines.length > 1 ? lines[lines.length - 1] : [];
        const maxX = lastLine.length + 1;

        return { x: maxX, y: maxY };
    };

    onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const xFloat = e.clientX / this.sampleSize.x;
        const yFloat = e.clientY / this.sampleSize.y;
        const maxCursorPos = this.getMaxCursorPosFromText();
        let newCursorPos = { x: Math.round(xFloat), y: Math.round(yFloat) };
        if (newCursorPos.y > maxCursorPos.y) {
            newCursorPos = { ...maxCursorPos };
        } else {
            const rawText = EditorStateManager.create().getEditor().rawText;
            const lines = rawText.split('\n');
            const curLine = lines[newCursorPos.y - 1];
            if (newCursorPos.x > curLine.length) {
                newCursorPos.x = curLine.length + 1;
            }
        }
        EditorStateManager.create().cursorPos(newCursorPos);
    };

    onUIMount = (sampleSize: Point2D) => {
        this.sampleSize = sampleSize;
        EditorStateManager.create().cursorPos({ x: 1, y: 1 });
    };
}

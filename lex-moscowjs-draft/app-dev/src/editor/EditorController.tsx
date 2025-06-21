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
    private editorStateManager: EditorStateManager = null;

    constructor(private editorTargetId: string, private showEditor: boolean) {
        this.editorStateManager = EditorStateManager.create();
    }

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
        this.editorStateManager.rawText(rawText);
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
                        <EditorView ctrl={this} targetId={this.editorTargetId} />
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
        const rawText = this.editorStateManager.getEditor().rawText;
        console.log('keyDown() rawText=', rawText);

        const isPrintable = this.isPrintable(e.keyCode);
        if (isPrintable) {
            const insertPos = this.editorStateManager.getEditor().cursorPos;
            const newText = this.insertCharAtPosition(rawText, insertPos, e.key);
            this.editorStateManager.rawText(newText);
            const newCursorPos = { ...insertPos, x: insertPos.x + 1 };
            this.editorStateManager.cursorPos(newCursorPos);
            this.storeLocal(newText);
        } else {
            const recordIndex = this.findSttRecord(e.key);
            if (recordIndex >= 0) {
                const sttRecord = this.STT[recordIndex];
                this[sttRecord[HANDLER]](sttRecord, e);
                this.state = sttRecord[NEW_STATE];
            }
        }
    };

    handleKbEnter = (sttRecord: SttRecord, e) => {
        const rawText = this.editorStateManager.getEditor().rawText;
        const insertPos = this.editorStateManager.getEditor().cursorPos;
        const newText = this.insertCharAtPosition(rawText, insertPos, '\n');
        const newCursorPos = { x: 1, y: insertPos.y + 1 };
        this.editorStateManager.cursorPos(newCursorPos);
        this.editorStateManager.rawText(newText);
        this.storeLocal(newText);
    };

    insertCharAtPosition = (text: string, insertPos: Point2D, char: string): string => {
        const lines = text.split('\n');
        const curLine = lines[insertPos.y - 1];
        const newLine =
            curLine.substring(0, insertPos.x - 1) + char + curLine.substring(insertPos.x - 1);
        lines[insertPos.y - 1] = newLine;
        const newText = lines.join('\n');
        return newText;
    };

    removeCharAtPrevPosition = (text: string, pos: Point2D): string => {
        let lines = text.split('\n');
        const curLine = lines[pos.y - 1];
        let newLine = curLine;
        if (pos.x >= 2) {
            newLine = curLine.substring(0, pos.x - 2) + curLine.substring(pos.x - 1);
            lines[pos.y - 1] = newLine;
        } else if (pos.y > 1) {
            const prevLine = lines[pos.y - 2];
            const newPrevLine = prevLine + curLine.substring(pos.x - 1);
            lines[pos.y - 2] = newPrevLine;
            lines = [...lines.slice(0, pos.y - 1), ...lines.slice(pos.y)];
        }
        const newText = lines.join('\n');
        return newText;
    };

    getPrevPos = (text: string, pos: Point2D): Point2D => {
        if (pos.x >= 2) {
            return { ...pos, x: pos.x - 1 };
        } else if (pos.y > 1) {
            let lines = text.split('\n');
            const prevLine = lines[pos.y - 2];
            return { x: prevLine.length + 1, y: pos.y - 1 };
        }
        return pos;
    };

    handleKbBackspace = (sttRecord: SttRecord, e) => {
        const rawText = this.editorStateManager.getEditor().rawText;
        const pos = this.editorStateManager.getEditor().cursorPos;
        const newText = this.removeCharAtPrevPosition(rawText, pos);
        const newCursorPos = this.getPrevPos(rawText, pos); //{ x: pos.x - 1, y: pos.y };
        this.editorStateManager.rawText(newText);
        this.editorStateManager.cursorPos(newCursorPos);
        this.storeLocal(newText);
    };

    getMaxCursorPosFromText = (): Point2D => {
        const rawText = this.editorStateManager.getEditor().rawText;
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
            const rawText = this.editorStateManager.getEditor().rawText;
            const lines = rawText.split('\n');
            const curLine = lines[newCursorPos.y - 1];
            if (newCursorPos.x > curLine.length) {
                newCursorPos.x = curLine.length + 1;
            }
        }
        this.editorStateManager.cursorPos(newCursorPos);
    };

    onUIMount = (sampleSize: Point2D) => {
        this.sampleSize = sampleSize;
        this.editorStateManager.cursorPos({ x: 1, y: 1 });
    };
}

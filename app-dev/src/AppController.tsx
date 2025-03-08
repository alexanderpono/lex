import React from 'react';
import { render } from 'react-dom';
import { AppStateManager } from './AppStateManager';
import { AppControllerBuilder } from './AppControllerBuilder';
import { LexView } from './components/LexView';
import { CanonicTextItem, CompiledLine, defaultCompiledLine, IndexData, Table } from './app.types';
import { SimControls } from './components/SimControls';

const NOT_FOUND = 10000;

export class AppController {
    constructor(private builder: AppControllerBuilder, private stateManager: AppStateManager) {}

    run = () => {
        this.stateManager.setStepNo(this.builder.maxCalcStep);
        this.stateManager.setLimiters(this.builder.limiters);
        this.stateManager.setSpaces(this.builder.spaces);
        this.compile();
        this.reRun();
        this.updateUI();
    };

    renderControls = () => {
        const target = document.getElementById(this.builder.simControlsTarget);
        if (!target) {
            console.error('target not found:', this.builder.simControlsTarget);
            return;
        }
        render(<SimControls ctrl={this} maxCalcStep={this.stateManager.getStepNo()} />, target);
        return this;
    };

    reRun = () => {
        this.stateManager.setInputString(this.builder.inputString);
        this.stateManager.setIds([]);
        this.stateManager.setLineNo(0);
        this.stateManager.setCurrentPosInLine(0);
        this.stateManager.setText([]);

        this.parseText(this.stateManager.getInputString());
        if (this.stateManager.getInputString() === '') {
            console.log('lex parse OK', this.stateManager.getStepNo());
        }
    };

    onBtToStartClick = () => {
        this.stateManager.setStepNo(0);
        this.reRun();
        this.updateUI();
    };

    updateUI = () => {
        if (this.builder.showSimControls) {
            this.renderControls();
        }
        this.stateManager.mirrorState();
        this.render();
    };

    onBtPrevClick = () => {
        this.stateManager.setStepNo(this.stateManager.getStepNo() - 1);
        this.reRun();
        this.updateUI();
    };

    onBtNextClick = () => {
        this.stateManager.setStepNo(this.stateManager.getStepNo() + 1);
        this.reRun();
        this.updateUI();
    };

    onBtNextJumpClick = () => {
        this.stateManager.setStepNo(this.stateManager.getStepNo() + 10);
        this.reRun();
        this.updateUI();
    };

    onBtToFinishClick = () => {
        this.stateManager.setStepNo(this.builder.endCalcStep);
        this.reRun();
        this.updateUI();
    };

    onMaxStepChange = (evt) => {
        this.stateManager.setStepNo(parseInt(evt.target.value));
        this.reRun();
        this.updateUI();
    };

    render = () => {
        const target = document.getElementById(this.builder.target);
        if (!target) {
            console.error('target not found:', this.builder.target);
            return;
        }
        render(
            <LexView
                inputString={this.stateManager.getInputString()}
                limiters={this.stateManager.getLimiters()}
                spaces={this.stateManager.getSpaces()}
                ids={this.stateManager.getIds()}
                text={this.stateManager.getText()}
                showInputFile={this.builder.showInputFile}
                showPrettyText={this.builder.showPrettyText}
                showLimitersTable={this.builder.showLimitersTable}
                showSpacesTable={this.builder.showSpacesTable}
                showIdsTable={this.builder.showIdsTable}
                showCanonicText={this.builder.showCanonicText}
                formatIds={this.builder.formatIds}
                formatComments={this.builder.formatComments}
            />,
            target
        );
        return this;
    };

    compile = () => {
        const limiters = this.stateManager.getLimiters();
        const spaces = this.stateManager.getSpaces();

        let compiled: CompiledLine[] = [];
        compiled = [
            ...limiters.map(
                (lexem: string, index: number): CompiledLine => ({
                    tableId: Table.LIMITERS,
                    tableIndex: index,
                    lexem
                })
            ),
            ...spaces.map(
                (lexem: string, index: number): CompiledLine => ({
                    tableId: Table.SPACES,
                    tableIndex: index,
                    lexem
                })
            )
        ];
        this.stateManager.setCompiled(compiled);
        return this;
    };

    addIdToText = (
        newId: string,
        lineNo: number,
        currentPosInLine: number,
        text: CanonicTextItem[]
    ): CanonicTextItem[] => {
        let idsTable = this.stateManager.getIds();
        const posInIds = idsTable.findIndex((id: string) => id === newId);
        let newTextItem: CanonicTextItem = {
            tableId: Table.IDS,
            tableIndex: posInIds,
            lineNo,
            pos: currentPosInLine,
            lexem: newId
        };
        if (posInIds < 0) {
            idsTable = [...idsTable, newId];
            newTextItem.tableIndex = idsTable.length - 1;
        }
        this.stateManager.setIds(idsTable);
        return [...text, newTextItem];
    };

    addLimiterOrSpaceToText = (
        indexData: IndexData,
        lineNo: number,
        currentPosInLine: number,
        text: CanonicTextItem[]
    ) => {
        const newTextItem: CanonicTextItem = {
            tableId: indexData.lexem.tableId,
            tableIndex: indexData.lexem.tableIndex,
            lineNo,
            pos: currentPosInLine,
            lexem: indexData.lexem.lexem
        };
        return [...text, newTextItem];
    };

    getIndex = (s: string, compiled: CompiledLine[]): IndexData => {
        let bestIndex = NOT_FOUND;
        let bestCompiledLine = defaultCompiledLine;
        compiled.forEach((line: CompiledLine) => {
            const index = s.indexOf(line.lexem);
            if (index >= 0) {
                if (index < bestIndex) {
                    bestIndex = index;
                    bestCompiledLine = line;
                }
            }
        });

        return { pos: bestIndex, lexem: bestCompiledLine };
    };

    parseText = (srcText: string) => {
        let buf = srcText;

        let iter = 0;
        const MAX_ITER = this.stateManager.getStepNo();
        let currentPosInLine = 1;
        let text: CanonicTextItem[] = [];
        let lineNo = 1;

        const compiled = this.stateManager.getCompiled();

        while (buf.length > 0 && iter < MAX_ITER) {
            const indexData = this.getIndex(buf, compiled);
            if (indexData.pos !== NOT_FOUND) {
                const limiterOrSpaceNotInBufStart = indexData.pos > 0;
                if (limiterOrSpaceNotInBufStart) {
                    const newId = buf.substring(0, indexData.pos);
                    text = this.addIdToText(newId, lineNo, currentPosInLine, text);
                    currentPosInLine += newId.length;
                    buf = buf.substring(indexData.pos);
                } else {
                    text = this.addLimiterOrSpaceToText(indexData, lineNo, currentPosInLine, text);
                    currentPosInLine += indexData.lexem.lexem.length;
                    buf = buf.substring(indexData.lexem.lexem.length);
                    if (indexData.lexem.lexem === '\n') {
                        lineNo++;
                        currentPosInLine = 1;
                    }
                }
            } else {
                text = this.addIdToText(buf, lineNo, currentPosInLine, text);
                buf = '';
            }
            iter++;
        }

        this.stateManager.setInputString(buf);
        this.stateManager.setText(text);
        this.stateManager.setLineNo(lineNo);
        this.stateManager.setCurrentPosInLine(currentPosInLine);
    };
}

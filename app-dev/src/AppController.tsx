import React from 'react';
import { render } from 'react-dom';
import { AppStateManager } from './AppStateManager';
import { AppControllerBuilder } from './AppControllerBuilder';
import { LexView } from './components/LexView';
import { CompiledLine, Table } from './app.types';
import { SimControls } from './components/SimControls';

export class AppController {
    constructor(private builder: AppControllerBuilder, private stateManager: AppStateManager) {}

    run = () => {
        this.stateManager.setStepNo(this.builder.maxCalcStep);
        this.stateManager.setLimiters(this.builder.limiters);
        this.stateManager.setSpaces(this.builder.spaces);
        this.stateManager.setInputString(this.builder.inputString);
        this.compile();
        // this.runToStep(this.builder.maxCalcStep);
        if (this.builder.showSimControls) {
            this.renderControls();
        }
        this.stateManager.mirrorState();
        this.render();
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

    onBtToStartClick = () => {};

    onBtPrevClick = () => {};

    onBtNextClick = () => {};

    onBtNextJumpClick = () => {};

    onBtToFinishClick = () => {};

    onMaxStepChange = (evt) => {};

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
            />,
            target
        );
        return this;
    };

    compile = () => {
        const limiters = this.stateManager.getLimiters();
        const spaces = this.stateManager.getSpaces();

        console.log('state=', this.stateManager.getAppState());
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
}

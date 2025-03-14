import React from 'react';
import { render } from 'react-dom';
import { AppStateManager } from './AppStateManager';
import { AppControllerBuilder } from './AppControllerBuilder';
import { LexView } from './components/LexView';
import { SimControls } from './components/SimControls';

export class AppController {
    constructor(private builder: AppControllerBuilder, private stateManager: AppStateManager) {}

    run = () => {
        this.stateManager.setStepNo(this.builder.maxCalcStep);
        this.stateManager.setLimiters(this.builder.limiters);
        this.stateManager.setSpaces(this.builder.spaces);
        this.builder.lex.compile();
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
        this.stateManager.setStrings([]);

        let usedIterations = this.builder.lex.parseText(this.stateManager.getInputString());
        if (this.stateManager.getInputString() === '') {
            console.log('lex parse OK', this.stateManager.getStepNo(), usedIterations);
            if (usedIterations < this.stateManager.getStepNo()) {
                console.log('to buildStrings()');
                this.builder.lex.buildStrings();
                usedIterations++;
                console.log('after buildStrings() usedIterations=', usedIterations);
            }
            if (usedIterations < this.stateManager.getStepNo()) {
                console.log('to removeComments()');
                this.builder.lex.removeComments();
                usedIterations++;
                console.log('after removeComments() usedIterations=', usedIterations);
            }
            if (usedIterations < this.stateManager.getStepNo()) {
                console.log('to removeWhitespace()');
                this.builder.lex.removeWhitespace();
                usedIterations++;
                console.log('after removeWhitespace() usedIterations=', usedIterations);
            }
            if (usedIterations < this.stateManager.getStepNo()) {
                console.log('to syntax()');
                this.builder.syntax.analyzeSyntax();
                usedIterations++;
                console.log('after analyzeSyntax() usedIterations=', usedIterations);
            }
            if (usedIterations < this.stateManager.getStepNo()) {
                console.log('to executeScript()');
                this.builder.interpreter.executeScript();
                usedIterations++;
                console.log('after executeScript() usedIterations=', usedIterations);
            }
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
                showLineNumbers={this.builder.showLineNumbers}
                strings={this.stateManager.getStrings()}
                showStringsTable={this.builder.showStringsTable}
                showText={this.builder.showText}
                program={this.stateManager.getProgram()}
                showProgram={this.builder.showProgram}
                showConsole={this.builder.showConsole}
                consoleText={this.stateManager.getConsoleText()}
            />,
            target
        );
        return this;
    };
}

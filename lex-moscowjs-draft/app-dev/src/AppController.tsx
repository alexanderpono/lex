import React from 'react';
import { render } from 'react-dom';
import { AppStateManager } from './AppStateManager';
import { AppControllerBuilder } from './AppControllerBuilder';
import { LexView } from './components/LexView';
import { SimControls } from './components/SimControls';
import { defaultSyntaxAnalyzeState, Show } from './app.types';

export class AppController {
    constructor(private builder: AppControllerBuilder, private stateManager: AppStateManager) {}

    run = () => {
        this.builder.editorController.run();
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
        this.stateManager.setProgram({ ...defaultSyntaxAnalyzeState });
        this.stateManager.setConsoleText('');

        const isDebug = (this.builder.show & Show.debugInfo) > 0;
        let usedIterations = this.builder.lex.parseText(this.stateManager.getInputString());
        if (this.stateManager.getInputString() === '') {
            isDebug && console.log('lex parse OK', this.stateManager.getStepNo(), usedIterations);
            if (usedIterations < this.stateManager.getStepNo()) {
                isDebug && console.log('to buildStrings()');
                this.builder.lex.buildStrings();
                usedIterations++;
                isDebug && console.log('after buildStrings() usedIterations=', usedIterations);
            }
            if (usedIterations < this.stateManager.getStepNo()) {
                isDebug && console.log('to removeComments()');
                this.builder.lex.removeComments();
                usedIterations++;
                isDebug && console.log('after removeComments() usedIterations=', usedIterations);
            }
            if (usedIterations < this.stateManager.getStepNo()) {
                isDebug && console.log('to removeWhitespace()');
                this.builder.lex.removeWhitespace();
                usedIterations++;
                isDebug && console.log('after removeWhitespace() usedIterations=', usedIterations);
            }
            isDebug && console.log('text=', JSON.stringify(this.stateManager.getText()));
            isDebug && console.log('ids=', JSON.stringify(this.stateManager.getIds()));
            isDebug && console.log('strings=', JSON.stringify(this.stateManager.getStrings()));
            if (usedIterations < this.stateManager.getStepNo()) {
                isDebug && console.log('to syntax()');
                this.builder.syntax.analyzeSyntax();
                usedIterations++;
                isDebug && console.log('after analyzeSyntax() usedIterations=', usedIterations);
            }
            if (usedIterations < this.stateManager.getStepNo()) {
                isDebug && console.log('to executeScript()');
                this.builder.interpreter.executeScript();
                usedIterations++;
                isDebug && console.log('after executeScript() usedIterations=', usedIterations);
            }
        }
    };

    onBtToStartClick = () => {
        this.stateManager.setStepNo(0);
        this.reRun();
        this.updateUI();
    };

    updateUI = () => {
        if ((this.builder.show & Show.simControls) > 0) {
            this.renderControls();
        }
        this.stateManager.mirrorState();
        if (this.builder.target) {
            this.render();
        }
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
                formatIds={this.builder.formatIds}
                formatComments={this.builder.formatComments}
                strings={this.stateManager.getStrings()}
                program={this.stateManager.getProgram()}
                consoleText={this.stateManager.getConsoleText()}
                show={this.builder.show}
                targetId={this.builder.target}
            />,
            target
        );
        return this;
    };
}

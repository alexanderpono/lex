import { ISyntax, Show } from './app.types';
import { Interpreter } from './app/Interpreter';
import { LexAnalyzer } from './app/LexAnalyzer';

export type ObjectsState = Record<string, object>;

export class AppControllerBuilder {
    target: string = '';
    simControlsTarget: string = '';
    startState: ObjectsState;
    maxCalcStep: number = 0;
    spaces: string[] = [];
    limiters: string[] = [];
    inputString: string = '';
    endCalcStep: number = 0;
    formatIds: boolean = false;
    formatComments: boolean = false;
    syntax: ISyntax = null;
    lex: LexAnalyzer = null;
    interpreter: Interpreter = null;
    show: Show = Show.default;

    setTarget = (target: string) => {
        this.target = target;
        return this;
    };
    setSimControlsTarget = (simControlsTarget: string) => {
        this.simControlsTarget = simControlsTarget;
        return this;
    };
    setStartState = (startState: ObjectsState) => {
        this.startState = startState;
        return this;
    };
    setMaxCalcStep = (maxCalcStep: number) => {
        this.maxCalcStep = maxCalcStep;
        return this;
    };
    setSpaces = (spaces: string[]) => {
        this.spaces = spaces;
        return this;
    };
    setLimiters = (limiters: string[]) => {
        this.limiters = limiters;
        return this;
    };
    setInputString = (inputString: string) => {
        this.inputString = inputString;
        return this;
    };
    setEndCalcStep = (endCalcStep: number) => {
        this.endCalcStep = endCalcStep;
        return this;
    };
    setFormatIds = (formatIds: boolean) => {
        this.formatIds = formatIds;
        return this;
    };
    setFormatComments = (formatComments: boolean) => {
        this.formatComments = formatComments;
        return this;
    };
    setSyntax = (syntax: ISyntax) => {
        this.syntax = syntax;
        return this;
    };
    setLex = (lex: LexAnalyzer) => {
        this.lex = lex;
        return this;
    };
    setInterpreter = (interpreter: Interpreter) => {
        this.interpreter = interpreter;
        return this;
    };
    setShow = (show: Show) => {
        this.show = show;
        return this;
    };
}

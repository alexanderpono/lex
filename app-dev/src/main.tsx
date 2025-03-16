import { AppFactory } from './AppFactory';
import { AppController } from './AppController';
import { AppControllerBuilder } from './AppControllerBuilder';
import { SyntaxAnalyzer } from './app/SyntaxAnalyzer';
import { LexAnalyzer } from './app/LexAnalyzer';
import { Interpreter } from './app/Interpreter';
import { Language2SyntaxAnalyzer } from './app/Language2SyntaxAnalyzer';

console.log('main!');

const factory = AppFactory.create();

interface AppConfig {
    name: string;
    target: string;
    simControlsTarget: string;
    showSimControls: boolean;
    spaces: string[];
    limiters: string[];
    maxCalcStep: number;
    inputString: string;
    endCalcStep: number;
    showInputFile: boolean;
    showPrettyText: boolean;
    showLimitersTable: boolean;
    showSpacesTable: boolean;
    showIdsTable: boolean;
    showCanonicText: boolean;
    formatIds: boolean;
    formatComments: boolean;
    showLineNumbers: boolean;
    showStringsTable: boolean;
    showText: boolean;
    showProgram: boolean;
    showConsole: boolean;
}

const defaultAppConfig: AppConfig = {
    name: '',
    target: '',
    simControlsTarget: '',
    showSimControls: false,
    spaces: [],
    limiters: [],
    maxCalcStep: 0,
    endCalcStep: 1000,
    inputString: '',
    showInputFile: false,
    showPrettyText: false,
    showLimitersTable: false,
    showSpacesTable: false,
    showIdsTable: false,
    showCanonicText: false,
    formatIds: false,
    formatComments: false,
    showLineNumbers: false,
    showStringsTable: false,
    showText: false,
    showProgram: false,
    showConsole: false
};

class LexRunner {
    private slides: AppController[] = [];

    private _run = (config: AppConfig) => {
        const stateManager = factory.getStateManager(config.name);
        stateManager.mirrorState();

        this.slides[config.name] = new AppController(
            new AppControllerBuilder()
                .setTarget(config.target)
                .setSimControlsTarget(config.simControlsTarget)
                .setShowSimControls(config.showSimControls)
                .setSpaces(config.spaces)
                .setLimiters(config.limiters)
                .setInputString(config.inputString)
                .setEndCalcStep(config.endCalcStep)
                .setShowInputFile(config.showInputFile)
                .setShowPrettyText(config.showPrettyText)
                .setShowLimitersTable(config.showLimitersTable)
                .setShowSpacesTable(config.showSpacesTable)
                .setShowIdsTable(config.showIdsTable)
                .setShowCanonicText(config.showCanonicText)
                .setFormatIds(config.formatIds)
                .setFormatComments(config.formatComments)
                .setShowLineNumbers(config.showLineNumbers)
                .setShowStringsTable(config.showStringsTable)
                .setShowText(config.showText)
                .setShowProgram(config.showProgram)
                .setMaxCalcStep(config.maxCalcStep)
                .setShowConsole(config.showConsole)
                .setSyntax(new Language2SyntaxAnalyzer(stateManager))
                .setInterpreter(new Interpreter(stateManager))
                .setLex(new LexAnalyzer(stateManager)),
            stateManager
        );

        this.slides[config.name].run();
    };
    public get run() {
        return this._run;
    }
    public set run(value) {
        this._run = value;
    }
}

const lex = new LexRunner();
window['lex'] = lex;
if (window['demo'] === true) {
    console.log('demo === true!');
} else {
    console.log('demo !== true!');
    lex.run({
        ...defaultAppConfig,
        name: 'rs',
        target: 'viewport',
        simControlsTarget: 'controls',
        showSimControls: true,
        maxCalcStep: 12,
        endCalcStep: 12,
        spaces: [' ', '\n'],
        limiters: [';', '=', '/', "'", '(', ')', '+', '-', '*'],
        inputString: "log(22+1);",
        // showInputFile: true,
        // showPrettyText: true,
        // showLimitersTable: true,
        showSpacesTable: false,
        // showIdsTable: true,
        showCanonicText: true,
        formatIds: true,
        formatComments: true,
        // showLineNumbers: true,
        // showStringsTable: true,
        showText: true,
        showProgram: true,
        showConsole: true
    });
}

import { AppFactory } from './AppFactory';
import { AppController } from './AppController';
import { AppControllerBuilder } from './AppControllerBuilder';
import { LexAnalyzer } from './app/LexAnalyzer';
import { Interpreter } from './app/Interpreter';
import { Language2SyntaxAnalyzer } from './app/Language2SyntaxAnalyzer';
import { Show } from './app.types';
import { EditorController } from './editor/EditorController';

console.log('main!');

const factory = AppFactory.create();

interface AppConfig {
    name: string;
    target: string;
    simControlsTarget: string;
    editorTarget: string;
    spaces: string[];
    limiters: string[];
    maxCalcStep: number;
    inputString: string;
    endCalcStep: number;
    formatIds: boolean;
    formatComments: boolean;
    show: Show;
}

const defaultAppConfig: AppConfig = {
    name: '',
    target: '',
    simControlsTarget: '',
    editorTarget: '',
    spaces: [],
    limiters: [],
    maxCalcStep: 0,
    endCalcStep: 1000,
    inputString: '',
    formatIds: false,
    formatComments: false,
    show: Show.default
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
                .setEditorTarget(config.editorTarget)
                .setSpaces(config.spaces)
                .setLimiters(config.limiters)
                .setInputString(config.inputString)
                .setEndCalcStep(config.endCalcStep)
                .setFormatIds(config.formatIds)
                .setFormatComments(config.formatComments)
                .setMaxCalcStep(config.maxCalcStep)
                .setShow(config.show)
                .setSyntax(
                    new Language2SyntaxAnalyzer(stateManager, (config.show & Show.debugInfo) > 0)
                )
                .setInterpreter(new Interpreter(stateManager, (config.show & Show.debugInfo) > 0))
                .setLex(new LexAnalyzer(stateManager))
                .setEditorController(
                    new EditorController(config.editorTarget, (config.show & Show.editor) > 0)
                ),
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
        editorTarget: 'editor',
        maxCalcStep: 0,
        endCalcStep: 16,
        spaces: [' ', '\n'],
        limiters: [';', '=', '/', "'", '(', ')', '+', '-', '*'],
        inputString: 'print(22);',
        // inputString: 'log((1+2)*3);',
        // inputString: 'log((1+2));',

        // inputString: "log('Hello world');",
        formatIds: true,
        formatComments: true,
        // showLineNumbers: true,
        show:
            // Show.simControls |
            // Show.canonicText |
            // Show.stringsTable |
            // Show.text |
            // Show.inputFile |
            // Show.program |
            // Show.console |
            Show.debugInfo | Show.editor
        // Show.prettyText
        // Show.mathTree
    });
}

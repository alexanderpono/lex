import { AppFactory } from './AppFactory';
import { AppController } from './AppController';
import { AppControllerBuilder } from './AppControllerBuilder';

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
    showStringsTable: false
};

class LexRunner {
    private slides: AppController[] = [];

    run = (config: AppConfig) => {
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
                .setMaxCalcStep(config.maxCalcStep),
            stateManager
        );

        this.slides[config.name].run();
    };
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
        maxCalcStep: 38,
        endCalcStep: 38,
        spaces: [' ', '\n'],
        limiters: [';', '=', '/', "'"],
        inputString: "let a = 2 / 1;\n//let b = 3;\nlet b = 'Hello world';",
        // showInputFile: true,
        showPrettyText: true,
        // showLimitersTable: true,
        showSpacesTable: false,
        showIdsTable: true,
        showCanonicText: true,
        formatIds: true,
        formatComments: true,
        showLineNumbers: true,
        showStringsTable: true
    });
}

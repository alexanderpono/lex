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
}

const defaultAppConfig: AppConfig = {
    name: '',
    target: '',
    simControlsTarget: '',
    showSimControls: false,
    spaces: [],
    limiters: [],
    maxCalcStep: 0,
    inputString: ''
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
                .setMaxCalcStep(config.maxCalcStep),
            stateManager
        );

        this.slides[config.name].run();
    };
}

const rs = new LexRunner();
window['rs'] = rs;
if (window['demo'] === true) {
    console.log('demo === true!');
} else {
    console.log('demo !== true!');
    rs.run({
        ...defaultAppConfig,
        name: 'rs',
        target: 'viewport',
        simControlsTarget: 'controls',
        showSimControls: true,
        maxCalcStep: 1,
        spaces: [' ', '\n'],
        limiters: [';', '='],
        inputString: 'let a = 1;'
    });
}

import { castPartialTo } from '@src/testFramework/castPartialTo';
import { AppStateManager } from './AppStateManager';
import { AppController } from './AppController';
import { AppControllerBuilder } from './AppControllerBuilder';
import { Language2SyntaxAnalyzer } from './app/Language2SyntaxAnalyzer';
import { Interpreter } from './app/Interpreter';
import { LexAnalyzer } from './app/LexAnalyzer';
import { EditorController } from './editor/EditorController';

const spaces = [' ', '\n'];
const limiters = [';', '=', '/', "'", '(', ')', '+', '-', '*'];
describe('AppController', () => {
    describe('writes to console', () => {
        test.each`
            inputString                | calcSteps | expected
            ${'print(22+1);'}          | ${16}     | ${'23'}
            ${'print(22);'}            | ${16}     | ${'22'}
            ${"print('Hello World');"} | ${16}     | ${'Hello World'}
            ${'print(22-1);'}          | ${16}     | ${'21'}
            ${'print(2+4-1);'}         | ${16}     | ${'5'}
            ${'print(5*6);'}           | ${16}     | ${'30'}
            ${'print(5*6+1);'}         | ${16}     | ${'31'}
            ${'print(5*(6+1));'}       | ${16}     | ${'35'}
            ${'print(1+2+3);'}         | ${16}     | ${'6'}
            ${'print((1+2)+3);'}       | ${16}     | ${'6'}
            ${'print(1+(2-3));'}       | ${16}     | ${'0'}
        `('returns $expected from $inputString', ({ inputString, calcSteps, expected }) => {
            const stateManager = new AppStateManager();

            const app = new AppController(
                new AppControllerBuilder()
                    .setSpaces(spaces)
                    .setLimiters(limiters)
                    .setInputString(inputString)
                    .setEndCalcStep(calcSteps)
                    .setMaxCalcStep(calcSteps)
                    .setSyntax(new Language2SyntaxAnalyzer(stateManager, false))
                    .setInterpreter(new Interpreter(stateManager, false))
                    .setLex(new LexAnalyzer(stateManager))
                    .setEditorController(new EditorController('2', false)),
                stateManager
            );

            app.run();

            const consoleText = stateManager.getConsoleText();

            expect(consoleText).toBe(expected);
        });
    });
});

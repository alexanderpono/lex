import { castPartialTo } from '@src/testFramework/castPartialTo';
import { AppStateManager } from './AppStateManager';
import { AppController } from './AppController';
import { AppControllerBuilder } from './AppControllerBuilder';
import { Language2SyntaxAnalyzer } from './app/Language2SyntaxAnalyzer';
import { Interpreter } from './app/Interpreter';
import { LexAnalyzer } from './app/LexAnalyzer';

const spaces = [' ', '\n'];
const limiters = [';', '=', '/', "'", '(', ')', '+', '-', '*'];
describe('AppController', () => {
    describe('writes to console', () => {
        test.each`
            inputString              | calcSteps | expected
            ${'log(22+1);'}          | ${16}     | ${'23'}
            ${'log(22);'}            | ${16}     | ${'22'}
            ${"log('Hello World');"} | ${16}     | ${'Hello World'}
            ${'log(22-1);'}          | ${16}     | ${'21'}
            ${'log(2+4-1);'}         | ${16}     | ${'5'}
            ${'log(5*6);'}           | ${16}     | ${'30'}
            ${'log(5*6+1);'}         | ${16}     | ${'31'}
            ${'log(5*(6+1));'}       | ${16}     | ${'35'}
            ${'log(1+2+3);'}         | ${16}     | ${'6'}
            ${'log((1+2)+3);'}       | ${16}     | ${'6'}
            ${'log(1+(2-3));'}       | ${16}     | ${'0'}
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
                    .setLex(new LexAnalyzer(stateManager)),
                stateManager
            );

            app.run();

            // console.log('program=', JSON.stringify(stateManager.getAppState().program, null, 4));
            const consoleText = stateManager.getConsoleText();
            // console.log('consoleText=', consoleText);

            expect(consoleText).toBe(expected);
        });
    });
});

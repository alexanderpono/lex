import { castPartialTo } from '@src/testFramework/castPartialTo';
import { AppStateManager } from './AppStateManager';
import { AppController } from './AppController';
import { AppControllerBuilder } from './AppControllerBuilder';
import { Language2SyntaxAnalyzer } from './app/Language2SyntaxAnalyzer';
import { Interpreter } from './app/Interpreter';
import { LexAnalyzer } from './app/LexAnalyzer';

describe('AppController', () => {
    it('runs', () => {
        const stateManager = new AppStateManager();

        const app = new AppController(
            new AppControllerBuilder()
                .setSpaces([' ', '\n'])
                .setLimiters([';', '=', '/', "'", '(', ')', '+', '-', '*'])
                .setInputString('log(22+1);')
                .setEndCalcStep(16)
                .setMaxCalcStep(16)
                .setSyntax(new Language2SyntaxAnalyzer(stateManager, false))
                .setInterpreter(new Interpreter(stateManager, false))
                .setLex(new LexAnalyzer(stateManager)),
            stateManager
        );

        app.run();

        console.log('program=', JSON.stringify(stateManager.getAppState().program, null, 4));
        const consoleText = stateManager.getConsoleText();
        console.log('consoleText=', consoleText);

        expect(consoleText).toBe('23');
    });
    // describe('method returns', () => {
    //     test.each`
    //         method             | descr                    | testCase                             | param1
    //         ${'analyzeSyntax'} | ${'log(22+1);'}          | ${cases.analyzeSyntax.log22p1}       | ${null}
    //         ${'analyzeSyntax'} | ${'log(22);'}            | ${cases.analyzeSyntax.log22}         | ${null}
    //         ${'analyzeSyntax'} | ${"log('Hello world');"} | ${cases.analyzeSyntax.logHelloWorld} | ${null}
    //         ${'isCall'}        | ${';'}                   | ${cases.isCall.noId}                 | ${cases.isCall.noId.param1}
    //         ${'isCall'}        | ${'log;'}                | ${cases.isCall.noOpen}               | ${cases.isCall.noOpen.param1}
    //         ${'isCall'}        | ${'log();'}              | ${cases.isCall.noParameters}         | ${cases.isCall.noParameters.param1}
    //     `('$method() returns expected from $descr', ({ method, testCase, param1 }) => {
    //         let program = null;
    //         const stateManager = castPartialTo<AppStateManager>({
    //             getSpaces: () => testCase.spaces,
    //             getLimiters: () => testCase.limiters,
    //             getIds: () => testCase.ids,
    //             getText: () => testCase.text,
    //             getStrings: () => testCase.strings,
    //             setProgram: (p) => {
    //                 program = p;
    //             }
    //         });
    //         const syntax = new Language2SyntaxAnalyzer(stateManager);
    //         let result;
    //         if (!param1) {
    //             result = syntax[method]();
    //         }
    //         if (param1) {
    //             result = syntax[method](param1);
    //         }
    //         expect(result).toEqual(testCase.expected);
    //     });
    // });
});

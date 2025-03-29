import { castPartialTo } from '@src/testFramework/castPartialTo';
import { Language2SyntaxAnalyzer } from './Language2SyntaxAnalyzer';
import { AppStateManager } from '@src/AppStateManager';
import { cases } from './SyntaxAnalyzer2.cases-spec';

describe('Language2SyntaxAnalyzer', () => {
    describe('method returns', () => {
        test.each`
            method             | descr                    | testCase                             | param1
            ${'analyzeSyntax'} | ${'log(22);'}            | ${cases.analyzeSyntax.log22}         | ${null}
            ${'analyzeSyntax'} | ${'log(22+1);'}          | ${cases.analyzeSyntax.log22p1}       | ${null}
            ${'analyzeSyntax'} | ${"log('Hello world');"} | ${cases.analyzeSyntax.logHelloWorld} | ${null}
            ${'isCall'}        | ${';'}                   | ${cases.isCall.noId}                 | ${cases.isCall.noId.param1}
            ${'isCall'}        | ${'log;'}                | ${cases.isCall.noOpen}               | ${cases.isCall.noOpen.param1}
            ${'isCall'}        | ${'log();'}              | ${cases.isCall.noParameters}         | ${cases.isCall.noParameters.param1}
            ${'analyzeSyntax'} | ${'log(22-1);'}          | ${cases.analyzeSyntax.log22m1}       | ${null}
            ${'analyzeSyntax'} | ${'log(22+1+2);'}        | ${cases.analyzeSyntax.log22p1p2}     | ${null}
            ${'analyzeSyntax'} | ${'log(2*4);'}           | ${cases.analyzeSyntax.log2mult4}     | ${null}
            ${'analyzeSyntax'} | ${'log((2));'}           | ${cases.analyzeSyntax.logO2C}        | ${null}
            ${'analyzeSyntax'} | ${'log((1+2));'}         | ${cases.analyzeSyntax.logO1p2C}      | ${null}
            ${'analyzeSyntax'} | ${'log((1+2)+3);'}       | ${cases.analyzeSyntax.logO1p2Cp3}    | ${null}
            ${'analyzeSyntax'} | ${'log((1+2)*3);'}       | ${cases.analyzeSyntax.logO1p2Cmult3} | ${null}
        `('$method() returns expected from $descr', ({ method, testCase, param1 }) => {
            let program = null;
            const stateManager = castPartialTo<AppStateManager>({
                getSpaces: () => testCase.spaces,
                getLimiters: () => testCase.limiters,
                getIds: () => testCase.ids,
                getText: () => testCase.text,
                getStrings: () => testCase.strings,
                setProgram: (p) => {
                    program = p;
                }
            });
            const syntax = new Language2SyntaxAnalyzer(stateManager, true);
            let result;
            if (!param1) {
                result = syntax[method]();
            }
            if (param1) {
                result = syntax[method](param1);
            }
            expect(result).toEqual(testCase.expected);
        });
    });
});

import { castPartialTo } from '@src/testFramework/castPartialTo';
import { expressionToReversePolish } from './expressionToReversePolish';
import { CanonicTextItem, SyntaxAnalyzeState, SyntaxNode, Table } from '@src/app.types';

const lex = {
    id: (lexem: string): CanonicTextItem => ({
        tableId: Table.IDS,
        tableIndex: null,
        lineNo: null,
        pos: null,
        lexem
    }),
    limiter: (lexem: string): CanonicTextItem => ({
        tableId: Table.LIMITERS,
        tableIndex: null,
        lineNo: null,
        pos: null,
        lexem
    })
};
const syntax = {
    id: (valPos: number): SyntaxAnalyzeState => ({
        code: null,
        pos: null,
        type: SyntaxNode.ID,
        valPos
    }),
    expression: (
        // valPos: number,
        operand1: SyntaxAnalyzeState,
        operand2: SyntaxAnalyzeState,
        operation: string
    ): SyntaxAnalyzeState => ({
        code: null,
        pos: null,
        type: SyntaxNode.EXPRESSION,
        valPos: -1,
        operand1,
        operand2,
        operation
    })
};
describe('expressionToReversePolish', () => {
    test('2 -> [2]', () => {
        expect(expressionToReversePolish([lex.id('2')], syntax.id(0), [], false)).toEqual(['2']);
    });

    test('1 + 2 -> [1,2,+]', () => {
        expect(
            expressionToReversePolish(
                [lex.id('1'), lex.limiter('+'), lex.id('2')],
                syntax.expression(syntax.id(0), syntax.id(2), '+'),
                [],
                false
            )
        ).toEqual(['1', '2', '+']);
    });

    test('1 + 2 + 3 -> [1,2,3,+,+]', () => {
        expect(
            expressionToReversePolish(
                [lex.id('1'), lex.limiter('+'), lex.id('2'), lex.limiter('+'), lex.id('3')],
                syntax.expression(
                    syntax.id(0),
                    syntax.expression(syntax.id(2), syntax.id(4), '+'),
                    '+'
                ),
                [],
                false
            )
        ).toEqual(['1', '2', '3', '+', '+']);
    });

    test('1 * 2 + 3 -> [3,1,2,*,+]', () => {
        expect(
            expressionToReversePolish(
                [lex.id('1'), lex.limiter('*'), lex.id('2'), lex.limiter('+'), lex.id('3')],
                syntax.expression(
                    syntax.id(4),
                    syntax.expression(syntax.id(0), syntax.id(2), '*'),
                    '+'
                ),
                [],
                false
            )
        ).toEqual(['3', '1', '2', '*', '+']);
    });

    test('( 1 + 2 ) * 3 -> [3,1,2,+,*]', () => {
        expect(
            expressionToReversePolish(
                [
                    lex.limiter('('),
                    lex.id('1'),
                    lex.limiter('+'),
                    lex.id('2'),
                    lex.limiter(')'),
                    lex.limiter('*'),
                    lex.id('3')
                ],
                syntax.expression(
                    syntax.id(6),
                    syntax.expression(syntax.id(1), syntax.id(3), '+'),
                    '*'
                ),
                [],
                false
            )
        ).toEqual(['3', '1', '2', '+', '*']);
    });
});

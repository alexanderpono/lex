import { CanonicTextItem, SyntaxAnalyzeState, SyntaxNode } from '@src/app.types';

export const expressionToReversePolish = (
    text: CanonicTextItem[],
    node: SyntaxAnalyzeState,
    curResult: string[],
    isDebug: boolean
): string[] => {
    isDebug && console.log('expressionToReversePolish() node=', node);
    switch (node.type) {
        case SyntaxNode.STRING:
            return ["'" + text[node.valPos].lexem + "'", ...curResult];
        case SyntaxNode.EXPRESSION: {
            const op1 = expressionToReversePolish(text, node.operand1, [], isDebug);
            const op2 = expressionToReversePolish(text, node.operand2, [], isDebug);
            isDebug && console.log('expressionToReversePolish() op1=', op1);
            isDebug && console.log('expressionToReversePolish() op2=', op2);
            const result = [...op1, ...op2, node.operation, ...curResult];
            isDebug && console.log('expressionToReversePolish() result=', result);
            return result;
        }
        case SyntaxNode.ID: {
            const valText = text[node.valPos].lexem;
            return [valText, ...curResult];
        }
        default:
            return ['?'];
    }
};

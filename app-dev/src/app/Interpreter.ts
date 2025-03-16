import { AppStateManager } from '@src/AppStateManager';
import { CallData, CanonicTextItem, SyntaxAnalyzeState, SyntaxNode, Table } from '@src/app.types';

export class Interpreter {
    constructor(private stateManager: AppStateManager) {}

    runMath = (op1: number, op: string, op2: number): number => {
        switch (op) {
            case '+': {
                return op1 + op2;
            }
            default:
                return -1;
        }
    };

    calcValue = (node: SyntaxAnalyzeState) => {
        let value = '';
        switch (node.type) {
            case SyntaxNode.EXPRESSION: {
                const op1Val = this.calcValue(node.operand1);
                if (node.operation !== '') {
                    const op2Val = this.calcValue(node.operand2);
                    const mathResult = this.runMath(
                        parseInt(op1Val as string),
                        node.operation,
                        parseInt(op2Val as string)
                    );
                    return mathResult;
                }
                return op1Val;
                break;
            }

            case SyntaxNode.ID: {
                const text = this.stateManager.getText();
                const ids = this.stateManager.getIds();
                const token = text[node.valPos];
                return token.lexem;
                break;
            }
        }
        console.log('executeScript() value=', value);
        return value;
    };

    prepareCall = (instruction: SyntaxAnalyzeState): CallData => {
        const text = this.stateManager.getText();
        const ids = this.stateManager.getIds();
        const funcName = ids[instruction.id];
        const rawParams = instruction.parameters;
        const value = this.calcValue(instruction.parameters);
        return {
            funcName,
            params: [value]
        };
    };

    executeCall = (instruction: CallData) => {
        const context = {
            globalFunctions: {
                log: (...params) => {
                    const text = this.stateManager.getConsoleText();
                    console.log('typeof params=', typeof params);
                    const firstLF = text ? '\n' : '';
                    this.stateManager.setConsoleText(text + firstLF + params.join(' '));
                    console.log(params);
                }
            }
        };

        if (typeof context.globalFunctions[instruction.funcName] !== 'function') {
            console.error('function is not found:', instruction.funcName);
            return;
        }
        console.log('instruction.params=', instruction.params);
        context.globalFunctions[instruction.funcName].apply(null, instruction.params);
    };

    executeScript = () => {
        const program = this.stateManager.getProgram();
        if (program.type === SyntaxNode.CALL) {
            this.executeCall(this.prepareCall(program));
        }
    };
}

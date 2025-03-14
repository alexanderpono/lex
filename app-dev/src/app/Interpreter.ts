import { AppStateManager } from '@src/AppStateManager';
import { CallData, CanonicTextItem, SyntaxAnalyzeState, SyntaxNode, Table } from '@src/app.types';

export class Interpreter {
    constructor(private stateManager: AppStateManager) {}

    calcValue = (token: CanonicTextItem) => {
        console.log('executeScript() token=', token);
        let value = '';
        if (token.tableId === Table.STRINGS) {
            value = token.lexem;
        }
        console.log('executeScript() value=', value);
        return value;
    };

    prepareCall = (instruction: SyntaxAnalyzeState): CallData => {
        const text = this.stateManager.getText();
        const ids = this.stateManager.getIds();
        const funcName = ids[instruction.id];
        console.log('executeScript() funcName=', funcName);
        const rawParams = instruction.parameters;
        console.log('executeScript() rawParams=', rawParams);
        const params = rawParams.map((paramIndex: number) => {
            const paramToken = text[paramIndex];
            return this.calcValue(paramToken);
        });
        console.log('executeScript() params=', params);
        return {
            funcName,
            params
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
        console.log('executeScript()');
        const program = this.stateManager.getProgram();
        if (program.type === SyntaxNode.CALL) {
            this.executeCall(this.prepareCall(program));
        }
    };
}

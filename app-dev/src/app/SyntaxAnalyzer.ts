import { ISyntax, SyntaxAnalyzeState, SyntaxNode, Table } from '@src/app.types';
import { AppStateManager } from '@src/AppStateManager';

export class SyntaxAnalyzer implements ISyntax {
    constructor(private stateManager: AppStateManager) {}

    analyzeSyntax = () => {
        const text = this.stateManager.getText();
        console.log('analyzeSyntax() text=', text);
        const state: SyntaxAnalyzeState = {
            code: false,
            pos: 0,
            type: SyntaxNode.DEFAULT
        };

        const isProgram = this.isProgram(state);
        console.log('analyzeSyntax() isProgram=', isProgram);

        if (isProgram.code && isProgram.pos === text.length) {
            console.log('analyzeSyntax() syntax check OK');
            this.stateManager.setProgram(isProgram);
        } else {
            console.log('analyzeSyntax() syntax check failed');
        }
    };

    isProgram = (state: SyntaxAnalyzeState): SyntaxAnalyzeState => {
        return this.isCall(state);
    };

    isCall = (state: SyntaxAnalyzeState): SyntaxAnalyzeState => {
        const NO = { code: false, pos: state.pos, type: SyntaxNode.DEFAULT };

        const isId = this.isAnyId(state);
        if (!isId.code) {
            return NO;
        }
        const isOpen = this.isLimiter(isId, '(');
        if (!isOpen.code) {
            return NO;
        }
        const isParametersList = this.isParametersList(isOpen);
        if (!isParametersList.code) {
            return NO;
        }

        const isClose = this.isLimiter(isParametersList, ')');
        if (!isClose.code) {
            return NO;
        }

        const isSemicolon = this.isLimiter(isClose, ';');
        if (!isSemicolon.code) {
            return { code: false, pos: isClose.pos, type: SyntaxNode.DEFAULT };
        }

        return {
            ...isSemicolon,
            type: SyntaxNode.CALL,
            id: isId.valPos,
            parameters: isParametersList.parameters
        };
    };

    isAnyId = (state: SyntaxAnalyzeState): SyntaxAnalyzeState => {
        const text = this.stateManager.getText();
        const token = text[state.pos];
        if (token.tableId === Table.IDS) {
            return { code: true, pos: state.pos + 1, type: SyntaxNode.ID, valPos: state.pos };
        }
        return { code: false, pos: state.pos, type: SyntaxNode.DEFAULT };
    };

    isLimiter = (state: SyntaxAnalyzeState, lexem: string): SyntaxAnalyzeState => {
        const text = this.stateManager.getText();
        const token = text[state.pos];
        if (token.tableId === Table.LIMITERS && token.lexem === lexem) {
            return { code: true, pos: state.pos + 1, type: SyntaxNode.LIMITER };
        }
        return { code: false, pos: state.pos, type: SyntaxNode.DEFAULT };
    };

    isParametersList = (state: SyntaxAnalyzeState): SyntaxAnalyzeState => {
        const NO = { code: false, pos: state.pos, type: SyntaxNode.DEFAULT };

        const isString = this.isAnyString(state);
        if (!isString.code) {
            return NO;
        }
        const isColon = this.isLimiter(isString, ',');
        if (!isColon.code) {
            return { ...isString, parameters: [state.pos] };
        }
        const isParametersList = this.isParametersList(isColon);
        if (!isParametersList.code) {
            return { code: false, pos: isColon.pos, type: SyntaxNode.DEFAULT };
        }

        return { ...isParametersList, parameters: [state.pos, ...isParametersList?.parameters] };
    };

    isAnyString = (state: SyntaxAnalyzeState): SyntaxAnalyzeState => {
        const text = this.stateManager.getText();
        const token = text[state.pos];
        if (token.tableId === Table.STRINGS) {
            return { code: true, pos: state.pos + 1, type: SyntaxNode.STRING };
        }
        return { code: false, pos: state.pos, type: SyntaxNode.DEFAULT };
    };
}

import {
    defaultSyntaxAnalyzeState,
    ISyntax,
    SyntaxAnalyzeState,
    SyntaxNode,
    Table
} from '@src/app.types';
import { AppStateManager } from '@src/AppStateManager';

export class Language2SyntaxAnalyzer implements ISyntax {
    constructor(private stateManager: AppStateManager, private isDebug: boolean) {}

    analyzeSyntax = (): SyntaxAnalyzeState => {
        const text = this.stateManager.getText();
        this.isDebug && console.log('analyzeSyntax() text=', text);
        const state: SyntaxAnalyzeState = {
            code: false,
            pos: 0,
            type: SyntaxNode.DEFAULT
        };
        const NO = { code: false, pos: state.pos, type: SyntaxNode.DEFAULT };

        const isProgram = this.isProgram(state);
        this.isDebug &&
            console.log('analyzeSyntax() isProgram=', JSON.stringify(isProgram, null, 4));

        if (isProgram.code && isProgram.pos === text.length) {
            this.isDebug && console.log('analyzeSyntax() syntax check OK');
            this.stateManager.setProgram(isProgram);
            return isProgram;
        } else {
            this.isDebug && console.log('analyzeSyntax() syntax check failed');
            return NO;
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
        this.isDebug && console.log('isCall() isId=', isId);
        const isOpen = this.isLimiter(isId, '(');
        if (!isOpen.code) {
            return NO;
        }
        const isParametersList = this.isParametersList(isOpen);
        this.isDebug && console.log('isCall() isParametersList=', isParametersList);
        if (!isParametersList.code) {
            return NO;
        }

        const isClose = this.isLimiter(isParametersList, ')');
        this.isDebug && console.log('isCall() isClose=', isClose);
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
            parameters: isParametersList
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

        const isExpression = this.isExpression(state);
        if (isExpression.code) {
            this.isDebug &&
                console.log(
                    'isParametersList() isExpression=',
                    JSON.stringify(isExpression, null, 4)
                );
            return { ...isExpression };
        }

        const isString = this.isAnyString(state);
        this.isDebug && console.log('isParametersList() isString=', isString);
        if (!isString.code) {
            return NO;
        }
        const isColon = this.isLimiter(isString, ',');
        if (!isColon.code) {
            return { ...isString };
        }
        const isParametersList = this.isParametersList(isColon);
        if (!isParametersList.code) {
            return { code: false, pos: isColon.pos, type: SyntaxNode.DEFAULT };
        }

        return { ...isParametersList }; //, parameters: [state.pos, ...isParametersList?.parameters]
    };

    isAnyString = (state: SyntaxAnalyzeState): SyntaxAnalyzeState => {
        const text = this.stateManager.getText();
        const token = text[state.pos];
        if (token.tableId === Table.STRINGS) {
            return { code: true, pos: state.pos + 1, type: SyntaxNode.STRING, valPos: state.pos };
        }
        return { code: false, pos: state.pos, type: SyntaxNode.DEFAULT };
    };

    isExpression = (state: SyntaxAnalyzeState): SyntaxAnalyzeState => {
        const text = this.stateManager.getText();
        const token = text[state.pos];
        const NO = { code: false, pos: state.pos, type: SyntaxNode.DEFAULT };

        const isTherm = this.isTherm(state);
        if (!isTherm.code) {
            return NO;
        }
        this.isDebug && console.log('isExpression() isTherm=', isTherm);

        const isPlus = this.isLimiter(isTherm, '+');
        const isMinus = this.isLimiter(isTherm, '-');
        if (!isPlus.code && !isMinus.code) {
            return isTherm;
        }

        const operation = isPlus.code ? isPlus : isMinus;
        const isExpression = this.isExpression(operation);
        if (!isExpression.code) {
            return {
                code: false,
                pos: operation.pos,
                type: SyntaxNode.DEFAULT,
                error: 'expression expected'
            };
        }

        return {
            ...isExpression,
            operand1: isTherm,
            operation: isPlus.code ? '+' : '-',
            operand2: isExpression,
            type: SyntaxNode.EXPRESSION,
            valPos: defaultSyntaxAnalyzeState.valPos
        };
    };

    isTherm = (state: SyntaxAnalyzeState): SyntaxAnalyzeState => {
        const text = this.stateManager.getText();
        const token = text[state.pos];
        const NO = { code: false, pos: state.pos, type: SyntaxNode.DEFAULT };

        const isFactor = this.isFactor(state);
        if (!isFactor.code) {
            return NO;
        }
        const isMult = this.isLimiter(isFactor, '*');
        const isDivide = this.isLimiter(isFactor, '/');
        if (!isMult.code && !isDivide.code) {
            return isFactor;
        }

        const operation = isMult.code ? isMult : isDivide;
        const isTherm = this.isTherm(operation);
        if (!isTherm.code) {
            return {
                code: false,
                pos: operation.pos,
                type: SyntaxNode.DEFAULT,
                error: 'term expected'
            };
        }

        return {
            ...isTherm,
            operand1: isFactor,
            operation: isMult.code ? '*' : '/',
            operand2: isTherm,
            type: SyntaxNode.EXPRESSION,
            valPos: defaultSyntaxAnalyzeState.valPos
        };
    };

    isFactor = (state: SyntaxAnalyzeState): SyntaxAnalyzeState => {
        const text = this.stateManager.getText();
        const token = text[state.pos];
        const NO = { code: false, pos: state.pos, type: SyntaxNode.DEFAULT };

        const isNumber = this.isNumber(state);
        this.isDebug && console.log('isFactor() isNumber=', isNumber);
        if (isNumber.code) {
            return isNumber;
        }

        const isOpen = this.isLimiter(state, '(');
        if (!isOpen.code) {
            return NO;
        }

        const isExpression = this.isExpression(isOpen);
        if (!isExpression.code) {
            return {
                code: false,
                pos: isOpen.pos,
                type: SyntaxNode.DEFAULT,
                error: 'expression expected'
            };
        }

        const isClose = this.isLimiter(isExpression, ')');
        this.isDebug && console.log('isCall() isClose=', isClose);
        if (!isClose.code) {
            return NO;
        }

        return {
            ...isExpression,
            pos: isClose.pos
        };
    };

    isNumber = (state: SyntaxAnalyzeState): SyntaxAnalyzeState => {
        const text = this.stateManager.getText();
        const token = text[state.pos];
        if (token.tableId === Table.IDS && !isNaN(parseInt(token.lexem))) {
            return { code: true, pos: state.pos + 1, type: SyntaxNode.ID, valPos: state.pos };
        }
        return { code: false, pos: state.pos, type: SyntaxNode.DEFAULT };
    };
}

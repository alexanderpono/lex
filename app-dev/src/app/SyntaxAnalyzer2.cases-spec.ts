import { CanonicTextItem, SyntaxAnalyzeState, SyntaxNode, Table } from '@src/app.types';

const start: SyntaxAnalyzeState = {
    code: false,
    pos: 0,
    type: SyntaxNode.DEFAULT
};

const semicolon: CanonicTextItem = {
    tableId: Table.LIMITERS,
    tableIndex: 0,
    lineNo: 1,
    pos: 10,
    lexem: ';'
};
const log: CanonicTextItem = { tableId: Table.IDS, tableIndex: 0, lineNo: 1, pos: 1, lexem: 'log' };
const open: CanonicTextItem = {
    tableId: Table.LIMITERS,
    tableIndex: 4,
    lineNo: 1,
    pos: 4,
    lexem: '('
};
const close: CanonicTextItem = {
    tableId: Table.LIMITERS,
    tableIndex: 5,
    lineNo: 1,
    pos: 9,
    lexem: ')'
};
const spaces = [' ', '\n'];
const limiters = [';', '=', '/', "'", '(', ')', '+', '-', '*'];
const analyzeSyntax = {
    log22p1: {
        spaces,
        limiters,
        ids: ['log', '22', '1'],
        strings: [''],
        text: [
            log,
            open,
            { tableId: 'i', tableIndex: 1, lineNo: 1, pos: 5, lexem: '22' },
            { tableId: 'l', tableIndex: 6, lineNo: 1, pos: 7, lexem: '+' },
            { tableId: 'i', tableIndex: 2, lineNo: 1, pos: 8, lexem: '1' },
            close,
            semicolon
        ],
        expected: {
            code: true,
            id: 0,
            parameters: {
                code: true,
                error: '',
                id: -1,
                operand1: {
                    code: true,
                    pos: 3,
                    parameters: null,
                    id: -1,
                    valPos: 2,
                    type: 'EXPRESSION',
                    error: '',
                    operation: '',
                    operand1: {
                        code: true,
                        pos: 3,
                        type: 'ID',
                        valPos: 2
                    },
                    operand2: null
                },
                operand2: {
                    code: true,
                    error: '',
                    id: -1,
                    operand1: { code: true, pos: 5, type: 'ID', valPos: 4 },
                    operand2: null,
                    operation: '',
                    parameters: null,
                    pos: 5,
                    type: 'EXPRESSION',
                    valPos: 4
                },
                operation: '+',
                parameters: null,
                pos: 5,
                type: 'EXPRESSION',
                valPos: 4
            },
            pos: 7,
            type: 'CALL'
        }
    },
    log22: {
        spaces,
        limiters,
        ids: ['log', '22', '1'],
        strings: [''],
        text: [
            log,
            open,
            { tableId: 'i', tableIndex: 1, lineNo: 1, pos: 5, lexem: '22' },
            close,
            semicolon
        ],
        expected: {
            code: true,
            id: 0,
            parameters: {
                code: true,
                error: '',
                id: -1,
                operand1: { code: true, pos: 3, type: 'ID', valPos: 2 },
                operand2: null,
                operation: '',
                parameters: null,
                pos: 3,
                type: 'EXPRESSION',
                valPos: 2
            },
            pos: 5,
            type: 'CALL'
        }
    },
    logHelloWorld: {
        spaces,
        limiters,
        ids: ['log'],
        strings: ['Hello world'],
        text: [
            log,
            open,
            { tableId: 'str', tableIndex: 0, lineNo: 1, pos: 6, lexem: 'Hello world' },
            close,
            semicolon
        ],
        expected: {
            code: true,
            id: 0,
            parameters: {
                code: true,
                pos: 3,
                type: 'STRING',
                valPos: 2
            },
            pos: 5,
            type: 'CALL'
        }
    },
    log22m1: {
        spaces,
        limiters,
        ids: ['log', '22', '1'],
        strings: [''],
        text: [
            log,
            open,
            { tableId: 'i', tableIndex: 1, lineNo: 1, pos: 5, lexem: '22' },
            { tableId: 'l', tableIndex: 6, lineNo: 1, pos: 7, lexem: '-' },
            { tableId: 'i', tableIndex: 2, lineNo: 1, pos: 8, lexem: '1' },
            close,
            semicolon
        ],
        expected: {
            code: true,
            id: 0,
            parameters: {
                code: true,
                error: '',
                id: -1,
                operand1: {
                    code: true,
                    pos: 3,
                    parameters: null,
                    id: -1,
                    valPos: 2,
                    type: 'EXPRESSION',
                    error: '',
                    operation: '',
                    operand1: {
                        code: true,
                        pos: 3,
                        type: 'ID',
                        valPos: 2
                    },
                    operand2: null
                },
                operand2: {
                    code: true,
                    error: '',
                    id: -1,
                    operand1: { code: true, pos: 5, type: 'ID', valPos: 4 },
                    operand2: null,
                    operation: '',
                    parameters: null,
                    pos: 5,
                    type: 'EXPRESSION',
                    valPos: 4
                },
                operation: '-',
                parameters: null,
                pos: 5,
                type: 'EXPRESSION',
                valPos: 4
            },
            pos: 7,
            type: 'CALL'
        }
    },
    log22p1p2: {
        spaces,
        limiters,
        ids: ['log', '22', '1', '2'],
        strings: [''],
        text: [
            log,
            open,
            { tableId: 'i', tableIndex: 1, lineNo: 1, pos: 5, lexem: '22' },
            { tableId: 'l', tableIndex: 6, lineNo: 1, pos: 7, lexem: '+' },
            { tableId: 'i', tableIndex: 2, lineNo: 1, pos: 8, lexem: '1' },
            { tableId: 'l', tableIndex: 6, lineNo: 1, pos: 7, lexem: '+' },
            { tableId: 'i', tableIndex: 2, lineNo: 1, pos: 8, lexem: '2' },
            close,
            semicolon
        ],
        expected: {
            code: true,
            id: 0,
            parameters: {
                code: true,
                error: '',
                id: -1,
                operand1: {
                    code: true,
                    pos: 3,
                    parameters: null,
                    id: -1,
                    valPos: 2,
                    type: 'EXPRESSION',
                    error: '',
                    operation: '',
                    operand1: {
                        code: true,
                        pos: 3,
                        type: 'ID',
                        valPos: 2
                    },
                    operand2: null
                },
                operand2: {
                    code: true,
                    pos: 7,
                    parameters: null,
                    id: -1,
                    valPos: 6,
                    type: 'EXPRESSION',
                    error: '',
                    operation: '+',
                    operand1: {
                        code: true,
                        pos: 5,
                        parameters: null,
                        id: -1,
                        valPos: 4,
                        type: 'EXPRESSION',
                        error: '',
                        operation: '',
                        operand1: {
                            code: true,
                            pos: 5,
                            type: 'ID',
                            valPos: 4
                        },
                        operand2: null
                    },
                    operand2: {
                        code: true,
                        pos: 7,
                        parameters: null,
                        id: -1,
                        valPos: 6,
                        type: 'EXPRESSION',
                        error: '',
                        operation: '',
                        operand1: {
                            code: true,
                            pos: 7,
                            type: 'ID',
                            valPos: 6
                        },
                        operand2: null
                    }
                },
                operation: '+',
                parameters: null,
                pos: 7,
                type: 'EXPRESSION',
                valPos: 6
            },
            pos: 9,
            type: 'CALL'
        }
    },
    log2mult4: {
        spaces,
        limiters,
        ids: ['log', '2', '4'],
        strings: [''],
        text: [
            log,
            open,
            { tableId: 'i', tableIndex: 1, lineNo: 1, pos: 2, lexem: '2' },
            { tableId: 'l', tableIndex: 6, lineNo: 1, pos: 3, lexem: '*' },
            { tableId: 'i', tableIndex: 2, lineNo: 1, pos: 4, lexem: '4' },
            close,
            semicolon
        ],
        expected: {
            code: true,
            id: 0,
            parameters: {
                code: true,
                error: '',
                id: -1,
                operand1: { code: true, pos: 3, type: 'ID', valPos: 2 },
                operand2: {
                    code: true,
                    error: '',
                    id: -1,
                    operand1: { code: true, pos: 5, type: 'ID', valPos: 4 },
                    operand2: null,
                    operation: '',
                    parameters: null,
                    pos: 5,
                    type: 'EXPRESSION',
                    valPos: 4
                },
                operation: '*',
                parameters: null,
                pos: 5,
                type: 'EXPRESSION',
                valPos: 4
            },
            pos: 7,
            type: 'CALL'
        }
    }
};

const isCall = {
    noId: {
        spaces,
        limiters,
        ids: ['log', '22', '1'],
        strings: [''],
        text: [semicolon],
        param1: start,
        expected: { code: false, pos: start.pos, type: SyntaxNode.DEFAULT }
    },
    noOpen: {
        spaces,
        limiters,
        ids: ['log', '22', '1'],
        strings: [''],
        text: [log, semicolon],
        param1: start,
        expected: { code: false, pos: start.pos, type: SyntaxNode.DEFAULT }
    },
    noParameters: {
        spaces,
        limiters,
        ids: ['log', '22', '1'],
        strings: [''],
        text: [log, open, close, semicolon],
        param1: start,
        expected: { code: false, pos: start.pos, type: SyntaxNode.DEFAULT }
    }
};
export const cases = {
    analyzeSyntax,
    isCall
};

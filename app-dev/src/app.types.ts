export enum Table {
    DEFAULT = '',
    LIMITERS = 'l',
    SPACES = 's',
    IDS = 'i',
    STRINGS = 'str'
}

export interface CompiledLine {
    tableId: Table;
    tableIndex: number;
    lexem: string;
}

export const defaultCompiledLine: CompiledLine = {
    tableId: Table.DEFAULT,
    tableIndex: -1,
    lexem: ''
};

export interface CanonicTextItem {
    tableId: Table;
    tableIndex: number;
    lineNo: number;
    pos: number;
    lexem: string;
}

export const defaultCanonicTextItem: CanonicTextItem = {
    tableId: Table.DEFAULT,
    tableIndex: -1,
    lineNo: -1,
    pos: -1,
    lexem: ''
};

export interface IndexData {
    pos: number;
    lexem: CompiledLine;
}

export interface AppDocument {
    spaces: string[];
    limiters: string[];
    ids: string[];
    compiled: CompiledLine[];
    text: CanonicTextItem[];
    strings: string[];
}

export const defaultDocument: AppDocument = {
    spaces: [],
    limiters: [],
    ids: [],
    compiled: [],
    text: [],
    strings: []
};

export enum SyntaxNode {
    DEFAULT = '',
    PARAMETERS = 'PARAMETERS',
    STRING = 'STRING',
    ID = 'ID',
    LIMITER = 'LIMITER',
    CALL = 'CALL'
}

export interface SyntaxAnalyzeState {
    code: boolean;
    pos: number;
    parameters?: number[];
    id?: number;
    type: SyntaxNode;
}

export const defaultSyntaxAnalyzeState: SyntaxAnalyzeState = {
    code: false,
    pos: 0,
    parameters: [],
    id: -1,
    type: SyntaxNode.DEFAULT
};

export interface CallData {
    funcName: string;
    params: string[];
}

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
    CALL = 'CALL',
    EXPRESSION = 'EXPRESSION'
}

export interface SyntaxAnalyzeState {
    code: boolean;
    pos: number;
    parameters?: SyntaxAnalyzeState;
    id?: number;
    valPos?: number;
    type: SyntaxNode;
    error?: string;
    operation?: string;
    operand1?: SyntaxAnalyzeState;
    operand2?: SyntaxAnalyzeState;
}

export const defaultSyntaxAnalyzeState: SyntaxAnalyzeState = {
    code: false,
    pos: 0,
    parameters: null,
    id: -1,
    valPos: -1,
    type: SyntaxNode.DEFAULT,
    error: '',
    operation: '',
    operand1: null,
    operand2: null
};

export interface CallData {
    funcName: string;
    params: string[];
}

export interface ISyntax {
    analyzeSyntax: () => void;
}

export enum Show {
    default = 0,
    simControls = 1,
    inputFile = 2,
    prettyText = 4,
    limitersTable = 8,
    spacesTable = 16,
    idsTable = 32,
    canonicText = 64,
    lineNumbers = 128,
    stringsTable = 256,
    text = 512,
    program = 1024,
    console = 2048,
    debugInfo = 4096,
    mathTree = 8192
}

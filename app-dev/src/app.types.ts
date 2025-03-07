export enum Table {
    DEFAULT = '',
    LIMITERS = 'l',
    SPACES = 's',
    IDS = 'i'
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

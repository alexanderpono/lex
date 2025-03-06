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

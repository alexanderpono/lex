export type ObjectsState = Record<string, object>;

export class AppControllerBuilder {
    target: string = '';
    simControlsTarget: string = '';
    showSimControls: boolean = false;
    startState: ObjectsState;
    maxCalcStep: number = 0;
    spaces: string[] = [];
    limiters: string[] = [];
    inputString: string = '';
    endCalcStep: number = 0;
    showInputFile: boolean = false;
    showPrettyText: boolean = false;
    showLimitersTable: boolean = false;
    showSpacesTable: boolean = false;
    showIdsTable: boolean = false;
    showCanonicText: boolean = false;
    formatIds: boolean = false;
    formatComments: boolean = false;
    showLineNumbers: boolean = false;
    showStringsTable: boolean = false;
    showText: boolean = false;
    showProgram: boolean = false;

    setTarget = (target: string) => {
        this.target = target;
        return this;
    };
    setSimControlsTarget = (simControlsTarget: string) => {
        this.simControlsTarget = simControlsTarget;
        return this;
    };
    setShowSimControls = (showSimControls: boolean) => {
        this.showSimControls = showSimControls;
        return this;
    };
    setStartState = (startState: ObjectsState) => {
        this.startState = startState;
        return this;
    };
    setMaxCalcStep = (maxCalcStep: number) => {
        this.maxCalcStep = maxCalcStep;
        return this;
    };
    setSpaces = (spaces: string[]) => {
        this.spaces = spaces;
        return this;
    };
    setLimiters = (limiters: string[]) => {
        this.limiters = limiters;
        return this;
    };
    setInputString = (inputString: string) => {
        this.inputString = inputString;
        return this;
    };
    setEndCalcStep = (endCalcStep: number) => {
        this.endCalcStep = endCalcStep;
        return this;
    };
    setShowInputFile = (showInputFile: boolean) => {
        this.showInputFile = showInputFile;
        return this;
    };
    setShowPrettyText = (showPrettyText: boolean) => {
        this.showPrettyText = showPrettyText;
        return this;
    };
    setShowLimitersTable = (showLimitersTable: boolean) => {
        this.showLimitersTable = showLimitersTable;
        return this;
    };
    setShowSpacesTable = (showSpacesTable: boolean) => {
        this.showSpacesTable = showSpacesTable;
        return this;
    };
    setShowIdsTable = (showIdsTable: boolean) => {
        this.showIdsTable = showIdsTable;
        return this;
    };
    setShowCanonicText = (showCanonicText: boolean) => {
        this.showCanonicText = showCanonicText;
        return this;
    };
    setFormatIds = (formatIds: boolean) => {
        this.formatIds = formatIds;
        return this;
    };
    setFormatComments = (formatComments: boolean) => {
        this.formatComments = formatComments;
        return this;
    };
    setShowLineNumbers = (showLineNumbers: boolean) => {
        this.showLineNumbers = showLineNumbers;
        return this;
    };
    setShowStringsTable = (showStringsTable: boolean) => {
        this.showStringsTable = showStringsTable;
        return this;
    };
    setShowText = (showText: boolean) => {
        this.showText = showText;
        return this;
    };
    setShowProgram = (showProgram: boolean) => {
        this.showProgram = showProgram;
        return this;
    };
}

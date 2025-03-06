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
}

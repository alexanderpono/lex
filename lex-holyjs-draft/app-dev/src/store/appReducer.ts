import {
    CanonicTextItem,
    CompiledLine,
    defaultSyntaxAnalyzeState,
    SyntaxAnalyzeState
} from '@src/app.types';

export enum AppActions {
    DEFAULT = 'DEFAULT',
    APP_STATE = 'APP_STATE'
}

export interface AppState {
    event: AppActions;
    stepNo: number;
    spaces: string[];
    limiters: string[];
    ids: string[];
    compiled: CompiledLine[];
    inputString: string;
    lineNo: number;
    currentPosInLine: number;
    text: CanonicTextItem[];
    program: SyntaxAnalyzeState;
}

export const defaultSimState: AppState = {
    event: AppActions.DEFAULT,
    stepNo: 0,
    spaces: [],
    limiters: [],
    ids: [],
    compiled: [],
    inputString: '',
    lineNo: 0,
    currentPosInLine: 0,
    text: [],
    program: defaultSyntaxAnalyzeState
};

export interface SetAppStateAction {
    type: AppActions.APP_STATE;
    payload: {
        stepNo: number;
        spaces: string[];
        limiters: string[];
        ids: string[];
        compiled: CompiledLine[];
        inputString: string;
        lineNo: number;
        currentPosInLine: number;
        text: CanonicTextItem[];
        program: SyntaxAnalyzeState;
    };
}

export const app = {
    setSimState: (state: {
        stepNo: number;
        spaces: string[];
        limiters: string[];
        ids: string[];
        compiled: CompiledLine[];
        inputString: string;
        lineNo: number;
        currentPosInLine: number;
        text: CanonicTextItem[];
        program: SyntaxAnalyzeState;
    }): SetAppStateAction => ({
        type: AppActions.APP_STATE,
        payload: state
    })
};

interface Action {
    type: AppActions;
}

export function appReducer(state: AppState = defaultSimState, action: Action): AppState {
    switch (action.type) {
        case AppActions.APP_STATE: {
            return {
                ...state,
                event: AppActions.APP_STATE,
                stepNo: (action as SetAppStateAction).payload.stepNo,
                spaces: (action as SetAppStateAction).payload.spaces,
                limiters: (action as SetAppStateAction).payload.limiters,
                ids: (action as SetAppStateAction).payload.ids,
                compiled: (action as SetAppStateAction).payload.compiled,
                inputString: (action as SetAppStateAction).payload.inputString,
                lineNo: (action as SetAppStateAction).payload.lineNo,
                currentPosInLine: (action as SetAppStateAction).payload.currentPosInLine,
                text: (action as SetAppStateAction).payload.text,
                program: (action as SetAppStateAction).payload.program
            };
        }
    }
    return state;
}

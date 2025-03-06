import { CompiledLine } from '@src/app.types';

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
}

export const defaultSimState: AppState = {
    event: AppActions.DEFAULT,
    stepNo: 0,
    spaces: [],
    limiters: [],
    ids: [],
    compiled: [],
    inputString: ''
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
                inputString: (action as SetAppStateAction).payload.inputString
            };
        }
    }
    return state;
}

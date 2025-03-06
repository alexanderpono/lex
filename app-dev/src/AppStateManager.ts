import { store } from '@src/store/store';
import { app } from '@src/store/appReducer';
import { CompiledLine } from './app.types';

export class AppStateManager {
    private stepNo: number = 0;
    private spaces: string[] = [];
    private limiters: string[] = [];
    private ids: string[] = [];
    private compiled: CompiledLine[];
    private inputString: string = '';

    getStepNo = () => this.stepNo;
    getSpaces = () => this.spaces;
    getLimiters = () => this.limiters;
    getIds = () => this.ids;
    getCompiled = () => this.compiled;
    getInputString = () => this.inputString;

    setStepNo = (stepNo: number) => (this.stepNo = stepNo);
    setSpaces = (spaces: string[]) => (this.spaces = spaces);
    setLimiters = (limiters: string[]) => (this.limiters = limiters);
    setIds = (ids: string[] = []) => (this.ids = ids);
    setCompiled = (compiled: CompiledLine[]) => (this.compiled = compiled);
    setInputString = (inputString: string) => (this.inputString = inputString);

    getAppState = () => {
        return {
            stepNo: this.getStepNo(),
            spaces: this.getSpaces(),
            limiters: this.getLimiters(),
            ids: this.getIds(),
            compiled: this.getCompiled(),
            inputString: this.getInputString()
        };
    };

    mirrorState = () => {
        store.dispatch(app.setSimState(this.getAppState()));
    };
}

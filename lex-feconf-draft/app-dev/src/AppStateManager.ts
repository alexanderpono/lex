import { store } from '@src/store/store';
import { app } from '@src/store/appReducer';
import {
    CanonicTextItem,
    CompiledLine,
    defaultSyntaxAnalyzeState,
    SyntaxAnalyzeState
} from './app.types';

export class AppStateManager {
    private stepNo: number = 0;
    private spaces: string[] = [];
    private limiters: string[] = [];
    private ids: string[] = [];
    private strings: string[] = [];
    private compiled: CompiledLine[];
    private inputString: string = '';
    private lineNo: number = 0;
    private currentPosInLine: number = 0;
    private text: CanonicTextItem[] = [];
    private program: SyntaxAnalyzeState = { ...defaultSyntaxAnalyzeState };
    private consoleText: string = '';

    getStepNo = () => this.stepNo;
    getSpaces = () => this.spaces;
    getLimiters = () => this.limiters;
    getIds = () => this.ids;
    getStrings = () => this.strings;
    getCompiled = () => this.compiled;
    getInputString = () => this.inputString;
    getLineNo = () => this.lineNo;
    getCurrentPosInLine = () => this.currentPosInLine;
    getText = () => this.text;
    getProgram = () => this.program;
    getConsoleText = () => this.consoleText;

    setStepNo = (stepNo: number) => (this.stepNo = stepNo);
    setSpaces = (spaces: string[]) => (this.spaces = spaces);
    setLimiters = (limiters: string[]) => (this.limiters = limiters);
    setIds = (ids: string[] = []) => (this.ids = ids);
    setStrings = (strings: string[] = []) => (this.strings = strings);
    setCompiled = (compiled: CompiledLine[]) => (this.compiled = compiled);
    setInputString = (inputString: string) => (this.inputString = inputString);
    setLineNo = (lineNo: number) => (this.lineNo = lineNo);
    setCurrentPosInLine = (currentPosInLine: number) => (this.currentPosInLine = currentPosInLine);
    setText = (text: CanonicTextItem[]) => (this.text = text);
    setProgram = (program: SyntaxAnalyzeState) => (this.program = program);
    setConsoleText = (consoleText: string) => (this.consoleText = consoleText);

    getAppState = () => {
        return {
            stepNo: this.getStepNo(),
            spaces: this.getSpaces(),
            limiters: this.getLimiters(),
            ids: this.getIds(),
            compiled: this.getCompiled(),
            inputString: this.getInputString(),
            lineNo: this.getLineNo(),
            currentPosInLine: this.getCurrentPosInLine(),
            text: this.getText(),
            program: this.getProgram()
        };
    };

    mirrorState = () => {
        store.dispatch(app.setSimState(this.getAppState()));
    };
}

#if !defined(_APP_STATE_MANAGER_H_)
#define _APP_STATE_MANAGER_H_

#include "StringVector.h"
#include "AppState.h"

class AppStateManager {
    public:
        AppStateManager() {
            this->appState.stepNo = 0;
            this->appState.lineNo = 0;
            this->appState.currentPosInLine = 0;
        };

    private:
        AppState appState;

    public:
        unsigned int getStepNo();
        StringVector getSpaces();
        StringVector getLimiters();
        StringVector getIds();
        StringVector getStrings();
// //         getCompiled = () => this.compiled;
        std::string getInputString();
        unsigned int getLineNo();
        unsigned int getCurrentPosInLine();
        AppState getAppState();
//         getText = () => this.text;
//         getProgram = () => this.program;
//         getConsoleText = () => this.consoleText;

        void setStepNo(unsigned int stepNo);
        void setSpaces(StringVector spaces);

};

#endif //_APP_STATE_MANAGER_H_

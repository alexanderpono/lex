#if !defined(_APP_STATE_MANAGER_H_)
#define _APP_STATE_MANAGER_H_

#include "StringVector.h"
#include "AppState.h"
#include "CompiledLineVector.h"
#include "CanonicTextItemVector.h"

class AppStateManager {
    public:
        AppStateManager();

    private:
        AppState appState;

    public:
        AppState getAppState();

        StringVector getLimiters();
        StringVector getSpaces();

        AppStateManager *setStepNo(unsigned int stepNo);
        AppStateManager *setLineNo(unsigned int lineNo);
        AppStateManager *setCurrentPosInLine(unsigned int currentPosInLine);
        AppStateManager *setInputString(std::string inputString);
        AppStateManager *setSpaces(StringVector spaces);
        AppStateManager *setLimiters(StringVector limiters);
        AppStateManager *setIds(StringVector ids);
        AppStateManager *setStrings(StringVector strings);
        AppStateManager *setCompiled(CompiledLineVector compiled);
        AppStateManager *setText(CanonicTextItemVector text);

        unsigned int getStepNo();
        std::string getInputString();
        CompiledLineVector getCompiled();
        CanonicTextItemVector getText();

};

#endif //_APP_STATE_MANAGER_H_

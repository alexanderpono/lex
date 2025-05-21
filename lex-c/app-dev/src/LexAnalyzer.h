#if !defined(_APP_LEX_ANALYZER_H_)
#define _APP_LEX_ANALYZER_H_

#include "AppStateManager.h"

class LexAnalyzer {
    private:
        AppStateManager *stateManager;
    
    public:
        LexAnalyzer(AppStateManager *stateManager);
        void compile();
};

#endif //_APP_LEX_ANALYZER_H_
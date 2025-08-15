#if !defined(_SYNTAX_ANALYZER_H_)
#define _SYNTAX_ANALYZER_H_

#include "AppStateManager.h"
#include "SyntaxAnalyzeState.h"

class SyntaxAnalyzer {
    private:
        AppStateManager *stateManager;
        bool isDebug;
        
        void isProgram(SyntaxAnalyzeState *state, SyntaxAnalyzeState *isProgram);
        void isCall(SyntaxAnalyzeState *state, SyntaxAnalyzeState *isCall);
        void isAnyId(SyntaxAnalyzeState *state, SyntaxAnalyzeState *isAnyId);
        void isLimiter(SyntaxAnalyzeState *state, SyntaxAnalyzeState *isLimiter, std::string lexem);
        void isParametersList(SyntaxAnalyzeState *state, SyntaxAnalyzeState *isParametersList);
        void isExpression(SyntaxAnalyzeState *state, SyntaxAnalyzeState *isExpression);
        void isTherm(SyntaxAnalyzeState *state, SyntaxAnalyzeState *isTherm);
        void isFactor(SyntaxAnalyzeState *state, SyntaxAnalyzeState *isFactor);
        void isNumber(SyntaxAnalyzeState *state, SyntaxAnalyzeState *isNumber);
        void isAnyString(SyntaxAnalyzeState *state, SyntaxAnalyzeState *isAnyString);

    public:
        SyntaxAnalyzer(AppStateManager *stateManager, bool isDebug);
        void analyzeSyntax(SyntaxAnalyzeState *state);
};

#endif //_SYNTAX_ANALYZER_H_;
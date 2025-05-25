#if !defined(_APP_CONTROLLER_BUILDER_H_)
#define _APP_CONTROLLER_BUILDER_H_

#include "StringVector.h"
#include "LexAnalyzer.h"
#include "SyntaxAnalyzer.h"

class AppControllerBuilder {
    public:
        unsigned int maxCalcStep;
        StringVector spaces;
        StringVector limiters;
        LexAnalyzer *lex;
        std::string inputString;
        SyntaxAnalyzer *syntax;

        AppControllerBuilder *setMaxCalcStep(unsigned int maxCalcStep);
        AppControllerBuilder *setLimiters(StringVector limiters);
        AppControllerBuilder *setSpaces(StringVector spaces);
        AppControllerBuilder *setLex(LexAnalyzer *lex);
        AppControllerBuilder *setInputString(std::string inputString);
        AppControllerBuilder *setSyntax(SyntaxAnalyzer *syntax);
};

#endif //_APP_CONTROLLER_BUILDER_H_

#if !defined(_APP_CONTROLLER_BUILDER_H_)
#define _APP_CONTROLLER_BUILDER_H_

#include "StringVector.h"
#include "LexAnalyzer.h"

class AppControllerBuilder {
    public:
        unsigned int maxCalcStep;
        StringVector spaces;
        StringVector limiters;
        LexAnalyzer *lex;

        AppControllerBuilder *setMaxCalcStep(unsigned int maxCalcStep);
        AppControllerBuilder *setLimiters(StringVector limiters);
        AppControllerBuilder *setSpaces(StringVector spaces);
        AppControllerBuilder *setLex(LexAnalyzer *lex);
};

#endif //_APP_CONTROLLER_BUILDER_H_

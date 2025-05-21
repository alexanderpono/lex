#if !defined(_APP_STATE_H_)
#define _APP_STATE_H_

#include "StringVector.h"
#include "CompiledLineVector.h"

class AppState {
    public:

        unsigned int stepNo;
        StringVector spaces;
        StringVector limiters;
        StringVector ids;
        StringVector strings;
        CompiledLineVector compiled;
        std::string inputString;
        unsigned int lineNo;
        unsigned int currentPosInLine;

        std::string toString();
        std::string strVectorToString(StringVector ar);
        std::string compiledLineVectorToString(CompiledLineVector compiled);
        std::string tableToString(Table t);
};

#endif //_APP_STATE_H_

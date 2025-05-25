#if !defined(_APP_STATE_H_)
#define _APP_STATE_H_

#include "StringVector.h"
#include "CompiledLineVector.h"
#include "CanonicTextItemVector.h"
#include "SyntaxAnalyzeState.h"

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
        CanonicTextItemVector text;
        SyntaxAnalyzeState program;

        std::string toString();
        std::string strVectorToString(StringVector ar);
        std::string canocicTextVectorToString(CanonicTextItemVector text);
    private:
        std::string compiledLineVectorToString(CompiledLineVector compiled);
        std::string tableToString(Table t);
};

#endif //_APP_STATE_H_

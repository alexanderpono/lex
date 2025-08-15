#if !defined(_SYNTAX_ANALYZER_STATE_H_)
#define _SYNTAX_ANALYZER_STATE_H_

// #include "AppStateManager.h"
#include "SyntaxNode.h"
#include <string>
#include "CanonicTextItemVector.h"

class SyntaxAnalyzeState {
    public:
        bool code;
        int pos;
        SyntaxAnalyzeState *parameters;
        int id;
        int valPos;
        SyntaxNode type;
        std::string error;
        std::string operation;
        SyntaxAnalyzeState *operand1;
        SyntaxAnalyzeState *operand2;

        void clear();
        std::string toString(std::string prefix, CanonicTextItemVector text);
        void setNO(int pos);
        ~SyntaxAnalyzeState();
    
    private:
        std::string syntaxNodeToString(SyntaxNode node);

};

#endif //_SYNTAX_ANALYZER_STATE_H_;
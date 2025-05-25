#if !defined(_APP_LEX_ANALYZER_H_)
#define _APP_LEX_ANALYZER_H_

#include "AppStateManager.h"
#include "IndexData.h"
#include "AppDocument.h"

class LexAnalyzer {
    private:
        AppStateManager *stateManager;
    
        void getIndex(std::string s, CompiledLineVector compiled, IndexData *result);
        void addIdToText(
            std::string newId,
            int lineNo,
            int currentPosInLine,
            AppDocument *doc
        );
        void addLimiterOrSpaceToText(
            IndexData indexData,
            int lineNo,
            int currentPosInLine,
            AppDocument *doc
        );
        std::string concatString (CanonicTextItemVector srcText);
        void addStringToText (
            std::string newId,
            int lineNo,
            int currentPosInLine,
            AppDocument *doc
        );    
    public:
        LexAnalyzer(AppStateManager *stateManager);
        void compile();
        void parseText(std::string srcText);
        void buildStrings();
        void removeComments();
        void removeWhitespace();
};

#endif //_APP_LEX_ANALYZER_H_
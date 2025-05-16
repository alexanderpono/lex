#if !defined(_APP_STATE_H_)
#define _APP_STATE_H_

#include "StringVector.h"

class AppState {
    public:

        unsigned int stepNo;
        StringVector spaces;
        StringVector limiters;
        StringVector ids;
        StringVector strings;
        std::string inputString;
        unsigned int lineNo;
        unsigned int currentPosInLine;

        std::string toString();
        std::string strVectorToString(StringVector ar);
};

#endif //_APP_STATE_H_

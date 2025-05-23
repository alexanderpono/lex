#if !defined(_APP_DOCUMENT_H_)
#define _APP_DOCUMENT_H_

#include "StringVector.h"
#include "CompiledLineVector.h"
#include "CanonicTextItemVector.h"

class AppDocument {
    public:
        StringVector spaces;
        StringVector limiters;
        StringVector ids;
        StringVector strings;
        CompiledLineVector compiled;
        CanonicTextItemVector text;
};

#endif //_APP_DOCUMENT_H_

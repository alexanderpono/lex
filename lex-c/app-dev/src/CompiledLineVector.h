#if !defined(_COMPILED_LINE_VECTOR_H_)
#define _COMPILED_LINE_VECTOR_H_

#include <string>
#include <vector>
#include "Table.h"

class CompiledLine {
    public:
        Table tableId;
        int tableIndex;
        std::string lexem;

        void setDefault();
};
typedef std::vector<CompiledLine> CompiledLineVector;

#endif //_COMPILED_LINE_VECTOR_H_
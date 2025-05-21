#if !defined(_CANONIC_TEXT_ITEM_VECTOR_H_)
#define _CANONIC_TEXT_ITEM_VECTOR_H_

#include <string>
#include <vector>
#include "Table.h"

struct CanonicTextItem {
    Table tableId;
    int tableIndex;
    int lineNo;
    int pos;
    std::string lexem;

};
typedef std::vector<CanonicTextItem> CanonicTextItemVector;

#endif //_CANONIC_TEXT_ITEM_VECTOR_H_
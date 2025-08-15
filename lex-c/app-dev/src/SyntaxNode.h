#if !defined(_SYNTAX_NODE_H_)
#define _SYNTAX_NODE_H_

enum class SyntaxNode: char {
    DEFAULT = ' ',
    PARAMETERS = 'p',
    STRING = 's',
    ID = 'i',
    LIMITER = 'l',
    CALL = 'c',
    EXPRESSION = 'e'
};

#endif //_SYNTAX_NODE_H_
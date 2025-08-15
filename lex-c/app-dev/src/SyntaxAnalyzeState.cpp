#include "SyntaxAnalyzeState.h"

SyntaxAnalyzeState::~SyntaxAnalyzeState() {
    if (this->operand1) {
        delete this->operand1;
        this->operand1 = nullptr;
    }
    if (this->operand2) {
        delete this->operand2;
        this->operand2 = nullptr;
    }
}

void SyntaxAnalyzeState::clear() {
    this->code = false;
    this->pos = 0;
    this->parameters = nullptr;
    this->type = SyntaxNode::DEFAULT;
    this->error = "";
    this->operation = "";
    this->operand1 = nullptr;
    this->operand2 = nullptr;
    this->id = 0;
    this->valPos = 0;
}

std::string SyntaxAnalyzeState::toString(std::string prefix, CanonicTextItemVector text) {
    std::string body(
        prefix + "{"
        + "\n   code: " + std::to_string(this->code) 
        + ",\n   pos: " + std::to_string(this->pos) 
        + ",\n   type: " + this->syntaxNodeToString(this->type)
        
    );
    if (this->type == SyntaxNode::CALL) {
        CanonicTextItem *token = &text[this->valPos];
        body = body + ",\n   func: " + token->lexem;

        if (this->parameters->type == SyntaxNode::STRING) {
            CanonicTextItem *paremeterStringToken = &text[this->parameters->valPos];
            body = body + ",\n   parameter: " + paremeterStringToken->lexem;
        }
    }
    std::string result( 
        body
        + "\n}\n");
    return result;
}

std::string SyntaxAnalyzeState::syntaxNodeToString(SyntaxNode node) {
    switch (node) {
        case SyntaxNode::PARAMETERS:
            return "PARAMETERS";

        case SyntaxNode::STRING:
            return "STRING";

        case SyntaxNode::ID: 
            return "ID";

        case SyntaxNode::LIMITER: 
            return "LIMITER";

        case SyntaxNode::CALL: 
            return "CALL";

        case SyntaxNode::EXPRESSION: 
            return "EXPRESSION";

        default:
            return "";
    }

};

void SyntaxAnalyzeState::setNO(int pos) {
    this->code = false;
    this->pos = pos;
    this->type = SyntaxNode::DEFAULT;
};
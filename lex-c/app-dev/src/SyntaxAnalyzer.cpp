#include "SyntaxAnalyzer.h"
#include <iostream>

SyntaxAnalyzer::SyntaxAnalyzer(AppStateManager *stateManager, bool isDebug) {
    this->stateManager = stateManager;
    this->isDebug = isDebug;
};

void SyntaxAnalyzer::analyzeSyntax(SyntaxAnalyzeState *resultState) {
    CanonicTextItemVector text = this->stateManager->getText();

    SyntaxAnalyzeState state;
    state.clear();

    SyntaxAnalyzeState isProgram;
    isProgram.clear();
    this->isProgram(&state, &isProgram);
    if (this->isDebug) {
        std::cout << isProgram.toString("SyntaxAnalyzer::analyzeSyntax() isProgram=", text);
    }

    if (isProgram.code && abs(isProgram.pos) == text.size()) {
        if (this->isDebug) {
            std::cout << state.toString("SyntaxAnalyzer::analyzeSyntax() syntax check OK", text);
        }
        resultState->code = isProgram.code;
        resultState->pos = isProgram.pos;
        resultState->type = isProgram.type;
        resultState->valPos = isProgram.valPos;
        resultState->id = isProgram.id;
        resultState->parameters = isProgram.parameters;
        this->stateManager->setProgram(&isProgram);
    } else {
        if (this->isDebug) {
            std::cout << state.toString("SyntaxAnalyzer::analyzeSyntax() syntax check failed", text);
        }
        resultState->setNO(state.pos);
    }

};

void SyntaxAnalyzer::isProgram(SyntaxAnalyzeState *state, SyntaxAnalyzeState *isProgram) {
    this->isCall(state, isProgram);
};

void SyntaxAnalyzer::isCall(SyntaxAnalyzeState *state, SyntaxAnalyzeState *isCall) {
    SyntaxAnalyzeState isId;
    isId.clear();

    this->isAnyId(state, &isId);
    if (!isId.code) {
        isCall->setNO(state->pos);
        return;
    }
    if (this->isDebug) {
        std::cout << isId.toString("SyntaxAnalyzer::isCall() isId=", this->stateManager->getText());
    }
    SyntaxAnalyzeState isOpen;
    isOpen.clear();
    this->isLimiter(&isId, &isOpen, "(");
    if (this->isDebug) {
        std::cout << isOpen.toString("SyntaxAnalyzer::isCall() isOpen=", this->stateManager->getText());
    }
    if (!isOpen.code) {
        isCall->setNO(state->pos);
        return;
    }
    SyntaxAnalyzeState isParametersList;
    isParametersList.clear();
    this->isParametersList(&isOpen, &isParametersList);
    if (!isParametersList.code) {
        isCall->setNO(state->pos);
        return;
    }
    SyntaxAnalyzeState isClose;
    isClose.clear();
    this->isLimiter(&isParametersList, &isClose, ")");
    if (!isClose.code) {
        isCall->setNO(state->pos);
        return;
    }

    SyntaxAnalyzeState isSemicolon;
    isSemicolon.clear();
    this->isLimiter(&isClose, &isSemicolon, ";");
    if (!isSemicolon.code) {
        isCall->setNO(isClose.pos);
    }

    isCall->code = isSemicolon.code;
    isCall->pos = isSemicolon.pos;
    isCall->type = SyntaxNode::CALL;
    isCall->id = isId.valPos;
    isCall->parameters = new SyntaxAnalyzeState(isParametersList);
};

void SyntaxAnalyzer::isAnyId(SyntaxAnalyzeState *state, SyntaxAnalyzeState *isAnyId) {
    CanonicTextItemVector text = this->stateManager->getText();
    CanonicTextItem *token = &text[state->pos];
    if (token->tableId == Table::IDS) {
        isAnyId->code = true;
        isAnyId->pos = state->pos + 1;
        isAnyId->type = SyntaxNode::ID;
        isAnyId->valPos = state->pos;
        return;
    }
    isAnyId->setNO(state->pos);
};

void SyntaxAnalyzer::isLimiter(SyntaxAnalyzeState *state, SyntaxAnalyzeState *isLimiter, std::string lexem) {
    CanonicTextItemVector text = this->stateManager->getText();
    CanonicTextItem *token = &text[state->pos];
    if (token->tableId == Table::LIMITERS && token->lexem == lexem) {
        isLimiter->code = true;
        isLimiter->pos = state->pos + 1;
        isLimiter->type = SyntaxNode::LIMITER;
        return;
    }
    isLimiter->setNO(state->pos);
};

void SyntaxAnalyzer::isParametersList(SyntaxAnalyzeState *state, SyntaxAnalyzeState *isParametersList) {
    SyntaxAnalyzeState isExpression;
    isExpression.clear();
    this->isExpression(state, &isExpression);
    if (isExpression.code) {
        isParametersList->code = isExpression.code;
        isParametersList->pos = isExpression.pos;
        isParametersList->error = isExpression.error;
        isParametersList->operand1 = isExpression.operand1;
        isParametersList->operation = isExpression.operation;
        isParametersList->operand2 = isExpression.operand2;
        isParametersList->type = isExpression.type;
        isParametersList->valPos = isExpression.valPos;
    }

    SyntaxAnalyzeState isString;
    isString.clear();
    this->isAnyString(state, &isString);
    if (!isString.code) {
        isParametersList->setNO(state->pos);
        return;
    }
    SyntaxAnalyzeState isColon;
    isColon.clear();
    this->isLimiter(&isString, &isColon, ",");

    if (!isColon.code) {
        isParametersList->code = isString.code;
        isParametersList->pos = isString.pos;
        isParametersList->type = isString.type;
        isParametersList->valPos = isString.valPos;
        return;
    }
    SyntaxAnalyzeState isParametersListResult;
    isParametersListResult.clear();
    this->isParametersList(&isColon, &isParametersListResult);
    if (!isParametersListResult.code) {
        isParametersList->setNO(state->pos);
        return;
    }
    isParametersList->code = isParametersListResult.code;
    isParametersList->pos = isParametersListResult.pos;
    isParametersList->type = isParametersListResult.type;
    isParametersList->valPos = isParametersListResult.valPos;
};

void SyntaxAnalyzer::isExpression(SyntaxAnalyzeState *state, SyntaxAnalyzeState *isExpression) {
    SyntaxAnalyzeState isTherm;
    isTherm.clear();
    this->isTherm(state, &isTherm);

    if (!isTherm.code) {
        isExpression->setNO(state->pos);
        return;
    }

    SyntaxAnalyzeState isPlus;
    isPlus.clear();
    this->isLimiter(&isTherm, &isPlus, "+");

    SyntaxAnalyzeState isMinus;
    isMinus.clear();
    this->isLimiter(&isTherm, &isMinus, "-");

    if (!isPlus.code && !isMinus.code) {
        isExpression->code = isTherm.code;
        isExpression->pos = isTherm.pos;
        isExpression->type = isTherm.type;
        isExpression->valPos = isTherm.valPos;
        return;
    }

    SyntaxAnalyzeState operation = isPlus.code ? isPlus : isMinus;
    SyntaxAnalyzeState isExpressionResult;
    isExpressionResult.clear();
    this->isExpression(&operation, &isExpressionResult);
    if (!isExpressionResult.code) {
        isExpression->code = false;
        isExpression->pos = operation.pos;
        isExpression->type = SyntaxNode::DEFAULT;
        isExpression->error = "expression expected";
        return;
    }

    isExpression->code = isExpressionResult.code;
    isExpression->pos = isExpressionResult.pos;
    isExpression->error = isExpressionResult.error;
    isExpression->operand1 = new SyntaxAnalyzeState(isTherm);
    isExpression->operation = isPlus.code ? "+" : "-";
    isExpression->operand2 = new SyntaxAnalyzeState(isExpressionResult);
    isExpression->type = SyntaxNode::EXPRESSION;
    isExpression->valPos = -1;
};

void SyntaxAnalyzer::isTherm(SyntaxAnalyzeState *state, SyntaxAnalyzeState *isTherm) {
    SyntaxAnalyzeState isFactor;
    isFactor.clear();
    this->isFactor(state, &isFactor);
    if (!isFactor.code) {
        isTherm->setNO(state->pos);
        return;
    }

    SyntaxAnalyzeState isMult;
    isMult.clear();
    this->isLimiter(&isFactor, &isMult, "*");

    SyntaxAnalyzeState isDivide;
    isDivide.clear();
    this->isLimiter(&isFactor, &isDivide, "/");

    if (!isMult.code && !isDivide.code) {
        isTherm->code = isFactor.code;
        isTherm->pos = isFactor.pos;
        isTherm->type = isFactor.type;
        isTherm->valPos = isFactor.valPos;
        return;
    }

    SyntaxAnalyzeState operation = isMult.code ? isMult : isDivide;
    SyntaxAnalyzeState isTermResult;
    isTermResult.clear();
    this->isTherm(&operation, &isTermResult);
    if (!isTermResult.code) {
        isTherm->code = false;
        isTherm->pos = operation.pos;
        isTherm->type = SyntaxNode::DEFAULT;
        isTherm->error = "term expected";
        return;
    }

    isTherm->code = isTermResult.code;
    isTherm->pos = isTermResult.pos;
    isTherm->error = isTermResult.error;
    isTherm->operand1 = new SyntaxAnalyzeState(isFactor);
    isTherm->operation = isMult.code ? "*" : "/";
    isTherm->operand2 = new SyntaxAnalyzeState(isTermResult);
    isTherm->type = SyntaxNode::EXPRESSION;
    isTherm->valPos = -1;
};

void SyntaxAnalyzer::isFactor(SyntaxAnalyzeState *state, SyntaxAnalyzeState *isFactor) {
    SyntaxAnalyzeState isNumber;
    isNumber.clear();
    this->isNumber(state, &isNumber);
    if (isNumber.code) {
        isFactor->code = isNumber.code;
        isFactor->pos = isNumber.pos;
        isFactor->type = isNumber.type;
        isFactor->valPos = isNumber.valPos;
        return;
    }

    SyntaxAnalyzeState isOpen;
    isOpen.clear();
    this->isLimiter(&isNumber, &isOpen, "(");
    if (!isOpen.code) {
        isFactor->setNO(state->pos);
        return;
    }

    SyntaxAnalyzeState isExpression;
    isExpression.clear();
    this->isExpression(&isOpen, &isExpression);
    if (!isExpression.code) {
        isFactor->code = false;
        isFactor->pos = isOpen.pos;
        isFactor->type = SyntaxNode::DEFAULT;
        isFactor->error = "expression expected";
        return;
    }

    SyntaxAnalyzeState isClose;
    isClose.clear();
    this->isLimiter(&isExpression, &isClose, ")");
    if (!isClose.code) {
        isFactor->setNO(state->pos);
        return;
    }

    isFactor->code = isExpression.code;
    isFactor->pos = isClose.pos;
    isFactor->type = isExpression.type;
    isFactor->valPos = isExpression.valPos;
};

void SyntaxAnalyzer::isNumber(SyntaxAnalyzeState *state, SyntaxAnalyzeState *isNumber) {
    CanonicTextItemVector text = this->stateManager->getText();
    CanonicTextItem *token = &text[state->pos];
    if (token->tableId == Table::IDS) {
        try {
            int num = std::stoi(token->lexem);
            num += 0;
            isNumber->code = true;
            isNumber->pos = state->pos + 1;
            isNumber->type = SyntaxNode::ID;
            isNumber->valPos = state->pos;
            return;
        
        } catch (...) {
        }
    }
    isNumber->setNO(state->pos);
};

void SyntaxAnalyzer::isAnyString(SyntaxAnalyzeState *state, SyntaxAnalyzeState *isAnyString) {
    CanonicTextItemVector text = this->stateManager->getText();
    CanonicTextItem *token = &text[state->pos];
    if (token->tableId == Table::STRINGS) {
        isAnyString->code = true;
        isAnyString->pos = state->pos + 1;
        isAnyString->type = SyntaxNode::STRING;
        isAnyString->valPos = state->pos;
        return;
    }
    isAnyString->setNO(state->pos);
};


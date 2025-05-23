#include "AppController.h"

AppController::AppController(AppControllerBuilder *builder, AppStateManager *stateManager) {
    this->builder = builder;
    this->stateManager = stateManager;
}

void AppController::run() {
    this->stateManager->setStepNo(this->builder->maxCalcStep);
    this->stateManager->setLimiters(this->builder->limiters);
    this->stateManager->setSpaces(this->builder->spaces);
    this->builder->lex->compile();
    this->reRun();
}

void AppController::reRun() {
    this->stateManager->setInputString(this->builder->inputString);
    this->stateManager->setIds(StringVector({}));
    this->stateManager->setLineNo(0);
    this->stateManager->setCurrentPosInLine(0);
    this->stateManager->setText(CanonicTextItemVector({}));
    this->stateManager->setStrings(StringVector({}));

    this->builder->lex->parseText(this->stateManager->getInputString());

}


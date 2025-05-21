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
}
void AppController::reRun() {
}


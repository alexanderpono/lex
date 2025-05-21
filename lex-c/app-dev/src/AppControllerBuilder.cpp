#include "AppControllerBuilder.h"

AppControllerBuilder *AppControllerBuilder::setMaxCalcStep(unsigned int maxCalcStep) {
    this->maxCalcStep = maxCalcStep;
    return this;
};
AppControllerBuilder *AppControllerBuilder::setSpaces(StringVector spaces) {
    this->spaces = spaces;
    return this;
};
AppControllerBuilder *AppControllerBuilder::setLimiters(StringVector limiters) {
    this->limiters = limiters;
    return this;
};
AppControllerBuilder *AppControllerBuilder::setLex(LexAnalyzer *lex) {
    this->lex = lex;
    return this;
};
AppControllerBuilder *AppControllerBuilder::setInputString(std::string inputString) {
    this->inputString = inputString;
    return this; 
};


#include "AppStateManager.h"
#include "StringVector.h"

unsigned int AppStateManager::getStepNo() {
    return this->appState.stepNo;
};
StringVector AppStateManager::getSpaces() {
    return this->appState.spaces;
};
StringVector AppStateManager::getLimiters() {
    return this->appState.limiters;
};
StringVector AppStateManager::getIds() {
    return this->appState.ids;
};
StringVector AppStateManager::getStrings() {
    return this->appState.strings;
};
// //         getCompiled = () => this.compiled;
std::string AppStateManager::getInputString() {
    return this->appState.inputString;
};
unsigned int AppStateManager::getLineNo() {
    return this->appState.lineNo;
};
unsigned int AppStateManager::getCurrentPosInLine() {
    return this->appState.currentPosInLine;
};

AppState AppStateManager::getAppState() {
    return this->appState;
};


void AppStateManager::setStepNo(unsigned int stepNo) {
    this->appState.stepNo = stepNo;
};
void AppStateManager::setSpaces(StringVector spaces) {
    this->appState.spaces = spaces;
};

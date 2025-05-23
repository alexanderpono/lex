#include "AppStateManager.h"
#include "StringVector.h"

AppStateManager::AppStateManager() {
    this->appState.stepNo = 0;
    this->appState.lineNo = 0;
    this->appState.currentPosInLine = 0;
};
AppState AppStateManager::getAppState() {
    return appState;
};
StringVector AppStateManager::getLimiters() {
    return this->appState.limiters;
};
StringVector AppStateManager::getSpaces() {
    return this->appState.spaces;
};
AppStateManager *AppStateManager::setStepNo(unsigned int stepNo) {
    this->appState.stepNo = stepNo;
    return this;
};
AppStateManager *AppStateManager::setLineNo(unsigned int lineNo) {
    this->appState.lineNo = lineNo;
    return this;
};
AppStateManager *AppStateManager::setCurrentPosInLine(unsigned int currentPosInLine) {
    this->appState.currentPosInLine = currentPosInLine;
    return this;
};
AppStateManager *AppStateManager::setInputString(std::string inputString) {
    this->appState.inputString = inputString;
    return this;
}
AppStateManager *AppStateManager::setSpaces(StringVector spaces) {
    this->appState.spaces = spaces;
    return this;
};
AppStateManager *AppStateManager::setLimiters(StringVector limiters) {
    this->appState.limiters = limiters;
    return this;
};
AppStateManager *AppStateManager::setIds(StringVector ids) {
    this->appState.ids = ids;
    return this;
};
AppStateManager *AppStateManager::setStrings(StringVector strings) {
    this->appState.strings = strings;
    return this;
};
AppStateManager *AppStateManager::setCompiled(CompiledLineVector compiled) {
    this->appState.compiled = compiled;
    return this;
}
AppStateManager *AppStateManager::setText(CanonicTextItemVector text) {
    this->appState.text = text;
    return this;
}
unsigned int AppStateManager::getStepNo() {
    return this->appState.stepNo;
};
std::string AppStateManager::getInputString() {
    return this->appState.inputString;
}
CompiledLineVector AppStateManager::getCompiled() {
    return this->appState.compiled;
}
CanonicTextItemVector AppStateManager::getText() {
    return this->appState.text;
}
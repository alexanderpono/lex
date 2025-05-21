#include "AppState.h"

std::string AppState::toString() {
    std::string result( 
        + "{\n   stepNo: " + std::to_string(this->stepNo) 
        + ",\n   spaces: [" + this->strVectorToString(this->spaces)
        + "],\n   limiters: [" + this->strVectorToString(this->limiters)
        + "],\n   ids: [" + this->strVectorToString(this->ids)
        + "],\n   strings: [" + this->strVectorToString(this->strings)
        + "],\n   compiled: [" + this->compiledLineVectorToString(this->compiled)
        + "],\n   inputString: \"" + this->inputString 
        + "\",\n   lineNo: " + std::to_string(this->lineNo) 
        + ",\n   currentPosInLine: " + std::to_string(this->currentPosInLine) 
        + "\n}");
    return result;
}

std::string AppState::strVectorToString(StringVector ar) {
    std::string result;
    std::string colon = "";
    for(const std::string& s : ar) {
        result = result + colon + "\"" + s + "\"";
        colon = ", ";
    }
    return result;
};

std::string AppState::compiledLineVectorToString(CompiledLineVector compiled) {
    std::string result;
    std::string colon = "";
    for(const CompiledLine& line : compiled) {
        result = result + colon 
        + "{ " + this->tableToString(line.tableId) + ":" + std::to_string(line.tableIndex) + ", lexem: \"" + line.lexem + "\" }";
        colon = ",\n      ";
    }
    return result != "" ? "\n      " + result + "\n   ": result;

}

std::string AppState::tableToString(Table t) {
    switch (t) {
        case Table::LIMITERS: 
            return "l";

        case Table::SPACES: 
            return "s";

        case Table::IDS: 
            return "i";

        case Table::STRINGS: 
            return "str";

        default:
            return "";
    }
}

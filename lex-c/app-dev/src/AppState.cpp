#include "AppState.h"

std::string AppState::toString() {
    std::string result("{ lineNo: " 
        + std::to_string(this->lineNo) 
        + ", spaces:["+this->strVectorToString(this->spaces)
        + "] }");
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


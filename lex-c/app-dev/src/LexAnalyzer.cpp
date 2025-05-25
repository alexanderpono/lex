#include "LexAnalyzer.h"
#include "AppDocument.h"
#include <algorithm>
#include <iostream>

const int NOT_FOUND = 1000;

LexAnalyzer::LexAnalyzer(AppStateManager *stateManager) {
    this->stateManager = stateManager;
};

void LexAnalyzer::compile() {
    StringVector limiters = this->stateManager->getLimiters();
    StringVector spaces = this->stateManager->getSpaces();

    CompiledLineVector compiled;
    int i = 0;
    for (StringVector::iterator lim = limiters.begin(); lim != limiters.end(); ++lim) {
        compiled.push_back(
            CompiledLine({
                Table::LIMITERS,
                i,
                *lim
            })
        );
        i++;
    }

    i = 0;
    for (StringVector::iterator s = spaces.begin(); s != spaces.end(); ++s) {
        compiled.push_back(
            CompiledLine({
                Table::SPACES,
                i,
                *s
            })
        );
        i++;
    }
    this->stateManager->setCompiled(compiled);
}

void LexAnalyzer::parseText(std::string srcText) {
    std::string buf = srcText;

    int iter = 0;
    int MAX_ITER = this->stateManager->getStepNo();
    int currentPosInLine = 1;
    int lineNo = 1;

    AppDocument *document = new AppDocument();
    document->spaces = this->stateManager->getSpaces();
    document->limiters = this->stateManager->getLimiters();
    document->ids = StringVector({});
    document->compiled = this->stateManager->getCompiled();
    document->text = CanonicTextItemVector({});
    document->strings = StringVector({});

    while (buf.length() > 0 && iter < MAX_ITER) {
        IndexData indexData;
        this->getIndex(buf, document->compiled, &indexData);
        if (indexData.pos != NOT_FOUND) {
            bool limiterOrSpaceNotInBufStart = indexData.pos > 0;
            if (limiterOrSpaceNotInBufStart) {
                std::string newId = buf.substr(0, indexData.pos);
                this->addIdToText(newId, lineNo, currentPosInLine, document);
                currentPosInLine += newId.length();
                buf = buf.substr(indexData.pos);
            } else {
                this->addLimiterOrSpaceToText(
                    indexData,
                    lineNo,
                    currentPosInLine,
                    document
                );
                CompiledLine compiledLine = document->compiled[indexData.compiledLineIndex];
                currentPosInLine += compiledLine.lexem.length();
                buf = buf.substr(compiledLine.lexem.length());
                if (compiledLine.lexem == "\n") {
                    lineNo++;
                    currentPosInLine = 1;
                }
            }
        } else {
            this->addIdToText(buf, lineNo, currentPosInLine, document);
            buf = "";
        }
        iter++;
    }
    this->stateManager->setInputString(buf);
    this->stateManager->setText(document->text);
    this->stateManager->setIds(document->ids);
    this->stateManager->setLineNo(lineNo);
    this->stateManager->setCurrentPosInLine(currentPosInLine);
    delete document;
}

void LexAnalyzer::getIndex(std::string s, CompiledLineVector compiled, IndexData *result) {
    int bestIndex = NOT_FOUND;
    CompiledLine *bestCompiledLine = NULL;

    for (CompiledLineVector::iterator line = compiled.begin(); line != compiled.end(); ++line) {
        int pos = s.find(line->lexem.c_str());
        if (pos >= 0) {
            if (pos < bestIndex) {
                bestIndex = pos;
                bestCompiledLine = &*line;
            }
        }
    }
    result->pos = bestIndex;
    result->compiledLineIndex = bestCompiledLine != NULL ? bestCompiledLine - &*compiled.begin() : -1;
};

void LexAnalyzer::addIdToText (
    std::string newId,
    int lineNo,
    int currentPosInLine,
    AppDocument *doc
) {
    StringVector::iterator curId;
    for (curId = doc->ids.begin(); curId != doc->ids.end(); curId++ ) {
        if (*curId == newId) {
            break;
        }
    }
    CanonicTextItem newTextItem({
        Table::IDS,
        -1,
        lineNo,
        currentPosInLine,
        newId
    });

    if (curId == doc->ids.end()) {
        doc->ids.push_back(newId);
        newTextItem.tableIndex = doc->ids.size() - 1;
    } else {
        newTextItem.tableIndex = curId - doc->ids.begin();
    }
    doc->text.push_back(newTextItem);
};

void LexAnalyzer::addLimiterOrSpaceToText(
    IndexData indexData,
    int lineNo,
    int currentPosInLine,
    AppDocument *doc
) {
    CompiledLine compiledLine = doc->compiled[indexData.compiledLineIndex];
    CanonicTextItem newTextItem({
        compiledLine.tableId,
        compiledLine.tableIndex,
        lineNo,
        currentPosInLine,
        compiledLine.lexem
    });
    doc->text.push_back(newTextItem);
};

void LexAnalyzer::buildStrings() {
    CanonicTextItemVector srcText = this->stateManager->getText();
    std::string state = "work";
    CanonicTextItemVector buffer({});

    AppDocument *document = new AppDocument();
    document->spaces = this->stateManager->getSpaces();
    document->limiters = this->stateManager->getLimiters();
    document->ids = StringVector({});
    document->compiled = this->stateManager->getCompiled();
    document->text = CanonicTextItemVector({});
    document->strings = StringVector({});    

    CanonicTextItemVector::iterator token;
    for (token = srcText.begin(); token != srcText.end(); token++ ) {
        if (state == "work" && token->lexem == "'") {
            state = "openedString";
            continue;
        }
        if (state == "openedString" && token->lexem == "'") {
            std::string newId = this->concatString(buffer);

            CanonicTextItem token = buffer[0];
            this->addStringToText(newId, token.lineNo, token.pos, document);
            buffer = CanonicTextItemVector({});
            state = "work";
            continue;
        }
        if (state == "openedString" && token->lexem == "\n") {
            std::cout << "Незавершенная строковая константа" << std::endl;

            CanonicTextItemVector::iterator bufToken;
            for (bufToken = buffer.begin(); bufToken != buffer.end(); bufToken++ ) {
                document->text.push_back(*bufToken);
            };
        
            buffer = CanonicTextItemVector({});
            continue;
        }
        if (state == "openedString") {
            buffer.push_back(*token);
            continue;
        }
        if (state == "work") {
            if (token->tableId == Table::IDS) {
                this->addIdToText(token->lexem, token->lineNo, token->pos, document);
            } else {
                document->text.push_back(*token);
            }
            continue;
        }
    }    

    this->stateManager->setText(document->text);
    this->stateManager->setIds(document->ids);
    this->stateManager->setStrings(document->strings);

    delete document;
};

std::string LexAnalyzer::concatString (CanonicTextItemVector srcText) {
    std::string result;
    CanonicTextItemVector::iterator token;
    for (token = srcText.begin(); token != srcText.end(); token++ ) {
        result = result + token->lexem;
    }
    return result;
};

void LexAnalyzer::addStringToText (
    std::string newId,
    int lineNo,
    int currentPosInLine,
    AppDocument *doc
) {
    StringVector::iterator curString;
    for (curString = doc->strings.begin(); curString != doc->strings.end(); curString++ ) {
        if (*curString == newId) {
            break;
        }
    }
    CanonicTextItem newTextItem({
        Table::STRINGS,
        -1,
        lineNo,
        currentPosInLine,
        newId
    });

    if (curString == doc->strings.end()) {
        doc->strings.push_back(newId);
        newTextItem.tableIndex = doc->strings.size() - 1;
    } else {
        newTextItem.tableIndex = curString - doc->strings.begin();
    }
    doc->text.push_back(newTextItem);
};

void LexAnalyzer::removeComments() {
    CanonicTextItemVector srcText = this->stateManager->getText();
    std::string state = "work";
    CanonicTextItemVector buffer({});

    AppDocument *document = new AppDocument();
    document->spaces = this->stateManager->getSpaces();
    document->limiters = this->stateManager->getLimiters();
    document->ids = StringVector({});
    document->compiled = this->stateManager->getCompiled();
    document->text = CanonicTextItemVector({});
    document->strings = StringVector({});    

    CanonicTextItemVector::iterator token;
    for (token = srcText.begin(); token != srcText.end(); token++ ) {
        if (state == "work" && token->lexem == "/") {
            buffer.push_back(*token);
            state = "firstSlash";
            continue;
        }
        if (state == "firstSlash" && token->lexem == "/") {
            state = "comment";
            continue;
        }
        if (state == "comment" && token->lexem == "\n") {
            document->text.push_back(*token);
            state = "work";
            continue;
        }
        if (state == "firstSlash") {
            CanonicTextItem buf0 = buffer[0];
            document->text.push_back(buf0);
            buffer = CanonicTextItemVector({});
            document->text.push_back(*token);
            state = "work";
            continue;
        }
        if (state == "work") {
            switch (token->tableId) {
                case Table::IDS:
                    this->addIdToText(token->lexem, token->lineNo, token->pos, document);
                    break;

                case Table::STRINGS:
                    this->addStringToText(token->lexem, token->lineNo, token->pos, document);
                    break;

                default:
                    document->text.push_back(*token);
                    break;
            }
            continue;
        }

    };
    this->stateManager->setText(document->text);
    this->stateManager->setIds(document->ids);
    this->stateManager->setStrings(document->strings);
};


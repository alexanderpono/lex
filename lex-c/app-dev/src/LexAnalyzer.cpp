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
    unsigned int i = 0;
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
    document->compiled = CompiledLineVector({});
    document->text = CanonicTextItemVector({});
    document->strings = StringVector({});

    while (buf.length() > 0 && iter < MAX_ITER) {
        IndexData indexData;
        this->getIndex(buf, document->compiled, &indexData);
        if (indexData.pos != NOT_FOUND) {
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
    result->lexem = bestCompiledLine;
};

// bool isFound(std::string id){ return id === > 10;}

void LexAnalyzer::addIdToText (
    std::string newId,
    int lineNo,
    int currentPosInLine,
    AppDocument *doc
) {
    auto hello { [](){std::cout << "Hello" << std::endl;} };
    auto condition { [newId](std::string id){return id == newId;} };

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
    // int posInIds = std::find_if(doc->ids.begin(), doc->ids.end(), [newId](std::string id){return id == newId;});
    // const newDoc = { ...doc };
    // let newTextItem: CanonicTextItem = {
    //     tableId: Table.IDS,
    //     tableIndex: posInIds,
    //     lineNo,
    //     pos: currentPosInLine,
    //     lexem: newId
    // };
    // if (posInIds < 0) {
    //     newDoc.ids = [...newDoc.ids, newId];
    //     newTextItem.tableIndex = newDoc.ids.length - 1;
    // }

    // newDoc.text = [...newDoc.text, newTextItem];
    // return newDoc;
};
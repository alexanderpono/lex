#include "LexAnalyzer.h"

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

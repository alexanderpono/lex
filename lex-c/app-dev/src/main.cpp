#include <iostream>
#include "AppStateManager.h"
#include "Table.h"

using namespace std;


int main(){
    cout << "Hello World!" << endl;

    AppStateManager *stateManager = new AppStateManager();
    stateManager
        ->setStepNo(11)
        ->setLineNo(22)
        ->setCurrentPosInLine(33)
        ->setInputString("input string!")
        ->setSpaces(StringVector({" ", "\t", "\n"}))
        ->setLimiters(StringVector({";"}))
        ->setIds(StringVector({"id"}))
        ->setStrings(StringVector({"string"}))
        ->setCompiled(CompiledLineVector({
            CompiledLine({
                Table::LIMITERS,
                2,
                "lll"
            }),
            CompiledLine({
                Table::IDS,
                22,
                "id1"
            })
        }))
        ->setText(CanonicTextItemVector({
            CanonicTextItem({
                Table::LIMITERS,
                2,
                1,
                1,
                "lll"
            })
        }))
    ;

    AppState state = stateManager->getAppState();
    cout << state.toString();
    return 0;
}

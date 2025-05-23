#include <iostream>
#include "AppStateManager.h"
#include "Table.h"
#include "AppController.h"

using namespace std;


int main(){
    cout << "Hello World!" << endl;

    AppStateManager *stateManager = new AppStateManager();
    stateManager
        ->setStepNo(11)
        ->setLineNo(22)
        ->setCurrentPosInLine(33)
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

    AppControllerBuilder *builder = new AppControllerBuilder();
    builder
        ->setMaxCalcStep(11)
        ->setLimiters(StringVector({";", "(", ")"}))
        ->setSpaces(StringVector({" ", "\t", "\n"}))
        ->setLex(new LexAnalyzer(stateManager))
        ->setInputString("print();")
    ;

    AppController *ctrl = new AppController(builder, stateManager);
    ctrl->run();

    AppState state = stateManager->getAppState();
    cout << state.toString();
    return 0;
}

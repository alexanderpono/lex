#include <iostream>
#include "AppStateManager.h"
#include "Table.h"
#include "AppController.h"

using namespace std;


int main(){
    cout << "Hello World!" << endl;

    AppStateManager *stateManager = new AppStateManager();

    AppControllerBuilder *builder = new AppControllerBuilder();
    builder
        ->setMaxCalcStep(20)
        ->setLimiters(StringVector({";", "(", ")", "'", "/"}))
        ->setSpaces(StringVector({" ", "\t", "\n"}))
        ->setLex(new LexAnalyzer(stateManager))
        ->setInputString("print ('Hello world!') ; \n//alert();")
        ->setSyntax(new SyntaxAnalyzer(stateManager, true))
    ;

    AppController *ctrl = new AppController(builder, stateManager);
    ctrl->run();

    AppState state = stateManager->getAppState();
    cout << state.toString();
    return 0;
}

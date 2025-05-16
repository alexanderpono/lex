#include <iostream>
#include "AppStateManager.h"

using namespace std;


int main(){
    cout << "Hello World!" << endl;

    AppStateManager *stateManager = new AppStateManager();
    StringVector spaces = {" ", "\t", "\n"};
    stateManager->setStepNo(1);
    stateManager->setSpaces(spaces);
    AppState state = stateManager->getAppState();
    cout << state.toString();
    return 0;
}

#if !defined(_APP_CONTROLLER_H_)
#define _APP_CONTROLLER_H_

#include "AppControllerBuilder.h"
#include "AppStateManager.h"

class AppController {
    private:
        AppStateManager *stateManager;
        AppControllerBuilder *builder;
        void reRun();

    public:
        AppController(AppControllerBuilder *builder, AppStateManager *stateManager);

        void run();
};

#endif //_APP_CONTROLLER_H_

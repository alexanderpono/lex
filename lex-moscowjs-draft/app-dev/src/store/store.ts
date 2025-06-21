import { combineReducers, createStore, applyMiddleware, Store, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { appReducer } from './appReducer';
import { editorReducer } from './editorReducer';

const rootReducer = combineReducers({
    app: appReducer,
    editor: editorReducer
});

export type RootState = ReturnType<typeof store.getState>;
export const store = createStore(rootReducer, composeWithDevTools());

export const getStore = () => store;

import { configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit'; 
import authReducer from '../redux/slices/authSlice';
import debtsReducer from '../redux/slices/debtSlice'; 

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'debts']  
};

const rootReducer = combineReducers({
    auth: authReducer,
    debts: debtsReducer  
});

const persistedReducer = persistReducer(persistConfig, rootReducer); 

export const store = configureStore({
    reducer: persistedReducer, 
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import accessTokenSliceReducer from '../reducers/AccessToken';
import LimitSliceReducer from '../reducers/Limit';
import histogramsSliceReducer from '../reducers/Histograms';
import FindSliceReducer from '../reducers/Find';
import DocListSliceReducer from '../reducers/DocList';
import documentsSliceReducer  from '../reducers/Docs';


export const store = configureStore({
  reducer: {
    accessToken: accessTokenSliceReducer,
    Limit: LimitSliceReducer,
    histograms: histogramsSliceReducer,
    Find: FindSliceReducer,
    DocList: DocListSliceReducer,
    documents: documentsSliceReducer
  },
  middleware: (getDefaultMiddleware) => [
  ],
});

export default store;

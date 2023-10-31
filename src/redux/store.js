import { combineReducers, configureStore } from '@reduxjs/toolkit';
import categorySliceReducer from './reducers/category-reducer';

const rootReducer = combineReducers({
  category: categorySliceReducer,
});

const store = configureStore({
  reducer: {
    rootReducer,
  },
});

export { store };

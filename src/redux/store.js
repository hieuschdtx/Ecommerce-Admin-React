import { combineReducers, configureStore } from '@reduxjs/toolkit';
import categorySliceReducer from './reducers/category-reducer';
import productCategoriesReducer from './reducers/product-categories-reducer';
import promotionReducer from './reducers/promotion-reducer';

const rootReducer = combineReducers({
  category: categorySliceReducer,
  productCategories: productCategoriesReducer,
  promotions: promotionReducer,
});

const store = configureStore({
  reducer: {
    rootReducer,
  },
});

export { store };

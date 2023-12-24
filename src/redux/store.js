import { combineReducers, configureStore } from '@reduxjs/toolkit';
import categorySliceReducer from './reducers/category-reducer';
import productCategoriesReducer from './reducers/product-categories-reducer';
import promotionReducer from './reducers/promotion-reducer';
import productReducer from './reducers/product-reducer';
import userReducer from './reducers/user-reducer';
import roleReducer from './reducers/role-reducer';
import orderReducer from './reducers/order-reducer';
import newsReducer from './reducers/news-reducer';

const rootReducer = combineReducers({
  category: categorySliceReducer,
  productCategories: productCategoriesReducer,
  promotions: promotionReducer,
  products: productReducer,
  user: userReducer,
  role: roleReducer,
  orders: orderReducer,
  news: newsReducer,
});

const store = configureStore({
  reducer: {
    rootReducer,
  },
});

export { store };

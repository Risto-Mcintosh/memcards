import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import spanish100 from "./Data/100spanish.json";
import capitalCities from "./Data/capital_cities.json";
import webDevAcronyms from "./Data/web_development_acronyms.json";
import TestImagesCard from "./Data/TestImagesCard.json";
import { hydrate } from "./actions/actionCreator";
import appReducer from "./reducers/index";

const initialState = [
  spanish100,
  capitalCities,
  webDevAcronyms,
  TestImagesCard
];

const rootReducer = (state, action) => {
  if (action.type === "HYDRATE") {
    state.decks = initialState;
  }
  return appReducer(state, action);
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

//store.dispatch(hydrate());

export default store;

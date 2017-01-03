import { combineReducers } from 'redux';
import {
  GET_ATLAS,
} from '../actions';

const contracts = (state = {}, action) => {
  switch (action.type) {
    case GET_ATLAS:
      return {
        // ...state,
        updateManagerAddress: action.updateManagerAddress,
        updateManager: action.updateManager,
        atlasAddress: action.atlasAddress,
        atlas: action.atlas,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  contracts,
});

export default rootReducer;

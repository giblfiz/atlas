import { combineReducers } from 'redux';
import {
  GET_ATLAS,
} from '../actions';

const contracts = (state = {}, action) => {
  switch (action.type) {
    case GET_ATLAS:
      return {
        // ...state,
        updateManagerAddress: action.payload.updateManagerAddress,
        updateManager: action.payload.updateManager,
        atlasAddress: action.payload.atlasAddress,
        atlas: action.payload.atlas,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  contracts,
});

export default rootReducer;

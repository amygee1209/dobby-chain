import {ActionTypes} from '../actions/types';

const initialState = {
  users: [],
  selUser: {},
  auctionList: []
}

export function userReducer(state = initialState, action) {
  switch(action.type) {
    default:
      return state;
    case ActionTypes.SET_USERS:
      return { 
        ...state, 
        users: action.payload 
      };
    case ActionTypes.SELECTED_USER:
      return { 
        ...state, 
        selUser: action.payload 
      };
    case ActionTypes.SET_AUCTION_LIST:
      return { 
        ...state, 
        auctionList: action.payload 
      };
  }
}
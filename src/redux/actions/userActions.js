import {ActionTypes} from './types';

export function setUsers(users) {
  return {
    type: ActionTypes.SET_USERS,
    payload: users
  }
}

export function selectedUser(user) {
  return {
    type: ActionTypes.SELECTED_USER,
    payload: user
  }
}

export function setAuctionList(auctionList) {
  return {
    type: ActionTypes.SET_AUCTION_LIST,
    payload: auctionList
  }
}
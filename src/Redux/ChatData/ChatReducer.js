import {SET_CHAT_DATA} from './ChatActionsType';

const initialState = {
     userData: null,
};

export default UserReducer = (state = initialState, action) => {
     
     switch (action.type) {
          case SET_CHAT_DATA:
               return {
               ...state,
               userData: action.payload,
          };
          default:
               return state;
          }
};

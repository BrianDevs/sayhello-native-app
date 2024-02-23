import {SET_VIDEO_DATA} from './VideoActionsType';

const initialState = {
     data: null,
};

export default VideoReducer = (state = initialState, action) => {
     
     switch (action.type) {
          case SET_VIDEO_DATA:
               return {
               ...state,
               data: action.payload,
          };
          default:
               return state;
          }
};

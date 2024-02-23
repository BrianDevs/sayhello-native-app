import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import UserReducer from './UserDetails/userReducer';
import ChatReducer from "./ChatData/ChatReducer";;
import VideoReducer from "./VideoData/VideoReducer";

const rootReducer = combineReducers({
    UserReducer: UserReducer,
    ChatReducer:ChatReducer,
    VideoReducer:VideoReducer
});

const intialState = {};
const middleware = [thunk];

const Store = createStore(rootReducer,intialState,applyMiddleware(...middleware));

export default Store;
import {  SET_CHAT_DATA    } from './ChatActionsType';
import ApiDataService from "./../../services/Apiservice.service";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setChatData = () => async (dispatch) => {
   
     try {
          
          AsyncStorage.getItem('userID', (err, credentials) => {
               let  userID =  JSON.parse(credentials);
               dispatch({ type: SET_CHAT_DATA });
               let url = 'userProfile?id='+userID;
               ApiDataService.Getapi(url).then(response =>{
                    let data = response.data;
                    if(data.status==true)
                    {
                         dispatch({ type: SET_CHAT_DATA, payload: data.data });
                    }
                    else{
                         let datayt = {"country": "", "created_at": "", "deleted_at": null, "device_token": "", "device_type": "", "email": "", "email_verified_at": null, "first_name": "", "id": '', "is_active": 1, "is_otp_verify": null, "last_name": "", "mobile_number": '', "otp": '', "profile_image": "", "role_id": 1, "updated_at": ""} 
                         dispatch({ type: SET_CHAT_DATA, payload: datayt });
                    }
                    
               });
          })
     } catch (error) {
          let datayt = {"country": "", "created_at": "", "deleted_at": null, "device_token": "", "device_type": "", "email": "", "email_verified_at": null, "first_name": "", "id": '', "is_active": 1, "is_otp_verify": null, "last_name": "", "mobile_number": '', "otp": '', "profile_image": "", "role_id": 1, "updated_at": ""} 
          dispatch({ type: SET_CHAT_DATA, payload: datayt });
     }
};





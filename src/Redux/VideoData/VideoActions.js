import {  SET_VIDEO_DATA    } from './VideoActionsType';
import ApiDataService from "../../services/Apiservice.service";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setVideoData = (filter,lang) => async (dispatch) => {
     try {
          
          AsyncStorage.getItem('userID', (err, credentials) => {
               let  userID =  JSON.parse(credentials);
               dispatch({ type: SET_VIDEO_DATA });
               let url = 'getCoupleData?lang='+lang+'&couple_id='+userID+'&filter='+filter;
               ApiDataService.Getapi(url).then(response =>{
                    let data = response.data;
                    if(data.status==true)
                    {
                         let allyoutubeurl = response.data.data[0].youtube_link;
                         let newdata = allyoutubeurl.map(element => {
                              let checkurl = Number(element.search('v='));
                              if(checkurl == -1)
                              {
                                   var onetype = element;
                                   var sval = Number(onetype.search('.be/')) + 4;
                                   var cval = onetype.search('&');
                                   var value = '';
                                   if (cval > sval) {
                                        value = onetype.substring(sval, cval);
                                   }
                                   else {
                                        value = onetype.substring(sval, onetype.length);
                                   }
                                   return value;
                              }
                              else{
                                   let sval = Number(element.search('v=')) + 2;
                                   let cval = element.search('&');
                                   var value = '';
                                   if (cval > sval) {
                                        value = element.substring(sval, cval);
                                   }
                                   else {
                                        value = element.substring(sval, element.length);
                                   }
                                   return value;
                              }
                         });
                         dispatch({ type: SET_VIDEO_DATA, payload: newdata });
                    }
                    else{
                         let datayt = {"accepted_lat": "", "accepted_lng": "", "id": null, "my_id": "", "selfie": "", "status": "", "stranger_id": null, "youtube_link": ""} 
                         dispatch({ type: SET_VIDEO_DATA, payload: datayt });
                    }
                    
               });
          })
     } catch (error) {
          let datayt = {"accepted_lat": "", "accepted_lng": "", "id": null, "my_id": "", "selfie": "", "status": "", "stranger_id": null, "youtube_link": ""} 
          dispatch({ type: SET_VIDEO_DATA, payload: datayt });
     }
};





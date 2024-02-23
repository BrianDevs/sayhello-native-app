import http from "./http-common";
import {  API_URL    } from './Apiurl';
import axios from "axios";

class ApiDataService {

    Getapi(url) {
        let newurl = API_URL+url;
        return http.get(newurl);
    }
    
    deleteapi(url) {
        let newurl = API_URL+url;
        return fetch(newurl, { method: 'DELETE' });
    }

    async Postapi(url,data) {
        // let newurl = API_URL+url;
        // return http.post(newurl, data);
        let newurl = API_URL+url;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
      
        const res = await fetch(newurl, requestOptions);
        return await res.json();
     
    }

    Uploadapi(url,data) {
        let newurl = API_URL+url;
        let postData = data;
        let config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*'
            }
        };
      
        return  axios.post(newurl,postData, config);
    }
    Postapitest(url,data) {
        let newurl = API_URL+url;
       // return fatch.post(newurl, data);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
      
        fetch(newurl, requestOptions)
                        .then((res) => res.json())
                        .then((json) => {
                        },
                        (error) => {
                        })
       
       // fetch(newurl, requestOptions).then(response => console.log("-------------------", response.json()))
    }
  
}

export default new ApiDataService();
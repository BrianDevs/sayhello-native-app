import React, {Component,useEffect} from "react";
import PushNotification from "react-native-push-notification";

const PushController=()=>{
    useEffect(() => {
        PushNotification.configure({
            onRegister: function(token) {
           
            },
            onNotification: function(notification) {
            
            },
            // Android only
            senderID: "147275435174",
            // iOS only
            permissions: {
              alert: true,
              badge: true,
              sound: true
            },
            popInitialNotification: true,
            requestPermissions: true
          });
        }, [])

    return(
        null
    )
}
export default PushController;

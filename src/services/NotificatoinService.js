import React, { useState,useEffect } from 'react';
import PushNotification from "react-native-push-notification";

const NotificatoinService = () => {

    useEffect(() => {
        PushNotification.configure({
            onNotification: function (notification) {
                console.log("NOTIFICATION1---------------:", notification.data.message);
                let totalmessage = JSON.parse(notification.data.message);

                console.log("NOTIFICATION2---------------:",totalmessage.id);
                if(notification){

                }
                //props.calltoastmessage(notification.title,notification.message)
            },
            onAction: function (notification) {
                console.log("ACTION:", notification.action);
                //console.log("NOTIFICATION:", notification);
            },
        });
    }, [])
    return null
}

export default NotificatoinService;
import React, { useEffect,useState } from 'react';
import { StatusBar,View } from 'react-native';
import Routes from './src/Navigation/Routes';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import Store from './src/Redux/store';
import PushController from './src/Pushontroller/PushController';
import PushNotification from 'react-native-push-notification';
import { StripeProvider } from '@stripe/stripe-react-native';
import { initFCM ,GetFCMToken,requestUserPermission} from './src/services/notificationTest';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {

    
    useEffect(() => {
        initFCM();
        requestUserPermission();
        GetFCMToken();
    }, [])
    useEffect(() => {
        PushNotification.configure({
            onNotification: function (notification) {
                let totalmessage = JSON.parse(notification.data.message);
                console.log('totalmessagetotalmessagetotalmessagetotalmessage',totalmessage);
                AsyncStorage.setItem('Notification_date',JSON.stringify(totalmessage));
                
            },
            onAction: function (notification) {
                console.log("ACTION:", notification.action);
                console.log("NOTIFICATION:", notification);
            },
        });
    }, [])

    

    return (
        <StripeProvider publishableKey={'pk_test_51Mx1vCSB4pLjzWKkpz54QGtrbTn9AyVfJWExkJtR0ZggnmbUuPu7kvPjJst3ycukIuSTwjMZZCplSom3jV9cOF6e00Css0rDZp'}>
            <Provider store={Store}>
                <PaperProvider>
                    <StatusBar
                        animated={true}
                        backgroundColor="#1551FE"
                        barStyle="light-content"
                    />
                    <View style={{ flex: 1 }}>
                        <PushController/>
                        <Routes />
                    </View>
                </PaperProvider>
            </Provider>
        </StripeProvider>
    );
};

export default App;
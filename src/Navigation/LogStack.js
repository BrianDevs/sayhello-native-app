import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import navigationStrings from "../constants/navigationStrings";
import { Login, Otp, Splash, ChooseLanguage, Subscription, Payment, Home, Successfulpayment, Getpointinfo, Promotinoalbanner, Verified, Persionalinfo, Lifestyle, Professionaldetails, Mysearch, Wenttolikes, Wenttodislikes, Addinformation, Uploaddocimg, Uploadfacelicence,TermsPrivacy } from "../Screens";
import DrawerStack from './DrawerStack';

const Stack = createNativeStackNavigator();

export default function LogStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name={navigationStrings.Login} component={Login} />
            <Stack.Screen name={navigationStrings.ChooseLanguage} component={ChooseLanguage} />
            <Stack.Screen name={navigationStrings.Uploaddocimg} component={Uploaddocimg} />
            <Stack.Screen name={navigationStrings.Subscription} component={Subscription} />
            <Stack.Screen name={navigationStrings.Otp} component={Otp} />
            <Stack.Screen name={navigationStrings.Addinformation} component={Addinformation} />
            <Stack.Screen name={navigationStrings.Promotinoalbanner} component={Promotinoalbanner} />
            <Stack.Screen name={navigationStrings.Home} component={Home} />
            <Stack.Screen name={navigationStrings.Payment} component={Payment} />
            <Stack.Screen name={navigationStrings.Getpointinfo} component={Getpointinfo} />
            <Stack.Screen name={navigationStrings.TermsPrivacy} component={TermsPrivacy}/>
            <Stack.Screen name={navigationStrings.Verified} component={Verified} />
            <Stack.Screen name={navigationStrings.Persionalinfo} component={Persionalinfo} />
            <Stack.Screen name={navigationStrings.Mysearch} component={Mysearch} />
            <Stack.Screen name={navigationStrings.Lifestyle} component={Lifestyle} />
            <Stack.Screen name={navigationStrings.Professionaldetails} component={Professionaldetails} />
            <Stack.Screen name={navigationStrings.Successfulpayment} component={Successfulpayment} />
            <Stack.Screen name={navigationStrings.Wenttolikes} component={Wenttolikes} />
            <Stack.Screen name={navigationStrings.Wenttodislikes} component={Wenttodislikes} />
            <Stack.Screen name={navigationStrings.Uploadfacelicence} component={Uploadfacelicence} />
            <Stack.Screen name={'DrawerStack'} component={DrawerStack}/>
        </Stack.Navigator>
    );
}

import React, { useState, useEffect } from 'react';
import { View, Text, Image, ImageBackground ,BackHandler} from 'react-native';
import { StylesGloble } from './../../helper/Globlecss';
import imagePath from './../../constants/imagePath';

const OutofRange = ({ navigation, route }) => {
    
    useEffect(() => {
        const backAction = () => {
          navigation.navigate('Home');
          return true;
        };
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction
        );
        return () => backHandler.remove();
      }, [navigation]);

    return (
        <>
            <View style={{ width: '100%', height: '100%' }}>
                <ImageBackground style={{ width: '100%', height: '100%' }} source={imagePath.fullscreen1} >

                    <View style={{ ...StylesGloble.ScreenHorigental, marginTop: '30%' }}>
                        <View>
                            <Text style={{ ...StylesGloble.fontmedium, color: "#FFFFFF", fontSize: 28, fontWeight: "600", textAlign: "center" }}>Out of Range!</Text>
                            <Text style={{ ...StylesGloble.fontsmall, color: "#FFFFFF", marginTop: 25, textAlign: "center", fontSize: 17, fontWeight: "500" }}>
                                We have detected this connection
                            </Text>
                            <Text style={{ ...StylesGloble.fontsmall, color: "#FFFFFF", textAlign: "center", fontSize: 17, fontWeight: "500" }}>
                                is out of range you tried.
                            </Text>
                            <Text style={{ ...StylesGloble.fontsmall, color: "#FFFFFF", textAlign: "center", fontSize: 17, fontWeight: "500" }}>
                                You receive.</Text>
                            <View>
                                <Text style={{ ...StylesGloble.fontmedium, color: "#FFFFFF", marginTop: '10%', fontSize: 35, fontWeight: "700", textAlign: "center", lineHeight: 50 }}>1000</Text>
                            </View>
                            <View>
                                <Text style={{ ...StylesGloble.fontmedium, color: "#FFFFFF", marginTop: 0, fontSize: 18, fontWeight: "400", textAlign: "center" }}>Entries</Text>
                            </View>
                        </View>
                        <View style={{ ...StylesGloble.widthheight100, marginTop: '20%', left: -15 }}>
                            <Image style={{ width: 300, height: 200 }} source={imagePath.sayhello} />
                        </View>
                    </View>
                </ImageBackground>
            </View>
        </>
    );
};
export default OutofRange;
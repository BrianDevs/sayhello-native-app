import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet,View, Animated,ImageBackground,Image } from 'react-native';
import imagePath from './../constants/imagePath';
import FastImage from 'react-native-fast-image';

const LoadingPage= () => {
    return (
        <View style={styles.container}>
            <FastImage  style={{ width: 70, height: 70 }}   source={imagePath.Loadingimg}   resizeMode={FastImage.resizeMode.contain} />
       </View>
    )}

const styles = StyleSheet.create({
   
    container: {
        backgroundColor: '#0e010eb3',
        height:"100%",
        width:"102%",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagetag:{
        height: 150,
        width: 150,
    }
})

export default LoadingPage;
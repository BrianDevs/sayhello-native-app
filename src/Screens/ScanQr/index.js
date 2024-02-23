import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Linking, View, TouchableOpacity, Image, ImageBackground, BackHandler } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import ButtonField from './../../helper/ButtonField';
import ApiDataService from "./../../services/Apiservice.service";
import AsyncStorage from '@react-native-async-storage/async-storage';
import imagePath from './../../constants/imagePath';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'


const ScanQr = ({ route, navigation }) => {
  const id = route?.params?.matchuser_id;
  const s_id = route?.params?.id

  const [scannedData, setScannedData] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [data, setdata] = useState({});
  const[applan,setapplan] = useState('')
           
  const { t, i18n } = useTranslation();
  useEffect(() => {
    AsyncStorage.getItem('Applang', (err, cr) => {
      i18n.changeLanguage(cr)
      setapplan(cr)
    })
  }, []);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Map');
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, [navigation]);

  const onSuccess = (e) => {
    setScannedData(e.data);
  };

  const uselogin = async (userID) => {

    let url = `userProfile?id=${id ? id : s_id}&lang=${applan}`
    ApiDataService.Getapi(url).then(response => {
      setLoading(false);
      if (response.data.status == true) {
        setdata(response.data.data);
      }

    }).catch(e => {
    }).finally(() => {
      setLoading(false);
    });

  }
  useEffect(() => {
    uselogin()
  }, [])


  const submitfun = () => {
    navigation.navigate('Takeselfi')
  }
  return (
    <View style={styles.container}>

      {scannedData ? (
        <View>
          <View style={{ width: wp('100%'), height: hp('40%') }}>
            <ImageBackground style={{ flex: 1, width: wp('100%'), height: ('100%') }} source={{ uri: data.image }}>
            </ImageBackground>
            <View style={{ marginHorizontal: 20, marginTop: 20 }}>
              <Text style={{
                color: '#000000',
                fontWeight: 'bold',
                lineHeight: 30,
                fontSize: 25,
              }}>{data.name} {data.lastName}</Text>
            </View>
          </View>
          <View style={{ marginTop: 80, marginHorizontal: 20 }}>
            <ButtonField label={t('Next')} submitfun={submitfun} />
          </View>
        </View>

      ) : (<QRCodeScanner
        onRead={onSuccess}
        showMarker={true}
        markerStyle={{ borderColor: "white" }}
        topContent={
          <View style={styles.topContent}>
            <Text style={styles.description}>
              {t('Scan the QR code to proceed')}
            </Text>
          </View>
        }
      />)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal:20,
    backgroundColor: "white"
  },
  topContent: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
  },
  logo: {
    width: 120,
    height: 120,
  },
  description: {
    fontSize: 18,
    color: '#555',
    marginTop: 16,
    textAlign: 'center',
  },
  buttonTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginHorizontal: 48,
    marginTop: 48,
  },
  buttonText: {
    fontSize: 18,
    color: 'rgb(0, 122, 255)',
  },
  topContent: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
  },
  description: {
    fontSize: 18,
    color: '#555',
    marginTop: 16,
    textAlign: 'center',
  },
  bottomContent: {
    backgroundColor: 'white',
    padding: 16,
    alignItems: 'center',
  },
  scannedDataText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scannedData: {
    fontSize: 14,
    color: '#555',
  },
});

export default ScanQr;

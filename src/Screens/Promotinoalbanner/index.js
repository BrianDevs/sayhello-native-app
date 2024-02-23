//import liraries
import React, { useEffect,useState} from 'react';
import { View, Text, ScrollView,Image,TouchableOpacity,ImageBackground,Linking } from 'react-native';
import { StylesGloble } from './../../helper/Globlecss';
import imagePath from './../../constants/imagePath';
import ApiDataService from "./../../services/Apiservice.service";
import LoadingPage  from './../../helper/LoadingPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import './../../Language/i18'

const Promotinoalbanner = ({ navigation,route }) => {
    const[applan,setapplan] = useState('')
           
    const {t,i18n}=useTranslation();
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })

    }, []);


    const [bannerlist,setbannerlist ]= useState('');
    const [Loading,setLoading ]= useState(false);
    const [urlone,seturlone] = useState('')
    const [id_one,setid_one] = useState('')
    useEffect(()=>{
        AsyncStorage.getItem('userID', (err, cre) => {
            notificationdata(cre)
        })
        Bannerlistfun();
    },[])

    const notificationdata = (cre)=>{
        AsyncStorage.getItem('Notification_date', (err, cr) => {
            if(cr != null){
                console.log('................',cr);
                // let totalmessage = JSON.parse(cr);
                //  AsyncStorage.setItem('matchid', ''+totalmessage.id);
                //  AsyncStorage.setItem('matchPercentage', ''+totalmessage.martched_percentage);
                // AsyncStorage.removeItem('Notification_date');
                // if(totalmessage.clickEvent == 'Matched'){
                //     console.log('-------------matchedddd----------');
                //     navigation.navigate('Matchnotification');
                // }else if (totalmessage.clickEvent == 'accepted') {
                //     console.log('-------------accepted----------');

                //     navigation.navigate('Showprofile', { r_id: totalmessage.id ,userId:cre});
                // } else if (totalmessage.clickEvent == 'InviteForChat') {
                //     console.log('-------------InviteForChat----------');

                //     navigation.navigate('Congrachulation', { routetype: 1 });
                // }else if (totalmessage.clickEvent == 'permanent') {
                //     console.log('-------------permanent----------');

                //     navigation.navigate('Chat',{name:totalmessage.title,image:totalmessage.user_image,chattype:'1',receiver:totalmessage.stranger_id,sender:cre,room:totalmessage.room_id, })
                // }else if (totalmessage.clickEvent == 'temporary') {
                //     console.log('-------------temporary----------');

                //     navigation.navigate('TempChat',{name:totalmessage.title,image:totalmessage.user_image,receiver:totalmessage.stranger_id,sender:cre,room:totalmessage.room_id, })
                // }
            }
        })
    }

    const submitfun = (url) =>{
        Linking.openURL(url);
    }

    const Bannerlistfun = (userID,id) =>{
        let url = `getBanners?lang=${applan}`;
        ApiDataService.Getapi(url).then(response => {
            console.log('response=========',response.data.data);
            setLoading(false);
            if(response.data.status==true)
            {
                setbannerlist(response.data.data);
                let link = response.data.data[0].id;
                seturlone(link)
                let id =response.data.data[1].id;
                setid_one(id)
            }
        }).catch(e => {
            console.log('eror',e);
        });
    }

    return (
        <View style={{...StylesGloble.container,...StylesGloble.ScreenHorigental,position:"relative"}}>
            {
                Loading&&
                <View style={{position:"absolute",top:0,left:0,height:"100%",width:"115%",zIndex:999999}}>
                    <LoadingPage/>
                </View>
            }
            <View style={{...StylesGloble.oneline,width:"100%",marginTop:20}}>
                <Text style={{fontSize:18,fontWeight:"700",color:"#000000",...StylesGloble.startposition}}>{t('Promotional banner')}</Text>
                <TouchableOpacity onPress={()=>navigation.navigate('Home')}>
                <Image  style={{ width: 16, height: 16,...StylesGloble.endposition,marginLeft:25,marginTop:5}} source={imagePath.Close} />
                </TouchableOpacity>
            </View>
            <View  style={{marginTop:20}}>
                <ScrollView>
                    {
                        bannerlist&&
                        bannerlist.map((item,index)=>{
                            return  <TouchableOpacity key={index} onPress={()=>{ submitfun(item.url) }} style={{...StylesGloble.oneline,marginBottom:20}}>
                                        <ImageBackground  style={{width: "96%", height: 180}} source={{ uri: item.image }} imageStyle={{borderRadius:10}}></ImageBackground>
                                    </TouchableOpacity>
                        })
                    }
                </ScrollView>
            </View>
        </View>
    );
};
export default Promotinoalbanner;
//import liraries
import React, { Component,useState } from 'react';
import { View, Text,Image,TouchableOpacity,Modal } from 'react-native';
import { StylesGloble } from './../../helper/Globlecss';
import HeaderComp from '../../Components/HeaderComp';
import ButtonField  from './../../helper/ButtonField';
import imagePath from './../../constants/imagePath';


const Cartlist = [{
        title:"Debit card"
    },{
        title:"Google pay"
    },{
        title:"Apple pay"
    }
]
const Payment = ({ navigation,route }) => {
    const [ addcarpopup,setaddcarpopup ] = useState(false);
    
    const submitfun = () => {
            
                    navigation.navigate('Successfulpayment');
                
          
    }

    
    return (
        <>
            <HeaderComp text={'Preferred Payment'} navigation={navigation}/>
            <View style={{...StylesGloble.container,...StylesGloble.ScreenHorigental}}>
                <View style={{marginTop:15}}>
                    <Text style={{...StylesGloble.fontsmall,marginTop:25}}>Credit card</Text>
                    <Text style={{...StylesGloble.fontsmall,marginTop:10}}>7894 5612 3078 ****</Text>
                </View>
                <TouchableOpacity style={{...StylesGloble.addcardbtn,marginTop:25}} onPress={() =>{
                        setaddcarpopup(true); }} >
                    <Text style={{...StylesGloble.fontsmall,marginLeft:5,color:'#999999'}}>Add card</Text>
                </TouchableOpacity>
                <View  style={{marginTop:50}}>
                    {
                        Cartlist.map((item,index)=>{
                            return  <View key={index} style={{...StylesGloble.oneline,marginBottom:20,width:"100%"}}>
                                        <Text style={{...StylesGloble.fontsmall,...StylesGloble.startposition}}>{item.title}</Text>
                                        <Image  style={{ width: 24, height: 24,...StylesGloble.endposition}} source={imagePath.circle} />
                                    </View>
                        })
                    }
                </View>
                <View style={{width:"100%",marginTop:50}}>
                    <ButtonField label={'Payment'} submitfun={submitfun}/>
                </View>
                <Modal  animationType="slide" transparent={true} visible={addcarpopup}>
                <TouchableOpacity style={{position: 'absolute',bottom: 0,width:'100%',height:"100%",backgroundColor:"#1c191938",}} onPress={() =>{
                        setaddcarpopup(false); }}>
                    <View  ></View>
                </TouchableOpacity>
                <View style={{position: "absolute", bottom: 0,  right: 0,height:380,backgroundColor:'#ffffff',borderTopStartRadius:50,borderTopEndRadius:50,alignItems:"center",width:"100%"}}>  
                </View>
            </Modal>
            </View>
        </>
    );
};
export default Payment;
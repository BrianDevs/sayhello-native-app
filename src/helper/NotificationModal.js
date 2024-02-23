import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Modal, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import './../Language/i18'

const NotificationModal = (props, { onPress }) => {
    const [applan, setapplan] = useState('')

    const { t, i18n } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);
    const [userid,setuserid] = useState('')
    useEffect(() => {
        AsyncStorage.getItem('Applang', (err, cr) => {
            i18n.changeLanguage(cr)
            setapplan(cr)
        })
    }, []);
    useEffect(()=>{
        AsyncStorage.getItem('userID', (err, cre) => {
            setuserid(cre)
        })
    },[])
    const gotootherpage = async () => {
        const id = props.data.id;
        await AsyncStorage.setItem('matchid', ''+id);
        await AsyncStorage.setItem('matchPercentage', ''+props.data.martched_percentage);
        if (props.data.clickEvent == 'InviteForChat') {
            props.navigation.navigate('Congrachulation', { routetype: 1 });
            props.notificationclosefunc()
        } else if (props.data.clickEvent == 'accepted') {
            props.notificationclosefunc()
        } else if (props.data.clickEvent == 'Matched') {
            props.navigation.navigate('Matchnotification');
            props.notificationclosefunc()
        }else if (props.data.clickEvent == 'permanent') {
            props.navigation.navigate('Chat',{name:props.data.title,image:props.data.user_image,chattype:'1',receiver:props.data.stranger_id,sender:userid,room:props.data.room_id, })
        }else if (props.data.clickEvent == 'temporary') {
            props.navigation.navigate('TempChat',{name:props.data.title,image:props.data.user_image,receiver:props.data.stranger_id,sender:userid,room:props.data.room_id, })
        }
    }
    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={true}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{props.data.title}</Text>
                        <Text style={styles.modalText2}>{props.data.body}</Text>
                        <View style={{ flexDirection: "row", marginTop: 35, justifyContent: "space-between" }}>
                            <Pressable
                                style={[styles.button, styles.buttonClose, { marginRight: 10, width: 60 }]}
                                onPress={() => { gotootherpage() }}>
                                <Text style={styles.textStyle}>{t('Ok')}</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonClose, { width: 60 }]}
                                onPress={() => props.notificationclosefunc()}>
                                <Text style={styles.textStyle}>{t('Cancel')}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
export default NotificationModal;
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        // height: 160,
        width: 220,
        paddingBottom:35

    },
    button: {
        borderRadius: 15,
        padding: 5,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        color: "#000000",
        fontSize: 17,
        lineHeight: 35,
        fontWeight: "600"
    },
    modalText2: {
        color: "#000000",
        fontSize: 13,
        lineHeight: 15
    },
});
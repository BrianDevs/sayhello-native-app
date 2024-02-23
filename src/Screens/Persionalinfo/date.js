import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import styles from '../schedule/Components/FlatListCardsStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const ResheduleScreen = (props) => {

    const [date, setDate] = useState(new Date());
    const [datee, setDatee] = useState('');
    const [showPicker, setShowPicker] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        setDate(selectedDate)
        setShowPicker(false)
        var obj = date
        var data = moment(obj)
            .format("DD-MM-YYYY");
        setDatee(data);
    };

    return (
        <View>
            <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 2, shadowColor: 'black', shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, padding: 10 }} onPress={() => setShowPicker(true)} >
                <Text style={styles.greycardtext}> {datee.toLocaleString()}</Text>
            </TouchableOpacity>
            {showPicker && <View>
                <DateTimePicker
                    date={date}
                    value={date}
                    mode="date"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                    format={"YYYY-MM-DD"}
                    displayFormat={"DD-MM-YYYY"}
                />
            </View>}
        </View>
    );
}
export default ResheduleScreen;
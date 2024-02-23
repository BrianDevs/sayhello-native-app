import React, { useCallback, useState } from "react";
import RangeSliderRN from "rn-range-slider";
import { View, Text } from "react-native";
import Label from "./Label";
import Notch from "./Notch";
import Rail from "./Rail";
import RailSelected from "./RailSelected";
import Thumb from "./Thumb";

const RangeSlider = ({ from, to,rangevaluefun }) => {
  
    const [low, setLow] = useState(from);
    const [high, setHigh] = useState(to);

    const renderThumb = useCallback(() => <Thumb />, []);
    const renderRail = useCallback(() => <Rail />, []);
    const renderRailSelected = useCallback(() => <RailSelected />, []);
    
    const handleValueChange = useCallback(
        (newLow, newHigh) => {
            let nwLow = Number(newLow);
            let nwHigh = Number(newHigh);
            setLow(nwLow);
            setHigh(nwHigh);
            rangevaluefun(nwLow,nwHigh)
        },
        [setLow, setHigh]
    );
    return (
        <>
            <View style={{ flexDirection: "row",position:"relative", justifyContent: "space-between", marginVertical: 10,width: '100%' }} >
                <RangeSliderRN
                    style={{ width: '100%' }}
                    low={from}
                    high={to}
                    min={0}
                    max={100}
                    step={1}
                    floatingLabel
                    renderThumb={renderThumb}
                    renderRail={renderRail}
                    renderRailSelected={renderRailSelected}
                    onValueChanged={handleValueChange}
                />
                <View style={{position:"absolute",top:30,left:10}} >
                    <Text  style={[{ fontWeight: "bold" }, { fontSize: 18, color: "#000000" }]}>
                        {low}
                    </Text>
                </View>
                <View style={{position:"absolute",top:30,right:10}}>
                    <Text style={[{ fontWeight: "bold" }, { fontSize: 18, color: "#000000" }]} >
                        {high}
                    </Text>
                </View>
            </View>
        </>
    );
};
export default RangeSlider;
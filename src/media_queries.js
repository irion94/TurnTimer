import {Dimensions} from "react-native";
import {responsiveFontSize} from "react-native-responsive-dimensions";

const {width} = Dimensions.get('window');


export const setFontSize = () => {
    if (width >= 700) {
        return ({
            number: responsiveFontSize(9),
            text: responsiveFontSize(1.3)
        });
    }
    else if (width < 700) {
        return ({
            number: responsiveFontSize(14),
            text: responsiveFontSize(3.5)
        });
    }
};
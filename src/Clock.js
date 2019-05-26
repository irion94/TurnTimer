import React from 'react'
import {Container, Text, View} from 'native-base'
import {StatusBar, StyleSheet, TouchableOpacity, Vibration} from 'react-native'
import {observer} from "mobx-react";
import Sound from 'react-native-sound';
import KeepAwake from 'react-native-keep-awake';
import {responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';

import mainStore from "./store";
import isUp from './resources/your_time_is_up.mp3'
import half_the_time from './resources/half_the_time.mp3'
import hurry_up from './resources/hurry_up.mp3'
import {setFontSize} from "./media_queries";

const startMessage = 'Press to start';
const nextPlayerMessage = 'Next player!';

@observer
class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: mainStore.time,
            status: {
                bool: false,
                message: startMessage
            }
        };
    }

    _time() {
        let newCount = this.state.time - 1;
        if (newCount >= -100) {
            this.setState({time: newCount});
            this.buttonColorOnTimeMovement(newCount)
        } else {
            clearInterval(this.intervalId);
        }

        if (mainStore.time / 2 === newCount) {
            if(mainStore.vibrations) Vibration.vibrate();
            if (newCount !== 5) this._sound(half_the_time)
        }
        if (newCount === 5) this._sound(hurry_up)
        if (newCount <= 5 && newCount > 0 && mainStore.vibrations) Vibration.vibrate();
        if (newCount === 0) {
            this.setState({
                status: {
                    bool: !this.state.status.bool,
                    message: nextPlayerMessage
                }
            });
            if(mainStore.vibrations) this.setState({vibrate: true});
            if(mainStore.sounds) this.setState({sounds: true});
            clearInterval(this.intervalId);
        }

    }

    _sound(sound) {
        if(mainStore.sounds) {
            let whoosh = new Sound(sound, (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                    return;
                }
                // loaded successfully
                console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());

                // Play the sound with an onEnd callback
                whoosh.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            });
        }
    }


    _onPress() {
        Vibration.cancel();
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.setState({time: mainStore.time})
            this.setState({color: `rgb(0, 200, 50)`})
            this.intervalId = setInterval(this._time.bind(this), 1000);
            this.setState({
                status: {
                    bool: this.state.status.bool ? this.state.status.bool : !this.state.status.bool,
                    message: nextPlayerMessage
                }
            });
        }
        else {
            this.intervalId = setInterval(this._time.bind(this), 1000);
            this.setState({
                status: {
                    bool: !this.state.status.bool,
                    message: startMessage
                }
            });
        }
    }

    _onLongPress() {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.setState({
            status: {
                bool: this.state.status.bool ? !this.state.status.bool : this.state.status.bool,
                message: startMessage
            }
        });
        this.setState({time: mainStore.time})
        this.setState({color: `rgb(0, 200, 50)`})
        Vibration.cancel();
        this._cancelVibrate()
    }

    _cancelVibrate(){
        if(this.state.vibrate) {
            this.setState({vibrate: false})
            Vibration.cancel()
        }
    }

    buttonColorOnTimeMovement(time) {
        let red = 200 - time * 10;
        let green = time * 10;

        if (red < 0) red = 0;
        if (red > 200) red = 200
        if (green > 200) green = 200;
        if (green < 0) green = 0;

        this.setState({color: `rgb(${red}, ${green}, 50)`})
    }

    componentDidMount() {
        KeepAwake.activate();
        this.setState({time: mainStore.time});
        this.setState({color: `rgb(0, 200, 50)`});
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    componentWillReceiveProps() {
        if (mainStore.time !== this.state.time) this.setState({time: mainStore.time})
    }

    render() {
        const t = this.state;
        if (t.vibrate) {
            Vibration.vibrate(100000);
            this.setState({vibrate: false})
        }

        if(t.sounds){
            this._sound(isUp);
            this.setState({sounds: false})
        }

        return (
            <Container>
                <StatusBar hidden={true}/>
                <TouchableOpacity style={{
                    width: responsiveWidth(100),
                    height: responsiveHeight(100), flexDirection: 'column', backgroundColor: t.color
                }}
                                  onPress={() => this._onPress()}
                                  onLongPress={() => this._onLongPress()}
                >

                    <Time time={t.time} rotation={'180deg'} status={t.status}/>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Time time={t.time} rotation={'90deg'} status={t.status}/>
                        <Time time={t.time} rotation={'270deg'} status={t.status}/>
                    </View>
                    <Time time={t.time} rotation={'0deg'} status={t.status}/>
                </TouchableOpacity>
            </Container>
        )
    }
}

const Time = ({time, status = '123456789', rotation = '0deg', fontSize = 110}) => {

    const statusMessage = () => {
        if (!status.bool) return status.message;
    }

    return (
        <View style={{
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            transform: [{rotate: rotation}],
        }}
        >
            <Text style={[styles.text, {fontSize: setFontSize().text}]}>{statusMessage()}</Text>
            <Text style={[styles.text, {fontSize: setFontSize().number}]}>{time}</Text>
        </View>
    )
}

export default Clock

const styles = StyleSheet.create({
    text: {
        fontWeight: "bold",
        color: 'white'
    }
});
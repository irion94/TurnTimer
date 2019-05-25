import React from 'react'
import {Container, Text, View} from 'native-base'
import {StyleSheet, TouchableOpacity, Vibration} from 'react-native'

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: 10,
            time: 10,
            status: false
        };
    }

    componentDidMount() {
        this.setState({time: 20});
        this.setState({color: `rgb(0, 200, 50)`});
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    _time() {
        let newCount = this.state.time - 1;
        if (newCount >= -100) {
            this.setState({time: newCount});
            this.buttonColorOnTimeMovement(newCount)
        } else {
            clearInterval(this.intervalId);
        }

        if (this.state.currentTime / 2 === newCount) Vibration.vibrate()
        if (newCount <= 5 && newCount > 0) Vibration.vibrate();
        else if(newCount <= 0) this.setState({vibrate: true})

    }

    _onPress() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.setState({time: 30})
            this.setState({color: `rgb(0, 200, 50)`})
            this.intervalId = setInterval(this._time.bind(this), 1000);
        }
        else {
            this.intervalId = setInterval(this._time.bind(this), 1000);
            this.setState({status: !this.state.status});
        }
        this._cancelVibrate()
    }

    _onLongPress() {
        const t = this.state;
        if (t.status) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.setState({status: !t.status});
            this.setState({time: 30});
            this.setState({color: `rgb(0, 200, 50)`})
        }
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

    render() {
        const t = this.state;
        if(t.vibrate) Vibration.vibrate(100000);
        return (
            <Container>
                <TouchableOpacity style={{
                    width: '100%', height: '100%', flexDirection: 'column', backgroundColor: t.color
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

const Time = ({time, status = '123456789', rotation = '0deg', fontSize = 80}) => {

    const statusMessage = () => {
        if (!status) return "Press to start";
    }

    return (
        <View style={{
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            transform: [{rotate: rotation}]
        }}
        >
            <Text style={[styles.text, {fontSize: 30}]}>{statusMessage()}</Text>
            <Text style={[styles.text, {fontSize: fontSize}]}>{time}</Text>
        </View>
    )
}

export default Clock

const styles = StyleSheet.create({
    text: {
        fontWeight: "bold",
        color: 'white',
    }
});
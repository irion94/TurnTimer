import Clock from "./Clock";
import {createDrawerNavigator} from 'react-navigation-drawer'
import {createAppContainer} from 'react-navigation'
import React from 'react';
import {CheckBox, Container, Content, Form, Icon, Item, Picker, Text} from 'native-base'
import mainStore from "./store";
import {observer} from 'mobx-react'

@observer
class CustomDrawer extends React.Component {
    state = {
        time: '30'
    };

    _onChangeValue(val) {
        this.props.navigation.closeDrawer();
        this.props.navigation.navigate('Clock', {props: {rerender: true}});
        mainStore.setTime(val)
    }

    _onPressButton(fun: function){
        this.props.navigation.navigate('Clock', {props: {rerender: true}});
        fun
    }

    render(){
        return(
            <Container style={{backgroundColor: "rgba(216, 216, 216, 0.3)"}}>
                <Content contentContainerStyle={{marginTop: 40, margin: 10}}>
                    <Form>
                        <Item picker>
                            <Text>Set Timeout</Text>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down"/>}
                                style={{width: undefined}}
                                placeholder="Select round time"
                                selectedValue={mainStore.time}
                                onValueChange={this._onChangeValue.bind(this)}
                            >
                                <Picker.Item label="10 sec" value={10}/>
                                <Picker.Item label="20 sec" value={20}/>
                                <Picker.Item label="30 sec" value={30}/>
                                <Picker.Item label="40 sec" value={40}/>
                                <Picker.Item label="60 sec" value={60}/>
                                <Picker.Item label="90 sec" value={90}/>
                                <Picker.Item label="120 sec" value={120}/>
                            </Picker>
                        </Item>
                        <Item picker style={{paddingTop: 10, paddingBottom: 10}}>
                            <Text> Sounds: </Text>
                            <CheckBox checked={mainStore.sounds} onPress={() => this._onPressButton(mainStore.setSounds())}/>
                        </Item>
                        <Item picker style={{paddingTop: 10, paddingBottom: 10}}>
                            <Text> Vibrations: </Text>
                            <CheckBox checked={mainStore.vibrations} onPress={() => this._onPressButton(mainStore.setVibrations())}/>
                        </Item>
                    </Form>
                </Content>
            </Container>
        )
    }
}


export const AppNavigator = createDrawerNavigator({
        Clock: Clock
    },
    {
        contentComponent: CustomDrawer
    });

export const AppContainer = createAppContainer(AppNavigator)
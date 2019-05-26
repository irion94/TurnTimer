import Clock from "./Clock";
import {createDrawerNavigator} from 'react-navigation-drawer'
import {createAppContainer} from 'react-navigation'
import React from 'react';
import {Body, Button, Container, Content, Icon, Left, ListItem, Picker, Right, Switch, Text} from 'native-base'
import mainStore from "./store";
import {observer} from 'mobx-react'

@observer
class CustomDrawer extends React.Component {
    state = {
        time: '30'
    };

    _onChangeValue(val) {
        this.props.navigation.closeDrawer();
        this.props.navigation.navigate('Clock', {props: {}});
        mainStore.setTime(val)
    }

    _onPressButton(fun: function){
        this.props.navigation.navigate('Clock', {props: {}});
        fun()
    }

    render(){
        return(
            <Container>
                <Content contentContainerStyle={{marginTop: 40}}>
                    <ListItem icon>
                        <Left>
                            <Button style={{backgroundColor: "#FF9501"}}>
                                <Icon active name="ios-timer" type="Ionicons"/>
                            </Button>
                        </Left>
                        <Body>
                            <Text>Time</Text>
                        </Body>
                        <Right>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down"/>}
                                style={{width: 100}}
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
                        </Right>
                    </ListItem>
                    <ListItem icon>
                        <Left>
                            <Button style={{backgroundColor: "#FF9501"}}>
                                <Icon active name="sound" type="AntDesign"/>
                            </Button>
                        </Left>
                        <Body>
                        <Text>Sounds</Text>
                        </Body>
                        <Right>
                            <Switch value={mainStore.sounds}
                                    onValueChange={() => this._onPressButton(mainStore.setSounds)}/>
                        </Right>
                    </ListItem>
                    <ListItem icon>
                        <Left>
                            <Button style={{backgroundColor: "#FF9501"}}>
                                <Icon active name="vibration" type="MaterialIcons"/>
                            </Button>
                        </Left>
                        <Body>
                        <Text>Vibrations</Text>
                        </Body>
                        <Right>
                            <Switch value={mainStore.vibrations}
                                    onValueChange={() => this._onPressButton(mainStore.setVibrations)}/>
                        </Right>
                    </ListItem>
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
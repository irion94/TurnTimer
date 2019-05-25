import Clock from "../Clock";
import {createDrawerNavigator} from 'react-navigation-drawer'
import {createAppContainer, DrawerItems} from 'react-navigation'
import React from 'react';
import {Container, View, Button, Text, Content, Form, Item, Input} from 'native-base'


class CustomDrawer extends React.Component {
    state = {
        time: '30'
    };

    render(){
        return(
            <Container style={{backgroundColor: "rgba(216, 216, 216, 0.3)"}}>
                <Content contentContainerStyle={{marginTop: 40}}>
                    <Form>
                        <Item>
                            <Text>Round Time:</Text>
                            <Input label={"Round Time"} value={this.state.time} onChangeText={(time)=> this.setState({time})}/>
                        </Item>
                    </Form>
                </Content>
            </Container>
        )
    }
}


export const AppNavigator = createDrawerNavigator({
        Clock: {
            screen: Clock,
        }
    },
    {
        contentComponent: CustomDrawer
    });

export const AppContainer = createAppContainer(AppNavigator)
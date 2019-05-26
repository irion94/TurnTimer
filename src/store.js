import {observable, action} from 'mobx'

class Store {
    @observable time = 30;
    @observable sounds = true;
    @observable vibrations = true;

    @action setTime = (time) => {
        this.time = time;
    };

    @action setVibrations = () => {
        this.vibrations = !this.vibrations;
    };

    @action setSounds = () => {
        this.sounds = !this.sounds;
    };
}

const mainStore = new Store();

export default mainStore;
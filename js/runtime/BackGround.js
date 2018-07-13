//背景类
import {Sprite} from "../base/Sprite.js";
import {DataStore} from "../base/DataStore.js";

export class BackGround extends Sprite{
    constructor() {
        const image = Sprite.getImage('background');
        const dataStore = DataStore.getInstance();
        console.log(dataStore.win);
        super(image,
            0, 0,
            image.width, image.height,
            0, 0,
            dataStore.win.innerWidth, dataStore.win.innerHeight
        );
    }
}
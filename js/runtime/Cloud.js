//云朵类
import {Sprite} from "../base/Sprite.js";
import {DataStore} from "../base/DataStore.js";
import {Director} from "../Director.js";

export class Cloud extends Sprite{
    constructor(top, zoom, distance) {
        const image = Sprite.getImage('cloud');
        const dataStore = DataStore.getInstance();
        super(image,
            0,0,
            image.width,image.height,
            dataStore.win.innerWidth + distance, 0,
            image.width,image.height);
        this.zoom = zoom;
        this.top = top;
    }

    draw(){
        this.x = this.x - Director.getInstance().cloudSpeed;
        this.y = this.top - this.height;
        // console.log(this.x,this.y);
        super.draw(this.img,
            0,0,
            this.img.width,this.img.height,
            this.x,this.y,
            this.img.width * this.zoom,this.img.height * this.zoom)
    }
}
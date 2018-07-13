//台阶类
import {Sprite} from "../base/Sprite.js";
// import {DataStore} from "../base/DataStore.js";
import {Director} from "../Director.js";

export class Step extends Sprite{
    constructor(stepX = 0, stepY = 0) {
        const image = Sprite.getImage('step');
        super(image,
            0, 0,
            image.width,image.height,
            stepX, stepY,
            image.width,image.height);
    }

    draw(){
        this.y = this.y - Director.getInstance().stepSpeed;
        super.draw(this.img,
            this.srcX,this.srcY,
            this.img.width,this.img.height,
            this.x,this.y,
            Director.getInstance().stepWidth,Director.getInstance().stepHeight)
    }
}
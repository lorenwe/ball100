// 小球类
import {Sprite} from "../base/Sprite.js";
import {Director} from "../Director.js";
import {DataStore} from "../base/DataStore.js";

export class Ball extends Sprite {
    constructor(stepX = 0, stepY = 0) {
        const image = Sprite.getImage('ball');
        super(image,
            0, 0,
            image.width,image.height,
            stepX, stepY,
            image.width,image.height);
        this.time = 0;
    }

    draw(){
        let offsetY = 0;
        if(DataStore.getInstance().ballSpeed.y === 0) {
            //模拟重力加速度
            const  g = 0.98 / 50;
            //小鸟的位移
            offsetY = (g * this.time * this.time) / 2 * -1;

            this.time++;
        } else {
            offsetY = DataStore.getInstance().ballSpeed.y;
        }

        this.x = this.x + DataStore.getInstance().ballSpeed.x;
        this.y = this.y - offsetY;

        //console.log(offsetY);

        // 边界限制
        if(this.x <= 0) {
            DataStore.getInstance().ballSpeed.x = 0;
            this.x = 0;
        }
        if(this.x >= DataStore.getInstance().win.innerWidth - Director.getInstance().ballSize) {
            DataStore.getInstance().ballSpeed.x = 0;
            this.x = DataStore.getInstance().win.innerWidth - Director.getInstance().ballSize;
        }
        super.draw(this.img,
            this.srcX,this.srcY,
            this.img.width,this.img.height,
            this.x,this.y,
            Director.getInstance().ballSize,Director.getInstance().ballSize)
    }

}
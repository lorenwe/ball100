// 离屏canvas

import {Sprite} from "../base/Sprite.js";
import {Director} from "../Director.js";

export class BallCanvas {

    static getInstance() {
        if(!BallCanvas.instance) {
            BallCanvas.instance = new BallCanvas();
        }
        return BallCanvas.instance;
    }

    constructor() {
        this.image = Sprite.getImage('ball');
        // this.offCanvas = document.createElement("canvas");
        this.offCanvas = wx.createCanvas()
        this.offContext = this.offCanvas.getContext("2d");
        this.offCanvas.width = Director.getInstance().ballSize;
        this.offCanvas.height = Director.getInstance().ballSize;
        this.offContext.translate(this.offCanvas.width / 2,this.offCanvas.height / 2);//设置画布上的(0,0)位置，也就是旋转的中心点
        this.offContext.scale(0.95,0.95); //缩放
    }

    // 旋转
    rotate(angle = 0) {
        this.clearCanvas();
        this.offContext.rotate(angle * Math.PI/180);
        this.offContext.drawImage(this.image, 0, 0,
            this.image.width, this.image.height,
            (this.offCanvas.width/2) * -1, (this.offCanvas.height/2) * -1,
            Director.getInstance().ballSize, Director.getInstance().ballSize);
        return this.offCanvas;
    }

    // 清空画布
    clearCanvas() {
        this.offContext.clearRect(0,0,this.offCanvas.width,this.offCanvas.height);
    }
}
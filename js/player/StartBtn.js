import {Sprite} from "../base/Sprite.js";
import {DataStore} from "../base/DataStore.js";

export class StartBtn extends Sprite {
    constructor() {
        const image = Sprite.getImage('startButton');

        // 初始化从右边移入开始按钮

        super(image,
            0, 0,
            image.width,image.height,
            DataStore.getInstance().startBtn.x, DataStore.getInstance().startBtn.y,
            DataStore.getInstance().startBtn.w, DataStore.getInstance().startBtn.h);
    }

    draw(){
        
        this.x = this.x - DataStore.getInstance().startBtnSpeed;
    
        if(DataStore.getInstance().startBtnSpeed > 0) {
            DataStore.getInstance().startBtnSpeed = DataStore.getInstance().startBtnSpeed - 0.2;
            if(DataStore.getInstance().startBtnSpeed < 2) {
                DataStore.getInstance().startBtnSpeed = 2;
            }
        } else if(DataStore.getInstance().startBtnSpeed < 0) {
            DataStore.getInstance().startBtnSpeed = DataStore.getInstance().startBtnSpeed + 0.2;
            if(DataStore.getInstance().startBtnSpeed > -2) {
                DataStore.getInstance().startBtnSpeed = -2;
            }
        }
        
        //console.log(DataStore.getInstance().startBtnSpeed);

        let boundary = DataStore.getInstance().startBtn.minX;
        
        // 边界限制
        if(this.x <= boundary) {
            DataStore.getInstance().startBtnSpeed = 0;
            this.x = boundary;
        }
        if(this.x >= DataStore.getInstance().startBtn.maxX ) {
            DataStore.getInstance().startBtnSpeed = 0;
            this.x = DataStore.getInstance().startBtn.maxX;
        }
        super.draw(this.img,
            this.srcX,this.srcY,
            this.img.width,this.img.height,
            this.x,this.y,
            this.width,this.height)
    }
}
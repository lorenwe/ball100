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
        let oldCoordinate = {
            x: this.x,
            y: this.y
        };
        DataStore.getInstance().darwNum = DataStore.getInstance().darwNum + 1;

        this.x = this.x + DataStore.getInstance().ballSpeed.x;

        // 边界限制
        if(this.x <= 0) {
            // 反弹效果，x位移速度取反
            DataStore.getInstance().ballSpeed.x = DataStore.getInstance().ballSpeed.x * -1 * 0.5;
            this.x = 0;
        }
        if(this.x >= DataStore.getInstance().win.innerWidth - Director.getInstance().ballSize) {
            // 反弹效果，x位移速度取反
            DataStore.getInstance().ballSpeed.x = DataStore.getInstance().ballSpeed.x * -1 * 0.5;
            this.x = DataStore.getInstance().win.innerWidth - Director.getInstance().ballSize;
        }
        // 台阶检测
        let ballStatus = this.checkBallByStep();
        //console.log(ballStatus);
        if(ballStatus.status){
            // 在台阶上
            this.y = ballStatus.ballY - Director.getInstance().ballSize;
        } else {
            // 不在台阶上
            DataStore.getInstance().ballSpeed.y = 0;
            let offsetY = 0;
            //console.log('ballSpeed.y',DataStore.getInstance().ballSpeed.y);
            if(DataStore.getInstance().ballSpeed.y === 0) {
                //模拟重力加速度
                const  g = 0.98 / 50;
                //小鸟的位移
                offsetY = (g * this.time * this.time) / 2 * -1;

                this.time++;
                //console.log('不在台阶上');
            } else {
                offsetY = DataStore.getInstance().ballSpeed.y;
            }
            this.y = this.y - offsetY;
        }

        if(DataStore.getInstance().isBallFixed) {
            this.x = oldCoordinate.x;
            this.y = oldCoordinate.y;
        }

        super.draw(this.img,
            this.srcX,this.srcY,
            this.img.width,this.img.height,
            this.x,this.y,
            Director.getInstance().ballSize,Director.getInstance().ballSize)
    }

    // 检测小球是否在台阶上
    checkBallByStep() {
        const ball = this;
        const steps = this.dataStore.get('steps');
        // 小球的边框模型
        const ballBorder = {
            top: ball.y,
            bottom: ball.y + Director.getInstance().ballSize,
            left: ball.x,
            right: ball.x + Director.getInstance().ballSize
        };
        const length = steps.length;
        for(let i=0; i<length; i++) {
            const step = steps[i];
            const stepBorder = {
                top: step.y,
                bottom: step.y + step.height,
                left: step.x,
                right: step.x + step.width
            };
            if(ballBorder.top > stepBorder.bottom) {
                //console.log('小球top',ballBorder.top);
                //console.log('台阶bottom',stepBorder.bottom);
                continue;
            }
            const ballStatus = this.isStrike(ballBorder, stepBorder);
            if(ballStatus.status){
                DataStore.getInstance().ballSpeed.y = Director.getInstance().stepSpeed;
                DataStore.getInstance().get('ball').time = 0;
                return ballStatus;
            } else {
                DataStore.getInstance().ballSpeed.y = 0;
                return ballStatus;
            }
        }
        return {
            status: false,
            ballY: 0
        }

    }

    //判断小球是否在台阶上
    isStrike(ball, step) {
        // 判断小球与台阶之间的纵向距离
        let s = {
            status: false,
            ballY: 0
        };
        if(step.top - ball.bottom > 1) {
            s = {
                status: false,
                ballY: 0
            };
            return s;
        } else {
            //                            右边台阶检查偏差值        左边台阶检查偏差值
            if (  ball.left <= step.right - 4 && ball.right >=  step.left + 6) {
                s = {
                    status: true,
                    ballY: step.top
                };
            }
        }
        return s;
    }

}
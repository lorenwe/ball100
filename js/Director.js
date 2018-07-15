//导演类，控制游戏逻辑
import {DataStore} from "./base/DataStore.js";
import {Cloud} from "./runtime/Cloud.js";
import {Tools} from "./base/Tools.js";
import {Step} from "./runtime/Step.js";
import {Ball} from "./player/Ball.js";
import {Main} from "../Main.js";

export class Director {
    constructor() {
        this.dataStore = DataStore.getInstance();
        //云朵移动速度
        this.cloudSpeed = 1;
        // 屏幕内出现的云朵数量
        this.cloudLength = 3;
        //台阶上升速度
        this.stepSpeed = 0;
        // 台阶宽度
        this.stepWidth = this.dataStore.win.innerWidth / 4.5;
        // 台阶高度
        this.stepHeight = this.stepWidth / 4.7;
        // 台阶间隔
        this.stepInterval = this.dataStore.win.innerHeight / 5;
        // 小球大小
        this.ballSize = this.stepWidth / 2.84;
        // 初始化小球移动速度
        this.dataStore.ballSpeed = {
            x: 0,
            y: 1
        };
        //初始化触摸状态
        this.dataStore.isTouch = false;
        //初始化触摸位置
        this.dataStore.isLeft = true;

        //计数器
        this.dataStore.darwNum = 0;

        //是否固定小球位置
        this.dataStore.isBallFixed = false;

        //开始按钮宽高
        this.dataStore.startBtn = {
            w: this.dataStore.win.innerWidth / 3,
            h: this.dataStore.win.innerWidth / 3 / 2,
            x: this.dataStore.win.innerWidth,
            y: (this.dataStore.win.innerHeight - (this.dataStore.win.innerWidth / 3 / 2)) / 2,
            minX: (this.dataStore.win.innerWidth - (this.dataStore.win.innerWidth / 3)) / 2,
            maxX: this.dataStore.win.innerWidth
        };
        //开始按钮移入速度
        this.dataStore.startBtnSpeed = 10;
    }

    static getInstance() {
        if(!Director.instance) {
            Director.instance = new Director();
        }
        return Director.instance;
    }

    createStep() {
        const initX = (this.dataStore.win.innerWidth - this.stepWidth) * (Tools.randomFrom(0,100) / 100);
        const initY = this.dataStore.win.innerHeight;
        this.dataStore.get('steps').push(new Step(initX, initY));
    }

    // 初始化第一个台阶
    initStep() {
        const initX = (this.dataStore.win.innerWidth - this.stepWidth) / 2;
        const initY = this.dataStore.win.innerHeight - this.stepHeight - this.stepInterval;
        this.dataStore.get('steps').push(new Step(initX, initY));
    }

    // 初始化小球
    initBall() {
        const initX = (this.dataStore.win.innerWidth - this.ballSize) / 2;
        //console.log(initX);
        const initY = this.dataStore.win.innerHeight - this.stepHeight - this.stepInterval - this.ballSize;
        // console.log('初始化小球X:',initX,'Y:',initY);
        return new Ball(initX, initY);
    }

    restartInit() {
        // 清空台阶
        this.dataStore.del('steps');
        // 清空小球
        this.dataStore.del('ball');

        //初始化小球
        let Ball = this.initBall();
        this.dataStore.put('steps', [])
            .put('ball', Ball);
        // 初始化台阶
        this.initStep();

        // 初始化小球移动速度
        this.dataStore.ballSpeed = {
            x: 0,
            y: 1
        };
        //初始化触摸状态
        this.dataStore.isTouch = false;
        //初始化触摸位置
        this.dataStore.isLeft = true;

        //计数器
        this.dataStore.darwNum = 0;

        //是否固定小球位置
        this.dataStore.isBallFixed = false;
    }

    // 小球事件
    ballEventStart(event) {
        let touchX = event.touches[0].clientX;
        // 判断触摸的是左边还是右边
        let compare = (this.dataStore.win.innerWidth - 10) / 2;
        // 更改触摸状态
        this.dataStore.isTouch = true;
        if(touchX < compare) {
            //console.log('左边');
            this.dataStore.isLeft = true;
            this.dataStore.ballSpeed.x = this.dataStore.ballSpeed.x - 0.15;
        } else if (touchX >= (compare + 30)) {
            //console.log('右边');
            this.dataStore.isLeft = false;
            this.dataStore.ballSpeed.x = this.dataStore.ballSpeed.x + 0.15;
        } else {
            //console.log('中间');
        }
    }
    ballEventEnd(e) {
        // 更改触摸状态
        this.dataStore.isTouch = false;
        //触摸离开后进入缓冲运动，x的绝对值逐渐变小直至为零
    }

    // 检测是否点击了开始按钮
    checkClickStartBtn(event) {
        let touchX = event.touches[0].clientX;
        let touchY = event.touches[0].clientY;

        if( touchX > this.dataStore.startBtn.minX && 
            touchX < this.dataStore.startBtn.maxX && 
            touchY > this.dataStore.startBtn.y && 
            touchY < (this.dataStore.startBtn.y + this.dataStore.startBtn.h)
        ) {
            console.log('点击了');
            // 开始游戏
            this.isGameOver = false;
            this.dataStore.startBtnSpeed = -10;
        }

    }

    // 小球加速
    ballQuicken() {
        if(this.dataStore.isLeft) {
            this.dataStore.ballSpeed.x = this.dataStore.ballSpeed.x - 0.15;
        } else {
            this.dataStore.ballSpeed.x = this.dataStore.ballSpeed.x + 0.15;
        }
    }

    // 小球减速
    ballDecelerate() {
        if(this.dataStore.ballSpeed.x > 0) {
            this.dataStore.ballSpeed.x = this.dataStore.ballSpeed.x - 0.05;
            if(this.dataStore.ballSpeed.x < 0) {
                this.dataStore.ballSpeed.x = 0;
            }
        } else if (this.dataStore.ballSpeed.x < 0) {
            this.dataStore.ballSpeed.x = this.dataStore.ballSpeed.x + 0.05;
            if(this.dataStore.ballSpeed.x > 0) {
                this.dataStore.ballSpeed.x = 0;
            }
        } else {
            // 不做处理
        }
    }

    createCloud(initDistance = 0) {
        const  minTop = this.dataStore.win.innerHeight/3;
        const  maxTop = this.dataStore.win.innerHeight;
        // 屏幕内出现的云朵数量
        for(let i=0; i<this.cloudLength; i++) {
            let top  = Tools.randomFrom(minTop,maxTop);  // minTop + Math.random() * (maxTop - minTop);
            // 缩放
            let zoom = Tools.randomFrom(5,9) / 10;
            // 云朵前后相隔距离
            let distance = Tools.randomFrom(220,250) * i + initDistance;
            this.dataStore.get('clouds').push(new Cloud(top, zoom, distance));
        }
    }

    checkGameOver() {
        const ball = this.dataStore.get('ball');
        // 当小球的Y坐标超过上下屏幕边缘即为游戏结束
        // console.log(ball.y);
        // console.log(ball.x);
        if(ball.y < 0 || ball.y > this.dataStore.win.innerHeight){
            this.isGameOver = true;
            this.dataStore.isBallFixed = true;
            this.dataStore.startBtnSpeed = 10;

            this.restartInit();

            // this.dataStore.canvas.removeEventListener('touchstart', e => {
            //     console.log('移除事件touchstart');
            // });
            // this.dataStore.canvas.removeEventListener('touchend', e => {
            //     console.log('移除事件touchend');
            // });
            // cancelAnimationFrame(this.dataStore.get('timer'));
            // this.dataStore.destroy();
            
            // // 先设置cavas标签高宽
            // var canvas = document.getElementById("game_canvas");
            // canvas.setAttribute('width',window.innerWidth);
            // canvas.setAttribute('height',window.innerHeight);

            // new Main();
        }
    }

    run() {
        this.checkGameOver();
        if(this.dataStore.isTouch) {
            this.ballQuicken();
        } else {
            if(this.dataStore.ballSpeed.x !== 0){
                this.ballDecelerate();
            }
        }
        this.dataStore.get('background').draw();
        const clouds = this.dataStore.get('clouds');
        if(clouds[this.cloudLength*2-1].x < (this.dataStore.win.innerWidth) && clouds.length === this.cloudLength * 3){
            for(let i=0; i<this.cloudLength; i++) {
                clouds.shift();
            }
        }
        if(clouds[this.cloudLength*2-1].x <= (this.dataStore.win.innerWidth - clouds[this.cloudLength*2-1].width) && clouds.length === this.cloudLength * 2){
            let distance = clouds[clouds.length - 1].x;
            this.createCloud(distance);
        }
        this.dataStore.get('clouds').forEach(function(value){
            value.draw();
        });

        const steps = this.dataStore.get('steps');
        this.dataStore.get('steps').forEach(function(value){
            value.draw();
        });
        if(steps.length > 6){
            steps.shift();
        }
        if(steps[steps.length-1].y < (this.dataStore.win.innerHeight - 160)){
            this.createStep();
        }
        //console.log(this.dataStore.get('ball'));

        // 画出小球
        this.dataStore.get('ball').draw();

        // 画出开始按钮
        this.dataStore.get('startBtn').draw();

        if(!this.isGameOver) {
            this.stepSpeed = 1;
            this.dataStore.ballSpeed.y = 1;
        }else{
            this.stepSpeed = 0;
        }
        let timer = requestAnimationFrame(()=> this.run());
        this.dataStore.put('timer', timer);
        /*else {
            cancelAnimationFrame(this.dataStore.get('timer'));
            this.dataStore.destroy();
        }*/
    }
}
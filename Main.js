//初始化整个游戏精灵，作为游戏开始入口
import {ResourceLoader} from "./js/base/ResourceLoader.js";
import {Director} from "./js/Director.js";
import {BackGround} from "./js/runtime/BackGround.js";
import {DataStore} from "./js/base/DataStore.js";
import {StartBtn} from "./js/player/StartBtn.js";
import {BallCanvas} from "./js/player/BallCanvas.js";
import {Score} from "./js/player/Score.js";

export class Main {
    constructor() {
        this.canvas = wx.createCanvas();
        // this.canvas = document.getElementById('game_canvas');
        this.ctx =this.canvas.getContext('2d');
        this.dataStore = DataStore.getInstance();
        const loader = ResourceLoader.create();
        loader.onLoaded(map => this.onResourceFirstLoaded(map));

    }

    onResourceFirstLoaded(map) {
        this.dataStore.canvas = this.canvas;
        this.dataStore.ctx = this.ctx;
        this.dataStore.res = map;
        this.dataStore.win = {
            innerWidth: this.canvas.width,
            innerHeight: this.canvas.height
        };
        this.director = Director.getInstance();
        this.dataStore.ballCanvas = BallCanvas.getInstance();
        this.init();
    }

    // 播放背景音乐
    backgroundMusic() {
        let bgm = wx.createInnerAudioContext();
        bgm.autoplay = true;
        bgm.loop = true;
        bgm.src = 'res/audio/bgmusic.mp3';
        this.dataStore.bgm = bgm;
    }

    init() {

        console.log('初始化');

        this.backgroundMusic();

        // 重置游戏正常执行
        this.director.isGameOver = true;

        //初始化小球
        let Ball = this.director.initBall();

        this.dataStore
            .put('background', BackGround)
            .put('clouds', [])
            .put('steps', [])
            .put('ball', Ball)
            .put('score', Score)
            .put('startBtn', StartBtn);

        // 要在游戏逻辑之前创建
        this.director.createCloud();
        // 获取最后一个云朵
        let clouds = this.dataStore.get('clouds');
        // 第二组云朵的X轴偏移量
        let distance = clouds[clouds.length - 1].x;
        this.director.createCloud(distance);

        this.director.initStep();
        this.registerEvent();
        this.director.run();
    }

    registerEvent() {
        // this.canvas.addEventListener('touchstart', e => {
        //     e.preventDefault();
        //     //console.log(this.director.isGameOver);
        //     if(this.director.isGameOver) {
        //         //this.init();
        //         this.director.checkClickStartBtn(e)
        //     } else {
        //         this.director.ballEventStart(e);
        //     }
        // });
        wx.onTouchStart((e) => {
            if(this.director.isGameOver) {
                //this.init();
                this.director.checkClickStartBtn(e)
            } else {
                this.director.ballEventStart(e);
            }
        });
        // this.canvas.addEventListener('touchend', e => {
        //     e.preventDefault();
        //     if(this.director.isGameOver) {
        //         //this.init();
        //     } else {
        //         this.director.ballEventEnd(e);
        //     }
        // });
        wx.onTouchEnd((e) => {
            if(this.director.isGameOver) {
                //this.init();
            } else {
                this.director.ballEventEnd(e);
            }
        });
    }
}
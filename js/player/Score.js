//记分器

import {Sprite} from "../base/Sprite.js";
import {DataStore} from "../base/DataStore.js";

export class Score extends Sprite {
    constructor() {
        const image = Sprite.getImage('score');
        const dataStore = DataStore.getInstance();
        super(image,
            0,0,
            image.width,image.height,
            dataStore.scorePanel.x, dataStore.scorePanel.y,
            dataStore.scorePanel.w, dataStore.scorePanel.h);
    }

    draw(){
        super.draw();
        // 渲染分数
        let ctx = DataStore.getInstance().ctx;
        let fontSize = DataStore.getInstance().scorePanel.h;
        ctx.font = "bold "+ fontSize +"px "+ DataStore.getInstance().fontFamily;
        ctx.fillStyle = "#66AFAB";
        ctx.textAlign="center";
        ctx.fillText(DataStore.getInstance().score,
            DataStore.getInstance().scorePanel.x + (DataStore.getInstance().scorePanel.w / 2),
            DataStore.getInstance().scorePanel.y + (DataStore.getInstance().scorePanel.h / 1.1)
        );
    }
}
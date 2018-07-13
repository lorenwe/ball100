import {Main} from "./Main.js";

// 先设置cavas标签高宽
var canvas = document.getElementById("game_canvas");
canvas.setAttribute('width',window.innerWidth);
canvas.setAttribute('height',window.innerHeight);

new Main();
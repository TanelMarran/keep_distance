import {Game} from 'phaser';
import GameConfig = Phaser.Types.Core.GameConfig;
import {PlaygroundScene} from "./PlaygroundScene";
import {Chart} from 'chart.js';
import {loadChart} from "./chart";

let game: Game;
let playground: PlaygroundScene;
let chart: Chart;

const config: GameConfig = {
   title: "Quarantine",
   // @ts-ignore
   pixelArt: true,
   scale : {
      width: 320,
      height: 320,
      zoom: 4
   },
   backgroundColor: '#CCFFDE',
   scene: [PlaygroundScene],
   physics: {default: 'arcade',
   arcade: {
      debug: true
   }},
   parent: 'game'
};

window.onload = () => {
   game = new Game(config);
   let add_button: HTMLElement = document.getElementById('add-button');
   add_button.onclick = addPerson;
   let remove_button: HTMLElement = document.getElementById('remove-button');
   remove_button.onclick = removePerson;
   let pause_button: HTMLElement = document.getElementById('pause-button');
   pause_button.onclick = getHealthCounts;
   chart = loadChart();
};

function addPerson(): void {
   (<PlaygroundScene>game.scene.getScene('PlaygroundScene')).addPerson();
}

function removePerson(): void {
   (<PlaygroundScene>game.scene.getScene('PlaygroundScene')).removePerson();
}

function pauseGame(): void {
   game.scene.pause('PlaygroundScene');
}

function getHealthCounts(): void {
   console.log((<PlaygroundScene>game.scene.getScene('PlaygroundScene')).getHealthCount());
}

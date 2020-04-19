import {Game} from 'phaser';
import GameConfig = Phaser.Types.Core.GameConfig;
import {PlaygroundScene} from "./PlaygroundScene";
import {loadChart} from "./chart"

let game: Game;

const config: GameConfig = {
   title: "Quarantine",
   // @ts-ignore
   pixelArt: true,
   scale : {
      width: 640,
      height: 480,
      zoom: 2
   },
   backgroundColor: '#CCFFDE',
   scene: [PlaygroundScene],
   physics: {default: 'arcade',
   arcade: {
      debug: false
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
   pause_button.onclick = pauseGame;
   loadChart();
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


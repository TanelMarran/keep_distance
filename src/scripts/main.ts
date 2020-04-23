import {Game} from 'phaser';
import GameConfig = Phaser.Types.Core.GameConfig;
import {PlaygroundScene} from "./PlaygroundScene";
import {Chart} from 'chart.js';
import {addData, loadChart, updateMaxY} from "./chart";

let game: Game;
let isPaused: boolean;

const config: GameConfig = {
   title: "Quarantine",
   // @ts-ignore
   pixelArt: true,
   scale : {
      width: 320,
      height: 240,
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
   const pause_button: HTMLElement = document.getElementById('pause-button');
   pause_button.onclick = pauseGame;
   const people_amount: HTMLInputElement = <HTMLInputElement>(document.getElementById('people-amount'));
   people_amount.onchange = () => setPopulationAmount(people_amount);
   const chart: Chart = loadChart();
   const timerId = setInterval(() => updateChart(chart), 100);
};

function setPopulationAmount(element: HTMLInputElement) {
   element.value = Math.max(0,+element.value).toString();
   (<PlaygroundScene>game.scene.getScene('PlaygroundScene')).setPopulation(+element.value);
}

function addPerson(): void {
   (<PlaygroundScene>game.scene.getScene('PlaygroundScene')).addPerson();
}

function removePerson(): void {
   (<PlaygroundScene>game.scene.getScene('PlaygroundScene')).removePerson();
}

function pauseGame(): void {
   if(!game.scene.isPaused('PlaygroundScene')) {
      game.scene.pause('PlaygroundScene');
      isPaused = true;
   } else {
      game.scene.resume('PlaygroundScene');
      isPaused = false;
   }
}

function getHealthCounts(): [number, number, number] {
   return (<PlaygroundScene>game.scene.getScene('PlaygroundScene')).getHealthCount();
}

function updateChart(chart: Chart): void {
   if(!isPaused) {
      const values: [number, number, number] = getHealthCounts();
      updateMaxY(chart, values.reduce((a, b) => a + b, 0));
      addData(chart, '', values[1]);
   }
}

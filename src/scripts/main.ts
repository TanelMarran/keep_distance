import {Game} from 'phaser';
import GameConfig = Phaser.Types.Core.GameConfig;
import {PlaygroundScene} from "./PlaygroundScene";
import {Chart} from 'chart.js';
import {addData, loadChart, updateMaxY} from "./chart";
import Timeout = NodeJS.Timeout;

let game: Game;
let isPaused: boolean;
let chart: Chart;

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
      debug: true
   }},
   parent: 'game'
};

window.onload = () => {
   game = new Game(config);
   const pause_button: HTMLElement = document.getElementById('pause-button');
   pause_button.onclick = () => pauseGame(pause_button);
   const reset_button: HTMLElement = document.getElementById('reset-button');
   reset_button.onclick = resetGame;
   const people_amount: HTMLInputElement = <HTMLInputElement>(document.getElementById('people-amount'));
   people_amount.onchange = () => setPopulationAmount(people_amount);
   chart = loadChart();
   let timerId: Timeout = setInterval(() => updateChart(chart), 100);

   function resetGame() {
      people_amount.value = "0";
      setPopulationAmount(people_amount);
      chart = loadChart();
      clearInterval(timerId);
      timerId = setInterval(() => updateChart(chart), 100);
   }
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

function pauseGame(button: HTMLElement): void {
   if(!(<PlaygroundScene>game.scene.getScene('PlaygroundScene')).paused) {
      (<PlaygroundScene>game.scene.getScene('PlaygroundScene')).paused = true;
      button.innerText = "Play";
      isPaused = true;
   } else {
      (<PlaygroundScene>game.scene.getScene('PlaygroundScene')).paused = false;
      button.innerText = "Pause";
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

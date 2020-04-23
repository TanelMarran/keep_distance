import {Game} from 'phaser';
import {PlaygroundScene} from "./PlaygroundScene";
import {Chart} from 'chart.js';
import {addData, loadChart, updateMaxY} from "./chart";
import {Tool} from "./objects/Mouse";
import GameConfig = Phaser.Types.Core.GameConfig;
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
      debug: false
   }},
   parent: 'game'
};

window.onload = () => {
   game = new Game(config);


   const pause_button: HTMLElement = document.getElementById('pause-button');
   pause_button.onclick = () => pauseGame(pause_button);

   const reset_button: HTMLElement = document.getElementById('reset-button');
   reset_button.onclick = resetGame;

   const infect_tool: HTMLElement = document.getElementById('infect-tool');
   infect_tool.onclick = () => setTool(Tool.Infect);

   const doggy_tool: HTMLElement = document.getElementById('doggy-tool');
   doggy_tool.onclick = () => setTool(Tool.Doggy);

   const people_amount: HTMLInputElement = <HTMLInputElement>(document.getElementById('people-amount'));
   people_amount.onchange = () => setPopulationAmount(people_amount);

   chart = loadChart();
   let timerId: Timeout = setInterval(() => updateChart(chart), 100);

   function setTool(tool: Tool) {
      (<PlaygroundScene>game.scene.getScene('PlaygroundScene')).mouse.currentTool = tool;
   }

   function setPopulationAmount(element: HTMLInputElement) {
      element.value = Math.max(0,+element.value).toString();
      (<PlaygroundScene>game.scene.getScene('PlaygroundScene')).setPopulation(+element.value);
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

   function resetGame() {
      people_amount.value = "0";
      setPopulationAmount(people_amount);
      chart = loadChart();
      clearInterval(timerId);
      timerId = setInterval(() => updateChart(chart), 100);
   }
};

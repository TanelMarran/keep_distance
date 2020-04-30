import {Game} from 'phaser';
import {PlaygroundScene} from "./PlaygroundScene";
import {Chart} from 'chart.js';
import {addData, loadChart, updateMaxY} from "./chart";
import {Tool} from "./objects/Mouse";
import introJs from 'intro.js/intro.js';
import GameConfig = Phaser.Types.Core.GameConfig;
import Timeout = NodeJS.Timeout;

let game: Game;
let isPaused: boolean;
let isDistancing: boolean;
let chart: Chart;

export enum Colors {
   infected = '#cc3781',
   healthy = '#C8F3E5',
   recovered = '#e2cd5a'
}

const config: GameConfig = {
   title: "Keep Distance",
   // @ts-ignore
   pixelArt: true,
   scale : {
      width: 431,
      height: 240,
      zoom: 2
   },
   backgroundColor: Colors.healthy,
   scene: [PlaygroundScene],
   physics: {default: 'arcade',
   arcade: {
      debug: false
   }},
   parent: 'game'
};

window.onload = () => {
   game = new Game(config);
   isDistancing = true;
   Chart.defaults.global.defaultFontFamily = "comic sans";

   const pause_button: HTMLElement = document.getElementById('pause-button');
   pause_button.onclick = () => pauseGame(pause_button);

   const reset_button: HTMLElement = document.getElementById('reset-button');
   reset_button.onclick = resetGame;

   const infect_tool: HTMLElement = document.getElementById('infect-tool');
   infect_tool.onclick = () => setTool(infect_tool, Tool.Infect);

   const doggy_tool: HTMLElement = document.getElementById('doggy-tool');
   doggy_tool.onclick = () => setTool(doggy_tool, Tool.Doggy);

   const behaviour_button: HTMLElement = document.getElementById('behaviour-button');
   behaviour_button.onclick = () => toggleBehaviour(behaviour_button);

   const git_button: HTMLElement = document.getElementById('git');
   git_button.onclick = () => openInNewTab("https://github.com/TanelMarran/keep_distance");

   function toggleBehaviour(behaviour_button: HTMLElement) {
      if(isDistancing) {
         (<PlaygroundScene>game.scene.getScene('PlaygroundScene')).setDistancing(false);
         behaviour_button.innerText = "Off";
         isDistancing = false;
      } else {
         (<PlaygroundScene>game.scene.getScene('PlaygroundScene')).setDistancing(true);
         behaviour_button.innerText = "On";
         isDistancing = true;
      }
   }

   const people_amount: HTMLInputElement = <HTMLInputElement>(document.getElementById('people-amount'));
   people_amount.onchange = () => setPopulationAmount(people_amount);

   chart = loadChart();
   let timerId: Timeout = setInterval(() => updateChart(chart), 100);

   function setTool(element: HTMLElement, tool: Tool) {
      var testElements = document.getElementsByClassName('selected');
      Array.prototype.filter.call(testElements, function(testElement){
         testElement.classList.remove('selected');
      });
      element.classList.add('selected');
      (<PlaygroundScene>game.scene.getScene('PlaygroundScene')).mouse.currentTool = tool;
   }

   function setPopulationAmount(element: HTMLInputElement) {
      element.value = Math.max(0,+element.value).toString();
      (<PlaygroundScene>game.scene.getScene('PlaygroundScene')).targetPopulation = +element.value;
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
         addData(chart, '', values);
      }
   }

   function resetGame() {
      people_amount.value = "0";
      (<PlaygroundScene>game.scene.getScene('PlaygroundScene')).resetGame();
      chart.destroy();
      chart = loadChart();
      clearInterval(timerId);
      timerId = setInterval(() => updateChart(chart), 100);
   }

   checkCookieIntro();

   //Source: https://stackoverflow.com/questions/19262176/how-to-start-intro-js-tour-only-on-first-visit-to-website/19262302
   function checkCookieIntro(){
      var cookie=getCookie("keepDistance");

      if (cookie==null || cookie=="") {
         setCookie("keepDistance", "1",90);
         introJs().start();
      }
   }


   function setCookie(c_name,value,exdays)
   {
      var exdate=new Date();
      exdate.setDate(exdate.getDate() + exdays);
      var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
      document.cookie=c_name + "=" + c_value;
   }

   function getCookie(c_name)
   {
      var c_value = document.cookie;
      var c_start = c_value.indexOf(" " + c_name + "=");
      if (c_start == -1)
      {
         c_start = c_value.indexOf(c_name + "=");
      }
      if (c_start == -1)
      {
         c_value = null;
      }
      else
      {
         c_start = c_value.indexOf("=", c_start) + 1;
         var c_end = c_value.indexOf(";", c_start);
         if (c_end == -1)
         {
            c_end = c_value.length;
         }
         c_value = unescape(c_value.substring(c_start,c_end));
      }
      return c_value;
   }

   //Source: https://stackoverflow.com/questions/4907843/open-a-url-in-a-new-tab-and-not-a-new-window
   function openInNewTab(url) {
      var win = window.open(url, '_blank');
      win.focus();
   }
};

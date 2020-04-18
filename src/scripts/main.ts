import {Game} from 'phaser';
import GameConfig = Phaser.Types.Core.GameConfig;
import {PlaygroundScene} from "./PlaygroundScene";


const config: GameConfig = {
   title: "Quarantine",
   // @ts-ignore
   pixelArt: true,
   scale : {
      width: 320,
      height: 320,
      zoom: 2
   },
   backgroundColor: '#CCFFDE',
   scene: [PlaygroundScene],
   physics: {default: 'arcade',
   arcade: {
      debug: false
   }}
};

window.onload = () => {
   new Game(config);
};

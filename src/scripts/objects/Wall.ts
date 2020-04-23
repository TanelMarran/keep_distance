import {PlaygroundScene} from "../PlaygroundScene";
import Sprite = Phaser.Physics.Arcade.Sprite;
import {Moveable} from "./Moveable";

export class Wall extends Sprite {
    castScene : PlaygroundScene;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'wall');
        this.castScene = <PlaygroundScene>scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.castScene.wallGroup.add(this);

        scene.physics.add.overlap(this,this.castScene.moveablesGroup,function(self: Wall, other: Moveable) {

        },null,this);
    }




}

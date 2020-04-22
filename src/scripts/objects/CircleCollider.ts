import Image = Phaser.Physics.Arcade.Image;
import {PlaygroundScene} from "../PlaygroundScene";
import {Moveable} from "./Moveable";

export class CircleCollider extends Image {
    parent: Moveable;
    constructor(scene: Phaser.Scene, x: number, y: number,parent: Moveable, frame?: string | integer) {
        super(scene,x,y,'person',frame);

        scene.add.existing(this);
        this.setAlpha(0,0,0,0);
        scene.physics.add.existing(this);
        let radius = 32;
        this.body.setCircle(radius,-16,-16); //I can not figure out the formula for the offset at all
        this.parent = parent;
    }
}

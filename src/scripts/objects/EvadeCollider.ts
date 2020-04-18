import Image = Phaser.Physics.Arcade.Image;
import {PlaygroundScene} from "../PlaygroundScene";

export class EvadeCollider extends Image {
    parent: Image;
    constructor(scene: Phaser.Scene, x: number, y: number,parent: Image, frame?: string | integer) {
        super(scene,x,y,'person',frame);

        scene.add.existing(this);
        this.setScale(3,3);
        this.setAlpha(0,0,0,0);
        scene.physics.add.existing(this);
        //this.body.setSize(6,7,false);
        //this.body.setOffset(1,1);
        this.body.setCircle(16,-12,-11);
        this.parent = parent;
    }
}

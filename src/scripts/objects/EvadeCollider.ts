import Image = Phaser.Physics.Arcade.Image;
import {PlaygroundScene} from "../PlaygroundScene";

export class EvadeCollider extends Image {
    parent: Image;
    constructor(scene: Phaser.Scene, x: number, y: number,parent: Image, frame?: string | integer) {
        super(scene,x,y,'person',frame);

        scene.add.existing(this);
        //this.setScale(1,1);
        this.setAlpha(0,0,0,0);
        scene.physics.add.existing(this);
        //this.body.setSize(6,7,false);
        //this.body.setOffset(1,1);
        let radius = 32;
        this.body.setCircle(radius,-16,-16); //I can not figure out the formula for the offset at all
        this.parent = parent;
    }

    weirdFibo(n) {
        if(n == 0) {
            return 0
        }
        if(n == 1) {
            return 8
        }
        return this.weirdFibo(n-1)+this.weirdFibo(n-2);
    }
}

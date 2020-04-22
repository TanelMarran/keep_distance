import {Moveable} from "./Moveable";

export class Doggy extends Moveable {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string = 'doggy', frame?: string | integer) {
        super(scene,x,y,texture,frame)
    }

    protected applyAnimation(time: number): void {
        super.applyAnimation(time);
        if(this.movement.x < -0.1) {
            this.setScale(-Math.abs(this.scaleX),this.scaleY);
            this.setOffset(16,0);
        }
        if(this.movement.x > 0.1) {
            this.setScale(Math.abs(this.scaleX),this.scaleY);
            this.setOffset(0,0);
        }
    }
}


import {Moveable} from "./Moveable";

export class Doggy extends Moveable {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string = 'doggy', frame?: string | integer) {
        super(scene,x,y,texture,frame)
    }
}


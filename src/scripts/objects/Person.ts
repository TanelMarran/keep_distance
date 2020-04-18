import Image = Phaser.Physics.Arcade.Image;
import Scene = Phaser.Scene;
import {PlaygroundScene} from "../PlaygroundScene";
import Vector2 = Phaser.Math.Vector2;

export class Person extends Image {
    castScene : PlaygroundScene;
    follow: boolean;

    movement = new Vector2(0,0);
    targetMovement = new Vector2(0,0);
    maxMovement = 5;
    movementAcceleration = 0.2;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string = 'person',follow = false, frame?: string | integer) {
        super(scene,x,y,texture,frame);

        scene.add.existing(this);
        this.setScale(3,3);
        scene.physics.add.existing(this);
        this.follow = follow;

        scene.events.on('update',this.update,this);
        this.castScene = <PlaygroundScene>scene;
    }

    update(time: number, delta: number): void {
        this.rotation = Math.sin(time/180*2)*0.25;
        if(this.follow) {
            this.x += 0.1 * (this.scene.game.input.mousePointer.x - this.x);
            this.y += 0.1 * (this.scene.game.input.mousePointer.y - this.y);
        }
        this.move(this.movement);
        //Collisions with
        this.scene.physics.overlap(this,this.castScene.populationGroup,function (self, other) {
            console.log('New Created');//this.populationGroup.add(new Person(this,50,50,'person'));
        },null,this.castScene)
    }

    moveVectors(svector: Vector2, tvector: Vector2): void {
        const dist: Vector2 = tvector.divide(svector);

    }

    move(vector: Vector2): void {
        this.x += vector.x;
        this.y += vector.y;
    }
}

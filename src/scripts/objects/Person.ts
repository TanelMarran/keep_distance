import Image = Phaser.Physics.Arcade.Image;
import Scene = Phaser.Scene;
import {PlaygroundScene} from "../PlaygroundScene";
import Vector2 = Phaser.Math.Vector2;
import Body = Phaser.Physics.Arcade.Body;
import GameObject = Phaser.GameObjects.GameObject;
import {EvadeCollider} from "./EvadeCollider";

export class Person extends Image {
    castScene : PlaygroundScene;
    follow: boolean;

    movement = new Vector2(0,0);
    targetMovement = new Vector2(0,0);
    maxMovement = 5;
    movementAcceleration = 0.2;

    evadeCollider: EvadeCollider;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string = 'person',follow = false, frame?: string | integer) {
        super(scene,x,y,texture,frame);
        this.castScene = <PlaygroundScene>scene;

        scene.add.existing(this);
        this.setScale(3,3);
        scene.physics.add.existing(this);
        this.follow = follow;

        this.evadeCollider = new EvadeCollider(this.scene, this.x, this.y, this);
        this.body.setSize(6,7,false);
        this.body.setOffset(1,1);
        this.body.setCircle(3,1,2);
        scene.events.on('update',this.update,this);
    }

    update(time: number, delta: number): void {
        this.rotation = Math.sin(time/180*2)*0.25;
        this.z = -this.y;
        this.evadeCollider.x = this.x;
        this.evadeCollider.y = this.y;
        if(this.follow) {
            this.x += 0.1 * (this.scene.game.input.mousePointer.x - this.x);
            this.y += 0.1 * (this.scene.game.input.mousePointer.y - this.y);
        }
        this.move(this.movement);
        //Collisions with
        this.scene.physics.overlap(this.evadeCollider,this.castScene.populationGroup,function (self, other) {
            let selfperson : Person = <Person>(<EvadeCollider>self).parent;
            var otherperson : Person = <Person>other;
            const dist: Vector2 = new Vector2(otherperson.x-selfperson.x,otherperson.y-selfperson.y);
            otherperson.move(dist.scale(0.02));
        },null,this.castScene);
        this.scene.physics.overlap(this,this.castScene.populationGroup,function (self, other) {
            let selfperson : Person = <Person>self;
            var otherperson : Person = <Person>other;
            const dist: Vector2 = new Vector2(otherperson.x-selfperson.x,otherperson.y-selfperson.y);
            otherperson.move(dist.scale(0.08));
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

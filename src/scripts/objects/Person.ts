import Image = Phaser.Physics.Arcade.Image;
import Scene = Phaser.Scene;
import {PlaygroundScene} from "../PlaygroundScene";
import Vector2 = Phaser.Math.Vector2;
import Body = Phaser.Physics.Arcade.Body;
import GameObject = Phaser.GameObjects.GameObject;
import {EvadeCollider} from "./EvadeCollider";
import Sprite = Phaser.Physics.Arcade.Sprite;

export class Person extends Sprite {
    castScene : PlaygroundScene;
    follow: boolean;

    movement = new Vector2(0,0);
    targetMovement = new Vector2(0,0);
    maxMovement = 5;
    movementAcceleration = 0.02;

    evadeCollider: EvadeCollider;

    movementDir: number;
    movementMag: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string = 'person',follow = false, frame?: string | integer) {
        super(scene,x,y,texture,frame);
        this.castScene = <PlaygroundScene>scene;

        scene.add.existing(this);
        this.setScale(3,3);
        this.setOrigin(0.5,0.5);
        scene.physics.add.existing(this);
        this.follow = follow;
        this.movement = new Vector2(0,0);

        this.evadeCollider = new EvadeCollider(this.scene, this.x, this.y, this);
        this.body.setSize(6,7,false);
        this.body.setCircle(3,1,2);
        scene.events.on('update',this.update,this);
    }

    update(time: number, delta: number): void {
        if(Phaser.Math.Between(0,30) == 0) { //Random chance to perform an action
            if(Phaser.Math.Between(1,100) < 50) {
                this.movementDir = Phaser.Math.Between(0,359)*(Math.PI/180);
                this.movementMag = Math.random()*1.5+0.2;
            } else {
                this.movementMag = 0;
            }
            let width = this.scene.game.scale.width;
            let height = this.scene.game.scale.height;
            if(this.x < 0 || this.y < 0 || this.x > width || this.y > height) {
                this.movementDir = -new Vector2(width/2-this.x,height/2-this.y).angle();
                this.movementMag = 0.5;
            }
        }
        this.targetMovement.x = Math.cos(this.movementDir)*this.movementMag;
        this.targetMovement.y = -Math.sin(this.movementDir)*this.movementMag;
        this.rotation = Math.sin(time/180*6)*0.25*(Math.min(this.movement.length()/3));
        this.z = -this.y;
        this.evadeCollider.x = this.x;
        this.evadeCollider.y = this.y;
        /*if(this.follow) {
            this.targetMovement.x = this.scene.game.input.mousePointer.x-this.x; // += 0.1 * (this.scene.game.input.mousePointer.x - this.x);
            this.targetMovement.y = this.scene.game.input.mousePointer.y-this.y; // += 0.1 * (this.scene.game.input.mousePointer.y - this.y);
        }*/
        this.moveVectors(this.movement,this.targetMovement);
        //Collisions with evasion circle
        this.scene.physics.overlap(this.evadeCollider,this.castScene.populationGroup,function (self, other) {
            let selfperson : Person = <Person>(<EvadeCollider>self).parent;
            var otherperson : Person = <Person>other;
            const dist: Vector2 = new Vector2(otherperson.x-selfperson.x,otherperson.y-selfperson.y);
            selfperson.movement = selfperson.movement.add(dist.scale(-0.0008));
            otherperson.movement = otherperson.movement.add(dist.scale(0.0008));
            //otherperson.move(dist.scale(0.02));
        },null,this.castScene);
        this.scene.physics.overlap(this,this.castScene.populationGroup,function (self, other) {
            let selfperson : Person = <Person>self;
            var otherperson : Person = <Person>other;
            const dist: Vector2 = new Vector2(otherperson.x-selfperson.x,otherperson.y-selfperson.y);
            otherperson.move(dist.scale(0.08));
        },null,this.castScene);
        this.move(this.movement);
    }

    moveVectors(svector: Vector2, tvector: Vector2): Vector2 {
        let dist: Vector2 = tvector.subtract(svector);
        dist = dist.scale(Math.min(this.movementAcceleration,dist.length())/dist.length());
        return svector.add(dist);
    }

    move(vector: Vector2): void {
        const width = this.scene.game.scale.width;
        const height = this.scene.game.scale.height;
        const pad = 10;
        this.x += vector.x;
        this.y += vector.y;
        this.x = Phaser.Math.Clamp(this.x,pad,width-pad);
        this.y = Phaser.Math.Clamp(this.y,pad,height-pad);
        //this.scene.physics.moveTo(this,this.x+vector.x,this.y+vector.y)
    }

    removeSelf(): void {
        this.evadeCollider.destroy();
        this.scene.events.removeListener('update',this.update,this);
        this.destroy();
    }
}

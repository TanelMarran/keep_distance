import {PlaygroundScene} from "../PlaygroundScene";
import Vector2 = Phaser.Math.Vector2;
import {EvadeCollider} from "./EvadeCollider";
import Sprite = Phaser.Physics.Arcade.Sprite;
import Line = Phaser.GameObjects.Line;

export class Person extends Sprite {
    castScene : PlaygroundScene;
    follow: boolean;

    movement: Vector2;
    targetMovement: Vector2;
    targetCoord: Vector2;
    maxMovement = 2;
    movementAcceleration = 0.05;

    evadeCollider: EvadeCollider;
    evadeMovement: Vector2;
    line: Line;
    evasionAmount = 1.5;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string = 'person',follow = false, frame?: string | integer) {
        super(scene,x,y,texture,frame);
        this.castScene = <PlaygroundScene>scene;

        scene.add.existing(this);
        this.setScale(3,3);
        this.setOrigin(0.5,0.5);
        scene.physics.add.existing(this);
        this.follow = follow;
        this.movement = new Vector2(0,0);
        this.targetMovement = new Vector2(0,0);
        this.evadeMovement = new Vector2(0,0);
        this.targetCoord = new Vector2(this.x,this.y);

        this.evadeCollider = new EvadeCollider(this.scene, this.x, this.y, this);
        this.body.setSize(6,7,false);
        this.body.setCircle(3,1,2);
        this.line = new Line(scene,this.x,this.y,0,0,this.movement.x*30,this.movement.y*30,0xff0000,1);
        scene.add.existing(this.line);
        scene.events.on('update',this.update,this);
    }

    update(time: number, delta: number): void {
        this.evadeMovement.x = 0;
        this.evadeMovement.y = 0;
        if(Phaser.Math.Between(0,200) == 0) { //Random chance to perform an action
            let width = this.scene.game.scale.width;
            let height = this.scene.game.scale.height;
            let pad = 20;
            this.targetCoord.x = Phaser.Math.Between(pad,width-pad);
            this.targetCoord.y = Phaser.Math.Between(pad,height-pad);
            this.maxMovement = Math.random()+0.25;
        }
        let distance_to_target = new Vector2(this.targetCoord.x-this.x,this.targetCoord.y-this.y);
        if(distance_to_target.length() < 10) {
            this.targetMovement.x = 0;
            this.targetMovement.y = 0;
        } else {
            this.targetMovement = distance_to_target;
        }
        this.rotation = Math.sin(time/180*6)*0.25*(Math.min(this.movement.length()/3));
        this.z = -this.y;
        this.evadeCollider.x = this.x;
        this.evadeCollider.y = this.y;
        this.movement = this.moveVectors(this.movement,this.targetMovement);
        //Collisions with evasion circle
        this.scene.physics.overlap(this.evadeCollider,this.castScene.populationGroup,function (self, other) {
            let selfperson : Person = <Person>(<EvadeCollider>self).parent;
            var otherperson : Person = <Person>other;
            if(selfperson != otherperson) {
                const dist: Vector2 = new Vector2((selfperson.x - otherperson.x), (selfperson.y - otherperson.y));
                dist.x = Math.max(0,80-Math.abs(dist.x))*Math.sign(dist.x);
                dist.y = Math.max(0,80-Math.abs(dist.y))*Math.sign(dist.y);
                selfperson.evadeMovement = dist.scale(selfperson.evasionAmount).scale(0.001);
            }
        },null,this.castScene);
        this.scene.physics.overlap(this,this.castScene.populationGroup,function (self, other) {
            let selfperson : Person = <Person>self;
            var otherperson : Person = <Person>other;
            const dist: Vector2 = new Vector2(otherperson.x-selfperson.x,otherperson.y-selfperson.y);
            otherperson.move(dist.scale(0.08));
            selfperson.setTint(0x3fc1b2);
        },null,this.castScene);
        this.move(this.movement.add(this.evadeMovement));
    }

    moveVectors(svector: Vector2, tvector: Vector2): Vector2 {
        tvector = tvector.normalize().scale(Math.min(this.maxMovement,tvector.length()));
        let dist: Vector2 = tvector.subtract(svector);
        dist = dist.normalize().scale(Math.min(this.movementAcceleration,dist.length()));
        return svector.add(dist);
    }

    move(vector: Vector2): void {
        let length = vector.length();
        vector = vector.normalize().scale(Math.min(this.maxMovement,length));
        this.x += vector.x;
        this.y += vector.y;

        let width = this.scene.game.scale.width;
        let height = this.scene.game.scale.height;
        let pad = 10;
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

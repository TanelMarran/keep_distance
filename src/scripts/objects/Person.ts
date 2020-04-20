import {PlaygroundScene} from "../PlaygroundScene";
import Vector2 = Phaser.Math.Vector2;
import {EvadeCollider} from "./EvadeCollider";
import Sprite = Phaser.Physics.Arcade.Sprite;
import Line = Phaser.GameObjects.Line;
import GameObject = Phaser.GameObjects.GameObject;

enum Health {
    Healthy = "Healthy",
    Infected = "Infected",
    Recovered = "Recovered"
}

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
    evasionAmount = 1.3;
    health: Health;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string = 'person',follow = false, frame?: string | integer) {
        super(scene,x,y,texture,frame);
        this.castScene = <PlaygroundScene>scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.follow = follow;
        this.movement = new Vector2(0,0);
        this.targetMovement = new Vector2(0,0);
        this.evadeMovement = new Vector2(0,0);
        this.targetCoord = new Vector2(this.x,this.y);
        this.health = Health.Healthy;

        this.evadeCollider = new EvadeCollider(this.scene, this.x, this.y, this);
        this.body.setCircle(8,0,0);
        scene.events.on('update',this.update,this);
    }

    update(time: number, delta: number): void {
        this.evadeMovement.x = 0;
        this.evadeMovement.y = 0;
        this.evadeCollider.x = this.x;
        this.evadeCollider.y = this.y;

        this.pickDestination();

        this.rotation = Math.sin(time/180*6)*0.25*(Math.min(this.movement.length()/3));
        this.movement = this.moveVectors(this.movement,this.targetMovement);

        //Collisions with evasion circle
        this.scene.physics.overlap(this.evadeCollider,this.castScene.populationGroup,function (self, other) {
            let selfperson : Person = <Person>(<EvadeCollider>self).parent;
            var otherperson : Person = <Person>other;
            if(selfperson != otherperson) {
                selfperson.evade(otherperson);
            }
        },null,this.castScene);

        //Collisions with other people
        this.scene.physics.overlap(this,this.castScene.populationGroup,function (self, other) {
            const selfperson: Person = <Person>self;
            const otherperson: Person = <Person>other;
            const dist: Vector2 = new Vector2(otherperson.x - selfperson.x, otherperson.y - selfperson.y);
            otherperson.move(dist.scale(0.08));
            selfperson.health = Person.transmitVirus(selfperson.health,otherperson.health);
        },null,this.castScene);

        //Collisions with the mouse
        this.scene.physics.overlap(this.evadeCollider,this.castScene.mouseArea,function (self) {
            const selfperson : Person = <Person>(<EvadeCollider>self).parent;
            const mousepos: Vector2 = new Vector2(this.input.mousePointer.x,this.input.mousePointer.y);
            selfperson.evade(mousepos);
        },null,this.castScene);

        this.move(this.movement.add(this.evadeMovement));
    }

    private pickDestination(): void {
        if (Phaser.Math.Between(0, 200) == 0) { //Random chance to pick a new destination
            let width = this.scene.game.scale.width;
            let height = this.scene.game.scale.height;
            let pad = 12;
            this.targetCoord.x = Phaser.Math.Between(pad, width - pad);
            this.targetCoord.y = Phaser.Math.Between(pad, height - pad);
            this.maxMovement = 1.25;
        }
        let distance_to_target = new Vector2(this.targetCoord.x-this.x,this.targetCoord.y-this.y);
        if(distance_to_target.length() < 10) { //Nullify destination if close enough
            this.targetMovement.x = 0;
            this.targetMovement.y = 0;
        } else {
            this.targetMovement = distance_to_target;
        }
    }

    moveVectors(svector: Vector2, tvector: Vector2): Vector2 {
        tvector = tvector.normalize().scale(Math.min(this.maxMovement,tvector.length()));
        let dist: Vector2 = tvector.subtract(svector);
        dist = dist.normalize().scale(Math.min(this.movementAcceleration,dist.length()));
        return svector.add(dist);
    }

    evade(other: Vector2 | Person): void {
        const dist: Vector2 = new Vector2((this.x - other.x), (this.y - other.y));
        dist.x = Math.max(0,60-Math.abs(dist.x))*Math.sign(dist.x);
        dist.y = Math.max(0,60-Math.abs(dist.y))*Math.sign(dist.y);
        this.evadeMovement = this.evadeMovement.add(dist.scale(this.evasionAmount).scale(0.001));
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

    static transmitVirus(self: Health, other: Health): Health {
        if(self == Health.Healthy && other == Health.Infected) {
            return Health.Infected;
        }
        return self;
    }
}

import {PlaygroundScene} from "../PlaygroundScene";
import Vector2 = Phaser.Math.Vector2;
import {CircleCollider} from "./CircleCollider";
import Sprite = Phaser.Physics.Arcade.Sprite;
import Line = Phaser.GameObjects.Line;
import {Moveable} from "./Moveable";

export enum Health {
    Healthy = "Healthy",
    Infected = "Infected",
    Recovered = "Recovered"
}

export class Person extends Moveable {
    evadeCollider: CircleCollider;
    evadeMovement: Vector2;
    evasionAmountMax = 1.3;
    evasionAmount = this.evasionAmountMax;

    health: Health;
    infectionTime: number;

    attractionTime = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string = 'person', frame?: string | integer) {
        super(scene,x,y,texture,frame);

        this.castScene.peopleGroup.add(this);
        this.evadeMovement = new Vector2(0,0);
        this.targetCoord = new Vector2(this.x,this.y);
        this.evadeCollider = new CircleCollider(this.scene, this.x, this.y, this);
        this.body.setCircle(8,0,0);

        this.setHealth(Health.Healthy);
    }

    handleAttraction(): void {
        this.attractionTime = Math.max(0,this.attractionTime-1);
        if(this.attractionTime > 0) {
            this.evasionAmount = 0;
        } else {
            this.evasionAmount = this.evasionAmountMax;
        }
    }

    update(time: number, delta: number): void {
        this.evadeMovement.x = 0;
        this.evadeMovement.y = 0;
        this.evadeCollider.x = this.x;
        this.evadeCollider.y = this.y;

        this.pickDestination();

        this.handleAttraction();

        this.recoverVirus(delta);

        this.applyAnimation(time);

        this.moveBody();
    }

    public moveVectors(svector: Vector2, tvector: Vector2): Vector2 {
        tvector = tvector.normalize().scale(Math.min(this.maxMovement,tvector.length()));
        let dist: Vector2 = tvector.subtract(svector);
        dist = dist.normalize().scale(Math.min(this.movementAcceleration,dist.length()));
        return svector.add(dist);
    }

    public evade(other: Vector2 | Person): void {
        const dist: Vector2 = new Vector2((this.x - other.x), (this.y - other.y));
        dist.x = Math.max(0,60-Math.abs(dist.x))*Math.sign(dist.x);
        dist.y = Math.max(0,60-Math.abs(dist.y))*Math.sign(dist.y);
        this.evadeMovement = this.evadeMovement.add(dist.scale(this.evasionAmount).scale(0.001));
    }

    public destroy(fromScene?: boolean): void {
        this.evadeCollider.destroy();
        super.destroy(fromScene);
    }

    private transmitVirus(other: Health): void {
        if(this.health == Health.Healthy && other == Health.Infected) {
            this.setHealth(Health.Infected);
        }
    }

    public setHealth(health: Health): void {
        this.health = health;
        switch (this.health) {
            case Health.Healthy:
                this.setTint(0xffffff);
                break;
            case Health.Infected:
                this.setTint(0xff0000);
                this.infectionTime = 10+Phaser.Math.Between(0,10);
                break;
            case Health.Recovered:
                this.setTint(0x0000ff);
                break;
        }
    }

    private recoverVirus(delta: number): void {
        if(this.health == Health.Infected) {
            this.infectionTime -= delta/1000;
            if(this.infectionTime <= 0) {
                this.setHealth(Health.Recovered);
            }
        }
    }

    protected moveBody(): void {
        this.movement = this.moveVectors(this.movement,this.targetMovement);

        this.checkOverlaps();

        this.move(this.movement.add(this.evadeMovement));
    }

    protected checkOverlaps(): void {
        //Collisions with other people
        this.scene.physics.overlap(this,this.castScene.peopleGroup,function (self, other) {
            const selfperson: Person = <Person>self;
            const otherperson: Person = <Person>other;
            selfperson.transmitVirus(otherperson.health);
        },null,this.castScene);

        super.checkOverlaps();

        //Collisions with evasion circle
        this.scene.physics.overlap(this.evadeCollider,this.castScene.peopleGroup,function (self, other) {
            let selfperson : Person = <Person>(<CircleCollider>self).parent;
            var otherperson : Person = <Person>other;
            if(selfperson != otherperson) {
                selfperson.evade(otherperson);
            }
        },null,this.castScene);

        //Collisions with the mouse
        this.scene.physics.overlap(this.evadeCollider,this.castScene.mouse,function (self) {
            const selfperson : Person = <Person>(<CircleCollider>self).parent;
            const mousepos: Vector2 = new Vector2(this.input.mousePointer.x,this.input.mousePointer.y);
            selfperson.evade(mousepos);
        },null,this.castScene);
    }
}

import {Moveable} from "./Moveable";
import {CircleCollider} from "./CircleCollider";
import Vector2 = Phaser.Math.Vector2;
import {Person} from "./Person";
import {PoofEmitter} from "./PoofEmitter";

export class Doggy extends Moveable {
    attractionCollider: CircleCollider;
    lifeTime: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string = 'doggy', frame?: string | integer) {
        super(scene,x,y,texture,frame);

        this.attractionCollider = new CircleCollider(scene,x,y,this);
        this.attractionCollider.setCircle(48,-32,-32);
        this.lifeTime = 5+Phaser.Math.Between(0,4);
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

    protected checkOverlaps(): void {
        super.checkOverlaps();
        //Attract people
        this.scene.physics.overlap(this.attractionCollider,this.castScene.peopleGroup,function (s: CircleCollider, o : Person) {
            const self: Doggy = (<Doggy>s.parent);
            let dist: Vector2 = new Vector2(o.x - self.x,o.y - self.y);
            dist = dist.normalize().scale(10);
            o.targetCoord = new Vector2(self.x+dist.x,self.y+dist.y);
            if(o.attractionTime == 0) {
                new PoofEmitter(self.scene,self.castScene.particleSystem,o.x,o.y,[9,10,11],0.01,0.5);
            }
            o.attractionTime = 3;
        },null,this.castScene);
    }

    update(time: number, delta: number): void {
        this.attractionCollider.x = this.x;
        this.attractionCollider.y = this.y;
        super.update(time, delta);
        this.checkLife(delta);
    }

    checkLife(delta: number): void {
        this.lifeTime -= delta/1000;
        if(this.lifeTime < 0) {
            this.destroy();
        }
    }

    public destroy(fromScene?: boolean): void {
        this.attractionCollider.destroy();
        super.destroy(fromScene);
    }
}


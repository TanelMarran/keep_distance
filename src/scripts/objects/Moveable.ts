import {PlaygroundScene} from "../PlaygroundScene";
import Vector2 = Phaser.Math.Vector2;
import Sprite = Phaser.Physics.Arcade.Sprite;

export abstract class Moveable extends Sprite {
    castScene : PlaygroundScene;

    movement: Vector2;
    targetMovement: Vector2;
    targetCoord: Vector2;
    maxMovement = 2;
    movementAcceleration = 0.05;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string = 'person', frame?: string | integer) {
        super(scene,x,y,texture,frame);
        this.castScene = <PlaygroundScene>scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.movement = new Vector2(0,0);
        this.targetMovement = new Vector2(0,0);

        this.targetCoord = new Vector2(this.x,this.y);

        this.body.setCircle(8,0,0);
        scene.events.on('update',this.update,this);
    }

    update(time: number, delta: number): void {
        this.pickDestination();

        this.applyAnimation(time);

        this.moveBody();
    }



    protected pickDestination(): void {
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

    public moveVectors(svector: Vector2, tvector: Vector2): Vector2 {
        tvector = tvector.normalize().scale(Math.min(this.maxMovement,tvector.length()));
        let dist: Vector2 = tvector.subtract(svector);
        dist = dist.normalize().scale(Math.min(this.movementAcceleration,dist.length()));
        return svector.add(dist);
    }

    public move(vector: Vector2): void {
        let length = vector.length();
        vector = vector.normalize().scale(Math.min(this.maxMovement,length));
        this.x += vector.x;
        this.y += vector.y;

        let width = this.scene.game.scale.width;
        let height = this.scene.game.scale.height;
        let pad = 10;
        this.x = Phaser.Math.Clamp(this.x,pad,width-pad);
        this.y = Phaser.Math.Clamp(this.y,pad,height-pad);
    }

    public destroy(fromScene?: boolean): void {
        this.scene.events.removeListener('update',this.update,this);
        super.destroy();
    }

    protected applyAnimation(time: number): void {
        this.rotation = Math.sin(time/180*6)*0.25*(Math.min(this.movement.length()/3));
    }

    protected moveBody(): void {
        this.movement = this.moveVectors(this.movement,this.targetMovement);
        this.move(this.movement);
    }
}

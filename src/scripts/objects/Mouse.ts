import {CircleCollider} from "./CircleCollider";
import {Doggy} from "./Doggy";
import {PlaygroundScene} from "../PlaygroundScene";
import {Health, Person} from "./Person";

export class Mouse extends CircleCollider {
    castScene: PlaygroundScene;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene,x,y,null);
        this.castScene = <PlaygroundScene>scene;
        this.body.setCircle(3,12.5,12.5);
        scene.events.on('update',this.update,this);
        scene.input.on('pointerdown', this.infect,this);
    }

    update(time: number, delta: number): void {
        this.x = this.scene.input.mousePointer.x;
        this.y = this.scene.input.mousePointer.y;
    }

    addDoggy(): void {
        new Doggy(this.scene,this.x,this.y);
    }

    infect(): void {
        this.scene.physics.overlap(this,this.castScene.peopleGroup,function (self: Mouse, other: Person) {
            if(other.health == Health.Healthy) {
                other.setHealth(Health.Infected);
            }
        },null,this.castScene);
    }
}

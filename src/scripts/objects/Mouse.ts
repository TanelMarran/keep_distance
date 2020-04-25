import {CircleCollider} from "./CircleCollider";
import {Doggy} from "./Doggy";
import {PlaygroundScene} from "../PlaygroundScene";
import {Health, Person} from "./Person";
import Vector2 = Phaser.Math.Vector2;

export enum Tool {
    Infect,
    Doggy
}

export class Mouse extends CircleCollider {
    castScene: PlaygroundScene;
    currentTool: Tool;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene,x,y,null);
        this.castScene = <PlaygroundScene>scene;
        this.body.setCircle(3,12.5,12.5);
        this.currentTool = Tool.Infect;
        scene.events.on('update',this.update,this);
        scene.input.on('pointerdown',this.useTool,this);
    }

    useTool(): void {
        switch (this.currentTool) {
            case Tool.Infect:
                this.infect();
                break;
            case Tool.Doggy:
                this.addDoggy();
                break;
        }
    }

    update(time: number, delta: number): void {
        this.x = this.scene.input.activePointer.x;
        this.y = this.scene.input.activePointer.y;
    }

    addDoggy(): void {
        new Doggy(this.scene,this.scene.input.activePointer.x,this.scene.input.activePointer.y);
    }

    infect(): void {
        this.x = this.scene.input.activePointer.x;
        this.y = this.scene.input.activePointer.y;
        if(Mouse.isMobileDevice()) { //Mobile needs a different approach
            let closest: Person = null;
            for (let p of this.castScene.peopleGroup.getChildren()) {
                const person : Person = <Person>p;
                if(closest == null) {
                    closest = person;
                } else {
                    if(new Vector2(this.x - person.x, this.y - person.y).length() < new Vector2(this.x - closest.x, this.y - closest.y).length()) {
                        closest = person;
                    }
                }
            }
            if (closest.health == Health.Healthy && new Vector2(this.x - closest.x, this.y - closest.y).length() < 20) {
                closest.setHealth(Health.Infected);
            }
        } else {
            this.scene.physics.overlap(this, this.castScene.peopleGroup, function (self: Mouse, other: Person) {
                if (other.health == Health.Healthy) {
                    other.setHealth(Health.Infected);
                }
            }, null, this.castScene);
        }
    }

    //Source: https://coderwall.com/p/i817wa/one-line-function-to-detect-mobile-devices-with-javascript
    static isMobileDevice(): boolean {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }
}

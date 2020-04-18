import Scene = Phaser.Scene;
import Image = Phaser.GameObjects.Image;
import {Person} from "./objects/Person";
import Group = Phaser.Physics.Arcade.Group;

export class PlaygroundScene extends Scene {
    person: Person;
    populationGroup: Group;

    constructor() {
        super({key: 'PlaygroundScene'})
    }

    init(): void {
        this.populationGroup = new Group(this.physics.world,this);
    }

    preload(): void {
        this.load.image('person',require('../sprites/person.png'));
    }

    create(): void {
        for(var i = 0; i < 30; i++) {
            this.populationGroup.add(new Person(this,Phaser.Math.Between(0,this.game.scale.width),Phaser.Math.Between(0,this.game.scale.height),'person'));
        }
    }

    update(time: number, delta: number): void {
    }
}

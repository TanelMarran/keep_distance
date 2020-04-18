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
        this.populationGroup.add(new Person(this,10,10,'person',true));
        this.populationGroup.add(new Person(this,10,10,'person'));
    }

    update(time: number, delta: number): void {
    }
}

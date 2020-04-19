import Scene = Phaser.Scene;
import Text = Phaser.GameObjects.Text;
import {Person} from "./objects/Person";
import Group = Phaser.Physics.Arcade.Group;
import Graphics = Phaser.GameObjects.Graphics;

export class PlaygroundScene extends Scene {
    person: Person;
    populationGroup: Group;
    text: Text;

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
        for(var i = 0; i < 1; i++) {
            this.addPerson();        }
        //this.person = new Person(this,Phaser.Math.Between(0,this.game.scale.width),Phaser.Math.Between(0,this.game.scale.height),'person');
        //this.text = this.add.text(10,10,this.person.movement.length().toString());
    }

    update(time: number, delta: number): void {
        //this.text.setText(this.person.movement.length().toString());
    }

    addPerson(): void {
        this.populationGroup.add(new Person(this,Phaser.Math.Between(0,this.game.scale.width),Phaser.Math.Between(0,this.game.scale.height),'person'));
    }

    removePerson(): void {
        if(this.populationGroup.getLength() > 0) {
            (<Person>this.populationGroup.getChildren().pop()).removeSelf();
        }
    }
}

import Scene = Phaser.Scene;
import Text = Phaser.GameObjects.Text;
import {Health, Person} from "./objects/Person";
import Group = Phaser.Physics.Arcade.Group;
import {CircleCollider} from "./objects/CircleCollider";
import {Doggy} from "./objects/Doggy";

export class PlaygroundScene extends Scene {
    mouseArea: CircleCollider;
    peopleGroup: Group;
    moveablesGroup: Group;
    text: Text;

    constructor() {
        super({key: 'PlaygroundScene'})
    }

    init(): void {
        this.peopleGroup = new Group(this.physics.world,this);
        this.moveablesGroup = new Group(this.physics.world,this);
    }

    preload(): void {
        this.load.image('person_1',require('../sprites/person_1.png'));
        this.load.image('person_2',require('../sprites/person_2.png'));
        this.load.image('person_3',require('../sprites/person_3.png'));
        this.load.image('person_4',require('../sprites/person_4.png'));
        this.load.image('doggy',require('../sprites/doggy.png'));
    }

    create(): void {
        this.mouseArea = new CircleCollider(this,this.game.input.mousePointer.x, this.game.input.mousePointer.y,null);
        this.mouseArea.body.setCircle(3,12,12);
        new Doggy(this,Phaser.Math.Between(0,this.game.scale.width),Phaser.Math.Between(0,this.game.scale.height));
        for(var i = 0; i < 1; i++) {
            this.addPerson();
        }
    }

    update(time: number, delta: number): void {
        this.mouseArea.x = this.game.input.mousePointer.x;
        this.mouseArea.y = this.game.input.mousePointer.y;
        //this.text.setText(this.person.movement.length().toString())
    }

    addPerson(): void {
        const image = 'person_'+Phaser.Math.Between(1,4);
        new Person(this,Phaser.Math.Between(0,this.game.scale.width),Phaser.Math.Between(0,this.game.scale.height),image);
    }

    removePerson(): void {
        if(this.peopleGroup.getLength() > 0) {
            (<Person>this.peopleGroup.getChildren()[0]).destroy();
        }
    }

    getHealthCount(): [number, number, number] {
        let counts: [number, number, number] = [0,0,0];
        const healthKeys = Object.keys(Health);
        for(let p of this.peopleGroup.getChildren()) {
            let person: Person = <Person>p;
            for(let index in healthKeys) {
                if(person.health == healthKeys[index]) {
                    counts[index]++;
                }
            }
        }
        return counts;
    }
}

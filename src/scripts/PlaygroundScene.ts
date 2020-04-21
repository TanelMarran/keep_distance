import Scene = Phaser.Scene;
import Text = Phaser.GameObjects.Text;
import {Health, Person} from "./objects/Person";
import Group = Phaser.Physics.Arcade.Group;
import {EvadeCollider} from "./objects/EvadeCollider";

export class PlaygroundScene extends Scene {
    mouseArea: EvadeCollider;
    populationGroup: Group;
    text: Text;

    constructor() {
        super({key: 'PlaygroundScene'})
    }

    init(): void {
        this.populationGroup = new Group(this.physics.world,this);
    }

    preload(): void {
        this.load.image('person_1',require('../sprites/person_1.png'));
        this.load.image('person_2',require('../sprites/person_2.png'));
        this.load.image('person_3',require('../sprites/person_3.png'));
        this.load.image('person_4',require('../sprites/person_4.png'));
    }

    create(): void {
        this.mouseArea = new EvadeCollider(this,this.game.input.mousePointer.x, this.game.input.mousePointer.y,null);
        this.mouseArea.body.setCircle(3,12,12);
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
        this.populationGroup.add(new Person(this,Phaser.Math.Between(0,this.game.scale.width),Phaser.Math.Between(0,this.game.scale.height),image));
    }

    removePerson(): void {
        if(this.populationGroup.getLength() > 0) {
            (<Person>this.populationGroup.getChildren()[0]).removeSelf();
        }
    }

    getHealthCount(): [number, number, number] {
        let counts: [number, number, number] = [0,0,0];
        const healthKeys = Object.keys(Health);
        for(let p of this.populationGroup.getChildren()) {
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

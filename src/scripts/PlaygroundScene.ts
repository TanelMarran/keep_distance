import Scene = Phaser.Scene;
import Text = Phaser.GameObjects.Text;
import {Health, Person} from "./objects/Person";
import Group = Phaser.Physics.Arcade.Group;
import {Doggy} from "./objects/Doggy";
import {Mouse} from "./objects/Mouse";
import {Moveable} from "./objects/Moveable";

export class PlaygroundScene extends Scene {
    mouse: Mouse;
    peopleGroup: Group;
    moveablesGroup: Group;
    wallGroup: Group;
    text: Text;
    targetPopulation: number;
    population: number;

    paused: boolean;

    evasionAmountMax = 1.3;
    evasionAmount = this.evasionAmountMax;

    constructor() {
        super({key: 'PlaygroundScene'})
    }

    init(): void {
        this.peopleGroup = new Group(this.physics.world,this);
        this.moveablesGroup = new Group(this.physics.world,this);
        this.wallGroup = new Group(this.physics.world,this);
        this.paused = false;
    }

    preload(): void {
        const frameConfig = {frameWidth: 16, frameHeight: 16};
        this.load.spritesheet('person_1',require('../sprites/person_1.png'),frameConfig);
        this.load.spritesheet('person_2',require('../sprites/person_2.png'),frameConfig);
        this.load.spritesheet('person_3',require('../sprites/person_3.png'),frameConfig);
        this.load.spritesheet('person_4',require('../sprites/person_4.png'),frameConfig);
        this.load.image('doggy',require('../sprites/doggy.png'));
        this.load.image('wall',require('../sprites/wall.png'));
    }

    create(): void {
        this.mouse = new Mouse(this,this.game.input.mousePointer.x, this.game.input.mousePointer.y);
        this.population = 1;
        this.targetPopulation = 1;
        for(var i = 0; i < 1; i++) {
            this.addPerson();
        }
    }

    update(time: number, delta: number): void {
        this.mouse.x = this.game.input.mousePointer.x;
        this.mouse.y = this.game.input.mousePointer.y;
        this.population += (this.targetPopulation-this.population)*0.1;
        this.setPopulation(Math.round(this.population));
    }

    addPerson(): void {
        const image = 'person_'+Phaser.Math.Between(1,4);
        new Person(this,Phaser.Math.Between(0,this.game.scale.width),Phaser.Math.Between(0,this.game.scale.height),image,this.evasionAmount);
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

    setPopulation(amount: number): void {
        const current = this.peopleGroup.getChildren().length;
        if(amount > current) {
            for(let i = 0; i < amount-current; i++) {
                this.addPerson();
            }
        } else if (amount < current) {
            for(let i = 0; i < current-amount; i++) {
                this.removePerson();
            }
        }
    }

    setDistancing(value: boolean): void {
        if(value) {
            this.evasionAmount = this.evasionAmountMax;
        } else {
            this.evasionAmount = 0;
        }

        for(let p of this.peopleGroup.getChildren()) {
            (<Person>p).evasionAmountMax = this.evasionAmount;
        }
    }

    resetGame(): void {
        while(this.moveablesGroup.getLength() > 0) {
            (<Person>this.moveablesGroup.getChildren()[0]).destroy();
        }
        this.population = 0;
        this.targetPopulation = 0;
    }
}

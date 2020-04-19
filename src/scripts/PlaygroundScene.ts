import Scene = Phaser.Scene;
import Text = Phaser.GameObjects.Text;
import {Person} from "./objects/Person";
import Group = Phaser.Physics.Arcade.Group;
import Graphics = Phaser.GameObjects.Graphics;
import {EvadeCollider} from "./objects/EvadeCollider";
import Vector2 = Phaser.Math.Vector2;

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
        this.load.image('person',require('../sprites/person.png'));
    }

    create(): void {
        this.mouseArea = new EvadeCollider(this,this.game.input.mousePointer.x, this.game.input.mousePointer.y,null);
        this.mouseArea.body.setCircle(3,1,2);
        for(var i = 0; i < 1; i++) {
            this.addPerson();
        }
        //this.person = new Person(this,Phaser.Math.Between(0,this.game.scale.width),Phaser.Math.Between(0,this.game.scale.height),'person');
        //this.text = this.add.text(10,10,this.person.movement.length().toString());
    }

    update(time: number, delta: number): void {
        this.mouseArea.x = this.game.input.mousePointer.x;
        this.mouseArea.y = this.game.input.mousePointer.y;
        //this.text.setText(this.person.movement.length().toString());
    }

    addPerson(): void {
        this.populationGroup.add(new Person(this,Phaser.Math.Between(0,this.game.scale.width),Phaser.Math.Between(0,this.game.scale.height),'person'));
    }

    removePerson(): void {
        if(this.populationGroup.getLength() > 1) {
            (<Person>this.populationGroup.getChildren()[1]).removeSelf();
        }
    }
}

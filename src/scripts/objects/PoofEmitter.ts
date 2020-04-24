import ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter;
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import Scene = Phaser.Scene;

export class PoofEmitter {
    emitter: ParticleEmitter;
    lifetime: number;
    scene: Scene;

    constructor(scene: Scene, manager: ParticleEmitterManager,x: number, y: number, frames: number[], lifetime: number) {
        this.emitter = manager.createEmitter({
            frame: frames,
            x: x,
            y: y,
            lifespan: 150,
            speed: { min: 45, max: 80 },
            angle: {min: 0, max: 359},
            gravityY: 0,
            scale: 1,
            quantity: 1
        });
        this.lifetime = lifetime;
        this.scene = scene;

        this.scene.events.on('update',this.update,this);
    }

    update(time: number, delta: number): void {
        this.lifetime -= delta/1000;
        if(this.lifetime < 0) {
            this.emitter.stop();
            if(this.emitter.getAliveParticleCount() == 0) {
                this.destroy();
            }
        }
    }

    destroy(): void {
        this.scene.events.removeListener('update',this.update,this);
        this.emitter.remove();
    }
}

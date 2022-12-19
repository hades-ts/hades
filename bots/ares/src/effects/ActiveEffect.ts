import { choice } from "../utils";
import { StatusEffect } from "./StatusEffect";



export abstract class ActiveEffect extends StatusEffect {

    abstract hit_messages: string[]
    abstract hit_limit: number

    abstract on_hit(): Record<string, any>

    hits: number;

    constructor(game, source, move, target) {
        super(game, source, move, target)
        this.hits = 0
    }

    tick() {
        this.ticks += 1
        if (this.ticks % this.ticklimit === 0) {
            if (this.hits >= this.hit_limit) {
                this.remove()
            } else {
                this.hits += 1
                const context = this.on_hit()
                this.game.fsay(choice(this.hit_messages), {
                    p: this.source,
                    t: this.target,
                    m: this.move,
                    ...context,
                })
            }
        }
    }
}
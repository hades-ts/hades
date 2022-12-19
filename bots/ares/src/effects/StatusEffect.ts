import { choice } from "../utils"


export abstract class StatusEffect {

    abstract name: string
    abstract apply_messages: string[]
    abstract remove_messages: string[]
    abstract ticklimit: number

    protected game: any

    source: any
    move: any
    target: any
    ticks: number

    constructor(game, source, move, target) {
        this.game = game
        this.source = source
        this.move = move
        this.target = target
    }

    public apply() {
        this.ticks = 0
        this.target.effects.add(this)
        const message = choice(this.apply_messages)
        this.game.fsay(message, {
            p: this.source,
            t: this.target,
            m: this.move,
        })
    }

    public remove() {
        if (this.target.effects.remove(this)) {
            const message = choice(this.remove_messages)
            this.game.fsay(message, {
                p: this.source,
                t: this.target,
                m: this.move,
            })
        }
    }

    public tick() {
        this.ticks += 1
        if (this.ticks >= this.ticklimit) {
            this.remove()
        }
    }

}

import { z } from 'zod';

enum StatusEffect {
    Curse = 'curse', // lower chance of hitting
    Bless = 'bless', // higher chance of hitting
    Blind = 'blind', // no chance of hitting

    Mute = 'mute', // can only use physical attacks
    Ghost = 'ghost', // can only use magic attacks

    Poison = 'poison', // magic damage over time
    Cure = 'cure', // heal over time

    Burn = 'burn', // physical damage over time
    Shield = 'shield', // immune to damage

    Haste = 'haste', // increases speed
    Slow = 'slow', // decreases speed
    Quick = 'quick', // next attack hits instantly

    Confuse = 'confuse', // random chance of attacking self
    Sleep = 'sleep', // can't act / slowly heals / physical attacks wake up
    MIA = 'mia', // can't act / can't be targeted

    Berserk = 'berserk', // physical damage up, auto-attack
}

enum Element {
    Fire = 'fire',
    Water = 'water',
    Earth = 'earth',
    Wind = 'wind',
    Light = 'light',
    Shadow = 'shadow',
    Mind = 'mind',
    Body = 'body',
    Life = 'life',
    Death = 'death',
}

const moveEffectSchema = z.object({

    name: z.string(),
    description: z.string(),

    power_ratio: z.number().min(0).max(1),

    can_super: z.boolean().default(false),
    can_counter: z.boolean().default(false),

    start_strings: z.array(z.string()).nonempty(),
    super_strings: z.array(z.string()).nonempty().optional(),

    miss_strings: z.array(z.string()).nonempty(),
    hit_strings: z.array(z.string()).nonempty(),
    crit_hit_strings: z.array(z.string()).nonempty(),
    super_hit_strings: z.array(z.string()).nonempty().optional(),

    effects: z.array(z.nativeEnum(StatusEffect)).nonempty().max(4),

}).refine(data => {
    if (data.can_super && !data.super_strings) {
        return {
            message: 'MoveEffect must have super_strings if can_super is true',
            path: ['super_strings'],
        };
    }
    if (data.can_super && !data.super_hit_strings) {
        return {
            message: 'MoveEffect must have super_hit_strings if can_super is true',
            path: ['super_hit_strings'],
        };
    }
})

const moveSchema = z.object({
    name: z.string(),
    description: z.string(),

    powerRatio: z.number().min(0).max(1),
    // statusEffects: z.
})

const characterSchema = z.object({
    name: z.string(),
    description: z.string(),

    events: z.object({
        join: z.string(),
        leave: z.string(),
        death: z.string(),
        taunt: z.string(),
    }),
})
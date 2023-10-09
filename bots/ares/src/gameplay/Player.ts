import { GuildMember } from "discord.js";
import { StatusEffect } from "../effects/StatusEffect";

export class Player {
    member: GuildMember;

    team: number;
    character: any;
    current_move: any | null;

    health: number;
    magic: number;
    super: number;
    effects: Record<string, StatusEffect>;

    constructor(member: GuildMember, character: any, team: number) {
        this.member = member;
        this.team = team;
        this.character = character;
        this.current_move = null;
        this.health = 0;
        this.magic = 0;
        this.super = 0;
        this.effects = {};
    }

    get status_message() {
        let action = "READY";
        if (this.current_move) {
            const m = this.current_move.name;
            if (this.current_move.target) {
                const t = this.current_move.target.name;
                action = `doing ${m} on ${t}`;
            } else {
                action = `doing ${m}`;
            }
        }

        const nickname = this.member.nickname || this.member.user.username;
        const hp = this.health;
        const mp = this.magic;
        const sp = this.super;
        return `${nickname} is ${action} : ${hp}HP : ${mp}MP : ${sp}SP`;
    }

    get is_ready() {
        return this.current_move === null;
    }

    is_enemy(other: Player) {
        return this.team !== other.team;
    }

    has(effectName: string) {
        return effectName in this.effects;
    }

    halt() {
        this.current_move.alive = false;
        this.current_move = null;
    }
}

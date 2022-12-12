import { MessageEmbed, User } from 'discord.js';
import { arg, command, description, TextCommand } from "@hades-ts/text-commands";


@command("info")
@description("Get info on a user.")
export class UserInfo extends TextCommand {

    @arg()
    @description("User to get info on.")
    targetUser!: User;

    async execute() {
        const { username, id } = this.targetUser;
        return this.reply(
            `${username}'s id is ${id} .`
        );
    }
}
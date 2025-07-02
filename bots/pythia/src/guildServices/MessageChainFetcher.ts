import type { Message } from "discord.js";
import { inject } from "inversify";

import { HadesClient } from "@hades-ts/core";
import { GuildInfo, guildSingleton } from "@hades-ts/guilds";

/**
 *  The goal of this class is to, given a message:
 * - Check whether its: A. a mention to us, B. a reply to a message we sent
 * - If so, fetch the message reply-chain as long as each message is either:
 *  - Authored by us
 *  - Authored by the original user
 *  - Is the original user replying to someone else
 *
 *  The original user replying to someone else is a special case,
 *  we want to fetch the message they replied to, but then halt
 *  the chain.
 *
 *  Example:
 *
 *  User A: I think red is the best color.
 *  User B: @Pythia pff, isn't blue better?
 *  Bot: As an AI, I don't have a preference for colors.
 *  User B: @Pythia, aw c'mon just pick one.
 *  Bot: OK, I pick green.
 *
 *  If each message is a reply, we'd fetch all these messages, aborting
 *  at the first message that isn't the original user or a reply.
 * */

@guildSingleton()
export class MessageChainFetcher {
    @inject(GuildInfo)
    protected guildInfo!: GuildInfo;

    @inject(HadesClient)
    protected client!: HadesClient;

    // This should start with a message that mentions us by some user.
    async fetchMessageChain(newMessage: Message) {
        const chain: Message[] = [];
        const isMe = (m: Message) => m.author.id === this.client.user.id;
        const isThem = (m: Message) => m.author.id === newMessage.author.id;
        const isReply = (m: Message) => !!m.reference;
        const mentionsMe = (m: Message) => m.mentions.has(this.client.user);

        let turn = "them" as "them" | "me";
        let message = newMessage;

        while (chain.length < 10) {
            if (turn === "them") {
                // the message should mention us, or be a reply to someone (us, or someone else)
                // if someone else, it'll terminate the chain
                if (isThem(message)) {
                    if (mentionsMe(message)) {
                        chain.push(message);
                        if (isReply(message)) {
                            message = await message.fetchReference();
                            turn = "me"; // we should be expecting a message from us next
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }

            // we should be expecting a message from us next
            if (turn === "me") {
                chain.push(message);

                if (isMe(message)) {
                    if (isReply(message)) {
                        message = await message.fetchReference();
                        turn = "them";
                    } else {
                        break;
                    }
                } else {
                    // we've hit a message that isn't us, or a reply to us
                    // so we're done
                    break;
                }
            }
        }

        return chain;
    }
}

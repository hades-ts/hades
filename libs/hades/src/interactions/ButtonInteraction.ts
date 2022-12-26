import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    Collection,
    CollectorFilter,
    ComponentType,
    InteractionCollector,
    InteractionType,
    Message
} from "discord.js"


const randomId = () => {
    return Math.random().toString(36).substr(2, 9)
}

export abstract class BaseButtonInteraction {
    id: string
    channel: Message["channel"]
    collector: InteractionCollector<ButtonInteraction>
    private interaction?: ButtonInteraction

    constructor(channel: Message["channel"], options?: {
        timeout?: number
    }) {
        this.id = randomId()
        this.channel = channel
        this.collector = this.createCollector(options?.timeout)
    }

    abstract build(): ButtonBuilder;
    protected abstract onClick(interaction: ButtonInteraction): Promise<void>;
    protected abstract cleanup(interaction: ButtonInteraction, interactions: Collection<string, ButtonInteraction>): Promise<void>;

    protected createCollector(timeout = 10000) {
        const filter: CollectorFilter<[ButtonInteraction<"cached">]> =
            (...interactions: Array<ButtonInteraction<"cached">>) =>
                interactions.some(interaction => interaction.customId === this.id)

        const collector = this.channel.createMessageComponentCollector<ComponentType.Button>({
            filter,
            time: timeout,
        })

        collector.on("collect", async (interaction) => {
            this.interaction = interaction
            if (interaction.type === InteractionType.MessageComponent) {
                if (interaction.customId === this.id) {
                    await this.onClick(interaction)
                }
            }
        })

        collector.on("end", async (interactions) => {
            await this.cleanup(this.interaction, interactions)
        })

        return collector
    }

    asRow() {
        return new ActionRowBuilder<ButtonBuilder>()
            .addComponents(this.build())
    }
}
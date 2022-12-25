import { HadesClient, singleton } from "@hades-ts/hades";
import { inject, postConstruct } from "inversify";


@singleton(ThreadStarterService)
export class ThreadStarterService {

    @inject(HadesClient)
    protected client: HadesClient;


    @postConstruct()
    init() {

        this.client.on('interactionCreate', async interaction => {
            if (!interaction.isButton()) return

            if (interaction.customId === 'create-thread') {
                const message = interaction.message
                await message.edit({
                    content: message.content,
                    embeds: message.embeds,
                    components: [],
                })

                await message.startThread({
                    name: 'Pythia Thread',
                    reason: "Continuing conversation"
                })
            }
        })
    }
}
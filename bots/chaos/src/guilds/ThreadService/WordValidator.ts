import { guildSingleton } from "@hades-ts/guilds";

import { WordValidator } from "../WordValidator";

@guildSingleton()
export class ThreadWordValidator extends WordValidator {}

import { guildSingleton } from "../../decorators";
import { WordValidator } from "../WordValidator";


@guildSingleton()
export class ThreadWordValidator extends WordValidator {

}
    
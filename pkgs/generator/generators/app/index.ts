import Generator from "yeoman-generator";
import chalk from "chalk";
import yosay from "yosay";

var red = chalk.red;

interface Answers {
    botName: string;
}

interface Arguments {
    botName: string;
}

module.exports = class extends Generator {
    answers: Answers;
    constructor(args, opts: Arguments) {
        super(args, opts);
        this.argument("botName", {
            type: String,
            required: false,
            default: "hades-bot",
            description: "Name of your bot.",
        });
    }

    async prompting() {
        this.log(yosay(`Welcome to ${red("Hades")} bot generator !`));
        this.answers = await this.prompt([
            {
                type: "input",
                name: "botName",
                message: "What's the name of your bot?",
                default: "hades-bot",
            },
        ]);
    }

    // copy all files in __dirname/templates to destination path recursively
    async _copy_all() {
        this.fs.copyTpl(
            this.templatePath("**/*"),
            this.destinationPath(this.answers["botName"]),
            this.answers,
        );
    }

    async writing() {
        await this._copy_all();
    }

    install() {
        console.log("Nothing to install");
    }
};

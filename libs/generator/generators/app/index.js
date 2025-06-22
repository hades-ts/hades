"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yeoman_generator_1 = __importDefault(require("yeoman-generator"));
const chalk_1 = __importDefault(require("chalk"));
const yosay_1 = __importDefault(require("yosay"));
var red = chalk_1.default.red;
module.exports = class extends yeoman_generator_1.default {
    answers;
    constructor(args, opts) {
        super(args, opts);
        this.argument("botName", {
            type: String,
            required: false,
            default: "hades-bot",
            description: "Name of your bot.",
        });
    }
    async prompting() {
        this.log((0, yosay_1.default)(`Welcome to ${red("Hades")} bot generator !`));
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
        this.fs.copyTpl(this.templatePath("**/*"), this.destinationPath(this.answers["botName"]), this.answers);
    }
    async writing() {
        await this._copy_all();
    }
    install() {
        console.log("Nothing to install");
    }
};

import Generator = require('yeoman-generator')
import { red } from 'chalk'
import yosay = require('yosay')


interface Answers {
    botName: string
}

interface Arguments {
    botName: string
}

module.exports = class extends Generator<Arguments> {
    answers: Answers
    constructor(args, opts: Arguments) {
        super(args, opts)
        this.argument("botName", { type: String, required: false, default: 'hades-bot', description: 'Name of your bot.' })
    }

    async prompting() {
        this.log(yosay(`Welcome to ${red('Hades')} bot generator !`))

        const prompts: Generator.Question[] = [
            {
                type: 'input',
                name: 'botName',
                message: 'What\'s the name of your bot?',
                default: 'hades-bot'
            }
        ]

        this.answers = await this.prompt<Answers>(prompts)
    }

    // copy all files in __dirname/templates to destination path recursively  
    async _copy_all() {
        this.fs.copyTpl(
            this.templatePath('**/*'),
            this.destinationPath(this.answers['botName']),
            this.answers
        )
    }

    async writing() {
        await this._copy_all()
    }

    install() {
        console.log('Nothing to install')
    }
}

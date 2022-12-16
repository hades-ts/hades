import * as child from 'child_process'
import prompts from "prompts"
import { allProjects } from './utils'


const FILES_TO_REMOVE: string[] = [
    ".rush",
    "*.build.log",
    "*.build.error.log",
    "dist",
    "data",
    "deploy",
]

const FILES_TO_RENAME: string[][] = [
    // [".gitignore.template", ".gitignore"],
    // [".npmignore.template", ".npmignore"]
]

async function askForEjectPath() {
    const { ejectPath } = await prompts({
        type: "text",
        name: "ejectPath",
        message: "Where would you like to eject to?",
        initial: "~",
    })
    return ejectPath
}

async function askForBotName(): Promise<string> {
    const projects = allProjects()
    const botNames = projects
        .filter(
            project => project.projectRelativeFolder.startsWith("bots/")
        ).map(
            project => project.projectRelativeFolder.replace("bots/", "")
        )
    const { botName } = await prompts({
        type: "select",
        name: "botName",
        message: "Which bot would you like to eject?",
        choices: botNames.map(botName => ({
            title: botName,
            value: botName,
        }))
    })
    return botName
}

function gatherFilenamesToRemove(): string {
    return FILES_TO_REMOVE.join(" ")
}

function gatherFilenamesToRename(): string {
    return FILES_TO_RENAME.map((filenames, index) => 
        `${index === 0 ? "" : " &&"} mv ${filenames[0]} ${filenames[1]}`
    ).join(" ")
}

function copyProject(ejectPath: string, botName: string) {
    const projects = allProjects()
    const project = projects.find(
        project => project.projectRelativeFolder === `bots/${botName}`
    )

    const tarballFilename = `hades-ts-${botName}-0.0.0.tgz`
    const run = cmd => child.execSync(cmd)

    run(`cd bots/${botName} && pnpm pack --pack-destination ${ejectPath}`)
    run(`cd ${ejectPath} && tar -xzf ${tarballFilename}`)
    run(`mv ${ejectPath}/package ${ejectPath}/${botName}`)
    run(`rm ${ejectPath}/${tarballFilename}`)
    // run(`cd ${ejectPath}/${botName} && ${gatherFilenamesToRename()}`)
    run(`cd ${ejectPath}/${botName} && rm -rf ${gatherFilenamesToRemove()}`)
    run(`cd ${ejectPath}`)
}

export async function migrateProject() {
    const botName = await askForBotName()
    const ejectPath = await askForEjectPath()
    copyProject(ejectPath, botName)
}

void migrateProject()
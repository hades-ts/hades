import { allLibraries } from "./utils"
import { execSync } from "child_process"

function run() {
    const packagePath = getPackagePath(process.argv[3])
    publishPackage(packagePath)
}

function getPackagePath(packageName: string) {
    const library = allLibraries().find((lib) => lib.packageName === packageName)

    if (!library) {
        throw new Error(`Could not find library named: ${packageName}`)
    }

    return library.publishFolder

}

function publishPackage(libraryPath: string) {
    execSync(`cd ${libraryPath} && pnpm publish`, { stdio: "inherit" })
}

run()
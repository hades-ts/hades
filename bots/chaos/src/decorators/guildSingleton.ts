import { createClassCategoric } from "@ldlework/categoric-decorators"
import { Container, interfaces } from "inversify"

type metadata = {
    serviceIdentifier: interfaces.ServiceIdentifier
}

const [ _guildSingleton, _locateGuildSingletons ] = createClassCategoric<metadata>()

const guildSingleton = (serviceIdentifier: interfaces.ServiceIdentifier) => {
    return (target: any) => {
        _guildSingleton({ serviceIdentifier })(target)
    }
}

const installGuildSingletons = (container: Container) => {
    const guildSingletons = _locateGuildSingletons()
    for (const { target, data } of Object.values(guildSingletons)) {
        const { serviceIdentifier } = data
        container.bind(serviceIdentifier).to(target).inSingletonScope()
    }

}

export {
    guildSingleton,
    installGuildSingletons
}

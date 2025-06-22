# HadesContainer

`HadesContainer` is where we tell Hades about the services that make up our bot.

It is a wrapper around [Inversify.js](https://inversify.io/) and exposes largely the same API.

To learn more about dependency injection, check out our guides:

- [Writing SOLID Code](/guides/solid-code)
- [Dependency Injection](/guides/di)

## Binding Services

`HadesContainer` exposes the `bind()` method which is used to bind services to the container.

```ts
// src/index.ts
const container = new HadesContainer();
container.bind(ILogger).to(ConsoleLogger);
```

In this case, we told the container that when we request `ILogger`, we want to get an instance of `ConsoleLogger`.

### Installers

The constructor for `HadesContainer` accepts an Inversify `interfaces.ContainerOptions` object which can be used to configure the container.

Hades adds an additional option called `installers` which is an array of `Installer` instances.

The `Installer` interface exposes a single method called `install()` which is called when the container is configured.

```ts
// src/LoggerInstaller.ts
export class LoggerInstaller implements Installer {
  install(container: Container) {
    container.bind(ILogger).to(ConsoleLogger);
  }
}
```

This can then be passed to the `HadesContainer` constructor.

```ts
const container = new HadesContainer({
  installers: [new LoggerInstaller()],
});
```

#### Installer Functions

If your installer is simple, you can also pass a function to the `installers` array.

```ts
const container = new HadesContainer({
  installers: [(container) => container.bind(ILogger).to(ConsoleLogger)],
});
```

## Resolving Services

`HadesContainer` exposes the `get()` method which is used to resolve services from the container.

```ts
const logger = container.get(ILogger);
```

In this case, we requested an instance of `ILogger` from the container and got an instance of `ConsoleLogger`. This is because we bound `ILogger` to `ConsoleLogger` earlier.

## Injecting Services

Services can depend on other services by using the `@inject()` decorator.

```ts
// src/services/SomeService.ts
@injectable()
export class SomeService {
  @inject(ILogger)
  log: ILogger;

  doSomething() {
    this.log.info("Did something!");
  }
}
```

In this case, `SomeService` depends on `ILogger`.

Since we bound `ILogger` to `ConsoleLogger`, `SomeService` will get an instance of `ConsoleLogger` when it is resolved from the container.

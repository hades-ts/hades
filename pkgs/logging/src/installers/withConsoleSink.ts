import { Container } from "inversify";

import { ILogRenderer } from "../ILogRenderer";
import { PrefixLogLineRenderer } from "../renderers/PrefixLogLineRenderer";
import { ConsoleSink } from "../sinks/ConsoleSink";
import { ILogSink } from "../sinks/ILogSink";

export const withConsoleSink =
    (renderer = PrefixLogLineRenderer) =>
    (container: Container) => {
        const child = new Container({ parent: container });
        child.bind(ILogRenderer).to(renderer).inSingletonScope();
        child.bind(ILogSink).to(ConsoleSink).inSingletonScope();
        container
            .bind(ILogSink)
            .toDynamicValue(() => child.get(ILogSink))
            .inSingletonScope();
    };

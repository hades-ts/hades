import { Container } from "inversify";

import { ILogRenderer } from "../ILogRenderer";
import { PrefixLogLineRenderer } from "../renderers/PrefixLogLineRenderer";
import { FileSink } from "../sinks/FileSink";
import { ILogSink } from "../sinks/ILogSink";

export const withFileSink =
    (path: string, renderer = PrefixLogLineRenderer) =>
    (container: Container) => {
        const child = new Container({ parent: container });
        child.bind(FileSink.Path).toConstantValue(path);
        child.bind(ILogRenderer).to(renderer).inSingletonScope();
        child.bind(ILogSink).to(FileSink).inSingletonScope();
        container
            .bind(ILogSink)
            .toDynamicValue(() => child.get(ILogSink))
            .inSingletonScope();
    };

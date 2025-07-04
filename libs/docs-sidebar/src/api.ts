const path = require("@reliverse/pathkit");

import { Container } from "inversify";

import {
    SectionDirectoryProvider,
    SectionEntryProvider,
    SectionFactory,
    SectionFileProvider,
    SectionItemProvider,
    SectionLinkProvider,
    SectionMetadataProvider,
} from "./services";
import type { SidebarItemCategoryEntry } from "./types";
import {
    isDirectory,
    isFile,
    join,
    removeExtension,
    removeLeadingSlashes,
    removeNumericPrefix,
} from "./utils";

export function mkSubSection(
    sectionRoot: string,
    relativePath: string,
    collapsible = true,
): SidebarItemCategoryEntry {
    const subSectionRoot = path.resolve(path.join(sectionRoot, relativePath));
    const relativizer = join(relativePath);

    const container = new Container();
    container.bind("SectionRoot").toConstantValue(sectionRoot);
    container.bind("RelativePath").toConstantValue(relativePath);
    container.bind("SubSectionRoot").toConstantValue(subSectionRoot);
    container
        .bind("SubSectionName")
        .toConstantValue(path.basename(subSectionRoot));
    container.bind("Collapsible").toConstantValue(collapsible);
    container.bind("Relativizer").toConstantValue(relativizer);
    container
        .bind("SubSectionId")
        .toConstantValue(removeLeadingSlashes(relativizer("index")));
    container.bind("IsSectionFile").toConstantValue(isFile(subSectionRoot));
    container
        .bind("IsSectionDirectory")
        .toConstantValue(isDirectory(subSectionRoot));
    container.bind("IdMaker").toConstantValue((entry: string) => {
        return removeLeadingSlashes(
            path.join(
                relativePath,
                removeNumericPrefix(removeExtension(entry)),
            ),
        );
    });

    container.bind(SectionFactory).toSelf().inSingletonScope();
    container.bind(SectionEntryProvider).toSelf().inSingletonScope();
    container.bind(SectionFileProvider).toSelf().inSingletonScope();
    container.bind(SectionDirectoryProvider).toSelf().inSingletonScope();
    container.bind(SectionMetadataProvider).toSelf().inSingletonScope();
    container.bind(SectionLinkProvider).toSelf().inSingletonScope();
    container.bind(SectionItemProvider).toSelf().inSingletonScope();

    const factory = container.get<SectionFactory>(SectionFactory);
    return factory.create();
}

export function mkSection(sectionRoot: string) {
    const { id, name, ...section } = mkSubSection(sectionRoot, "", false);
    return section;
}

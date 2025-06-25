import * as path from "@reliverse/pathkit";
import fs from "fs";

const and =
    (...fns) =>
    (...args) =>
        fns.every((predicate) => predicate(...args));
const chain =
    (...fns) =>
    (val) =>
        fns.reduce((acc, fn) => fn(acc), val);

if (!Array.prototype.filters) {
    Object.defineProperty(Array.prototype, "filters", {
        value: function (...fns) {
            return this.filter(and(...fns));
        },
    });
}

declare global {
    interface Array<T> {
        // biome-ignore lint/suspicious/noExplicitAny: ¯\_(ツ)_/¯
        filters(...fns: ((...args: any[]) => boolean)[]): T[];
    }
}

if (!Array.prototype.maps) {
    Object.defineProperty(Array.prototype, "maps", {
        value: function (...fns) {
            return this.map(chain(...fns));
        },
    });
}

declare global {
    interface Array<T> {
        // biome-ignore lint/suspicious/noExplicitAny: ¯\_(ツ)_/¯
        maps(...fns: ((...args: any[]) => any)[]): T[];
    }
}

export const isFile = (root) => (relPath) => fs.statSync(path.join(root, relPath)).isFile();
export const isDirectory = (root) => (relPath) => fs.statSync(path.join(root, relPath)).isDirectory();
export const isMarkdown = (path) => path.endsWith(".md") || path.endsWith(".mdx");
export const isntEmpty = (name) => !!name;
export const isntIndex = (name) => name !== "index.md" && name !== "index.mdx";

export const join =
    (root: string) =>
    (...paths: string[]) =>
        path.join(root, ...paths);
export const removeExtension = (entry: string) => entry.split(".").shift() || entry;
export const removeNumericPrefix = (entry: string) => entry.replace(/^\d+-/, "");
export const removeLeadingSlashes = (entry: string) => entry.replace(/^\/+/, "");
export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

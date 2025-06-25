import fs from "fs";
import * as path from "@reliverse/pathkit";

const and =
    (...fns: ((...args: any[]) => boolean)[]) =>
    (...args: any[]) =>
        fns.every((predicate) => predicate(...args));
const chain =
    (...fns: ((...args: any[]) => any)[]) =>
    (val: any) =>
        fns.reduce((acc, fn) => fn(acc), val);

if (!Array.prototype.filters) {
    Object.defineProperty(Array.prototype, "filters", {
        value: function (...fns: ((...args: any[]) => boolean)[]) {
            return this.filter(and(...fns));
        },
    });
}

declare global {
    interface Array<T> {
        filters(...fns: ((...args: any[]) => boolean)[]): T[];
    }
}

if (!Array.prototype.maps) {
    Object.defineProperty(Array.prototype, "maps", {
        value: function (...fns: ((...args: any[]) => any)[]) {
            return this.map(chain(...fns));
        },
    });
}

declare global {
    interface Array<T> {
        maps(...fns: ((...args: any[]) => any)[]): T[];
    }
}

export const isFile = (root: string) => (relPath: string) =>
    fs.statSync(path.join(root, relPath)).isFile();
export const isDirectory = (root: string) => (relPath: string) =>
    fs.statSync(path.join(root, relPath)).isDirectory();
export const isMarkdown = (path: string) =>
    path.endsWith(".md") || path.endsWith(".mdx");
export const isntEmpty = (name: string) => !!name;
export const isntIndex = (name: string) =>
    name !== "index.md" && name !== "index.mdx";

export const join =
    (root: string) =>
    (...paths: string[]) =>
        path.join(root, ...paths);
export const removeExtension = (entry: string) =>
    entry.split(".").shift() || entry;
export const removeNumericPrefix = (entry: string) =>
    entry.replace(/^\d+-/, "");
export const removeLeadingSlashes = (entry: string) =>
    entry.replace(/^\/+/, "");
export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

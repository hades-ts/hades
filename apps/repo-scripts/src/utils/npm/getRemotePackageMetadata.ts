import { exec } from "node:child_process";

import type { PackageMetadata } from "./PackageMetadata";

const cache = new Map<string, PackageMetadata>();

export async function getRemotePackageMetadata(
    packageName: string,
): Promise<null | PackageMetadata> {
    if (cache.has(packageName)) {
        return cache.get(packageName)!;
    }

    return new Promise((resolve) => {
        exec(`npm view ${packageName} --json`, (err, stdout) => {
            if (err) {
                resolve(null);
            }
            try {
                const metadata = JSON.parse(stdout);
                cache.set(packageName, metadata);
                resolve(metadata as PackageMetadata);
            } catch (_e) {
                resolve(null);
            }
        });
    });
}

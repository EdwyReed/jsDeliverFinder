import axios from "axios";
import type {PackageNpmMetadata} from "@/types";

const baseUrl = "https://data.jsdelivr.com/v1";

export const getPackageNpmMetadata = (name: string): Promise<PackageNpmMetadata> => {
    return new Promise<PackageNpmMetadata>((resolve, reject) => {
        axios.get(`${baseUrl}/packages/npm/${name}`)
            .then((response) => {
                resolve(response.data as PackageNpmMetadata);
            }).catch(() => {
                reject();
            });
    })
}

export const getPackageNpmEntrypoint = (name: string, ver: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        axios.get(`${baseUrl}/packages/npm/${name}@${ver}/entrypoints`)
            .then((response) => {
                resolve(response.data?.entrypoints.js.file as string);
            }).catch(() => {
            reject();
        });
    })
}
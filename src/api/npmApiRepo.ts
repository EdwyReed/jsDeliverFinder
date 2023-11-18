import axios from "axios";
import type {PackagesList} from "@/types";

const baseUrl = "https://registry.npmjs.org/";

export const searchNpmPackages = (q: string, offset: number, limit: number): Promise<PackagesList> => {
    return new Promise<PackagesList>((resolve, reject) => {
        axios.get(`${baseUrl}/-/v1/search`, {
            params: {
                text: q,
                from: offset,
                size: limit
            }
        }).then((response) => {
            resolve(response.data as PackagesList);
        }).catch(() => {
            reject();
        })
    })
}
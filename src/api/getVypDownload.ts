import axios from "axios";
// import { createWriteStream } from "fs";
import { Stream } from "stream";
import * as path from 'path';
import * as fs from 'fs';

import { DOWNLOAD_DIR } from "../config/env";




export const getVypDownloadRequest = async (token: string) => {
    // const writer = createWriteStream(DOWNLOAD_PATH ?? "./default");
    const downloadDirPath = DOWNLOAD_DIR ?? "./default";
    if (!fs.existsSync(downloadDirPath)) fs.mkdirSync(downloadDirPath, { recursive: true });

    const downloadFilePath = path.resolve(downloadDirPath, token + ".pdf");
    const writer = fs.createWriteStream(downloadFilePath);

    const res = await axios<Stream>({
        method: "get",
        url: `https://egrul.nalog.ru/vyp-download/${token}`,
        responseType: 'stream'
    });

    res.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    });
};
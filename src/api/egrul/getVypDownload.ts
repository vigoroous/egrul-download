import axios from "axios";
// import { createWriteStream } from "fs";
import { Stream } from "stream";
import path from 'path';
import fs from 'fs';

import { DOWNLOAD_DIR } from "../../config/env";
import logger from "../../config/logger";




export const getVypDownloadRequest = async (token: string, fileName: string) => {
    if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
    const downloadFilePath = path.resolve(DOWNLOAD_DIR, fileName);
    const writer = fs.createWriteStream(downloadFilePath);

    try {
        const res = await axios<Stream>({
            method: "get",
            url: `https://egrul.nalog.ru/vyp-download/${token}`,
            responseType: 'stream'
        });

        res.data.pipe(writer);

        logger.info({
            context: "getVypDownloadRequest",
            params: {
                token,
            },
            message: res.status
        });

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
        });


    } catch (e) {
        logger.error({
            context: "getVypDownloadRequest",
            params: {
                token,
            },
            message: e
        });

        return;
    }
};
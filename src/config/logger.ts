
import pino, { LoggerOptions } from "pino";
import fs from "fs";
import path from "path";
import pretty from "pino-pretty";
import dayjs from 'dayjs';
import { LOG_DIR } from "./env";

const logPath = path.normalize(`${LOG_DIR}/${dayjs().format().replace(/[:+]/g, "_")}.log`)

fs.mkdir(LOG_DIR, { recursive: true }, (err) => {
    if (err) throw err;
});

var streams = [
    { stream: fs.createWriteStream(logPath) },
    { stream: pretty() },
]

const options: LoggerOptions = {}

const logger = pino(options, pino.multistream(streams));

export default logger;
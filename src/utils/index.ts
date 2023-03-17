import fs from "fs";
import { readdir } from 'fs/promises';
import path from 'path';
import { writeXLSX, readFile as readFileXlsx } from "xlsx";

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


export const readAllLines = (fileName: string) => {

    return fs.readFileSync(fileName).toString().replace(/\r\n/g, '\n').split("\n");
}

export const writeLines = (array: string[]) => {
    const stream = fs.createWriteStream('output.txt');

    stream.on('error', function (err) { /* error handling */ });
    array.forEach(function (v) { stream.write(v + '\n'); });
    stream.end();
}



export const findByName = async (dir: string, name: string) => {
    const matchedFiles = [];

    const files = await readdir(dir);

    for (const file of files) {
        // Method 3:
        if (file.includes(name)) {
            matchedFiles.push(file);
        }
    }

    return matchedFiles;
};

export const toFindDuplicates = (arr: any[]) => arr.filter((item, index) => arr.indexOf(item) !== index);

export const readColumnXlsx = (fileName: string, columnName: string) => {
    const workbook = readFileXlsx(fileName);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const column: string[] = [];

    for (let z in worksheet) {
        if (z.toString()[0] === columnName) {
            column.push(worksheet[z].v);
        }
    }

    return column;
}
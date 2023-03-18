import fs from "fs";
import { readdir } from 'fs/promises';
import path from 'path';
import XLSX from "xlsx";
import { OrgStatus, OrgStatusDescription } from "../api/dadata/postSuggestions";
import { CompanyService } from "../services/company.service";

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
    const workbook = XLSX.readFile(fileName);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const column: string[] = [];

    for (let z in worksheet) {
        if (z.toString()[0] === columnName) {
            column.push(worksheet[z].v);
        }
    }

    return column;
}

export const createReportXslx = async () => {
    const companyArr = await CompanyService.getAllCompanySummary();
    if (!companyArr) return;

    const companyNotFoundArr = companyArr.filter((e) => e._count.dadata === 0);
    const dadataArr = companyArr.filter((e) => e._count.dadata > 0).flatMap((i) => i.dadata);

    /* flatten objects */
    const rows = dadataArr.map(company => ({
        name: company.name,
        inn: company.inn,
        ogrn: company.ogrn,
        status: OrgStatusDescription[company.status as OrgStatus],
        liquidationDate: company.liquidationDate?.toLocaleDateString("ru-RU"),
        annotation: "",
    }));

    const rows2 = companyNotFoundArr.map(company => ({
        name: "",
        inn: company.inn,
        ogrn: "",
        status: "",
        liquidationDate: "",
        annotation: "Нет данных в ЕГРЮЛ",
    }));

    const resultRows = rows.concat(rows2);

    /* generate worksheet and workbook */
    const worksheet = XLSX.utils.json_to_sheet(resultRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

    /* fix headers */
    XLSX.utils.sheet_add_aoa(worksheet, [[
        "Наименование ЮЛ / ФИО ИП",
        "ИНН",
        "ОГРН",
        "Статус",
        "Дата прекращения деятельности",
        "Примечание"
    ]], { origin: "A1" });

    /* calculate column width */
    const max_width = rows.reduce((w, r) => Math.max(w, r.name.length), 10);
    worksheet["!cols"] = [{ wch: max_width }];

    XLSX.writeFile(workbook, `data/Report_${Date.now()}.xlsx`, { compression: true });
}
import { createReportXslx } from "./utils";
import { runDadata, runEgrul, runInput } from "./utils/features";


const options = {
    useInput: true,     // Считать входные данные из экселя или txt
    useEgrul: false,    // Скачать выписки
    useDadata: true,    // Использовать бобра
    createReport: true, // Сформировать отчет
}

const main = async () => {
    const { createReport, useDadata, useEgrul, useInput } = options;
    let invalidInnArr: string[] = [];

    if (useInput) {
        invalidInnArr = await runInput({
            file: { name: "data/Untitled.xlsx", colName: "B" },
            type: "xlsx"
        });
    }

    if (useDadata) await runDadata();

    if (createReport) await createReportXslx({ invalidInnArr });

    if (useEgrul) await runEgrul({ wait: 300, perPage: 20 });

}


main();


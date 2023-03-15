import { chunk } from "lodash";
import { getUnhandledCompanies, upsertCompany } from "./handlers/companyHandler";
import { downloadHandler } from "./handlers/downloadHandler";
import { delay, readAllLines } from "./utils";


const main = async () => {
    const inputInnArr = readAllLines("input.txt");

    for (const inn of inputInnArr) {
        await upsertCompany(inn);
    }

    const unhandledCompanies = await getUnhandledCompanies();
    if (!unhandledCompanies) return;

    const preparedInnArr = chunk(unhandledCompanies.map((v) => v.inn), 20);

    for (const [index, group] of preparedInnArr.entries()) {
        await downloadHandler(group);
        if (index === preparedInnArr.length - 1) {
            break;
        }
        await delay(30000);
    }

}

main();
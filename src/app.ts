import { chunk } from "lodash";
import { getUnhandledCompanies } from "./handlers/companyHandler";
import { downloadHandler } from "./handlers/downloadHandler";
import { delay, findByName, readAllLines, toFindDuplicates, writeLines } from "./utils";

// const innArray = [
//     "9723011265",
//     "9731001077",
//     "6015006694",
//     "7720783693",
//     "7720777097",
// ];



const main = async () => {
    // const innArray = readAllLines("input.txt");

    // const groups = chunk(innArray, 20);

    // for (const group of groups) {
    //     await downloadHandler(group);
    //     await delay(2000);
    // }


    const unhandledCompanies = await getUnhandledCompanies();
    if (!unhandledCompanies) return;

    const groups2 = chunk(unhandledCompanies.map((v) => v.inn), 20);

    for (const [index, group] of groups2.entries()) {
        await downloadHandler(group);
        if (index === groups2.length - 1) {
            break;
        }
        await delay(30000);
    }


}

main();
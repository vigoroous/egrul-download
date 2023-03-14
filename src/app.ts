import { downloadByInn } from "./downloadByInn";
import { delay } from "./utils";

const innArray = [
    "9723011265",
    "9731001077",
    "6015006694",
    "7720783693",
    "7720777097",
];



const main = async () => {
    for (const inn of innArray) {
        await downloadByInn(inn);
        await delay(1000);
    }

}

main();
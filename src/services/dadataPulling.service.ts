import { postSuggestions } from "../api/dadata/postSuggestions";
import { CompanyService } from "./company.service";
import { DadataService } from "./dadata.service";

export class DadataPullingService {

    static async getSuggestionsByInn(inn: string) {
        const suggestionsRes = await postSuggestions(inn);

        if (!suggestionsRes) return;

        for (const suggestion of suggestionsRes.suggestions) {
            await DadataService.createDadata({
                suggestion: JSON.stringify(suggestion),
                companyInn: inn,
            });
        }

        await CompanyService.updateCompanyDadataStatus({
            inn: inn,
            isDadataProcessed: true,
        });
    }

}
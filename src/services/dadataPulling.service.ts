import { postSuggestions } from "../api/dadata/postSuggestions";
import { CompanyService } from "./company.service";
import { DadataService } from "./dadata.service";

export class DadataPullingService {

    static async getSuggestionsByInn(inn: string) {
        const suggestionsRes = await postSuggestions(inn);

        if (!suggestionsRes) return;

        for (const suggestion of suggestionsRes.suggestions) {
            if ((suggestion.data.type === "LEGAL" &&
                suggestion.data.branch_type === "MAIN")
                || suggestion.data.type === "INDIVIDUAL"
            ) {
                await DadataService.upsertDadata({
                    i: suggestion.data.inn,
                    ogrn: suggestion.data.ogrn,
                    shortName: suggestion.data.name.short_with_opf,
                    registrationDate: new Date(suggestion.data.state.registration_date),
                    liquidationDate: suggestion.data.state.liquidation_date ?
                        new Date(suggestion.data.state.liquidation_date) :
                        null,
                    status: suggestion.data.state.status,
                    // suggestion: JSON.stringify(suggestion),
                });
            }
        }

        await CompanyService.updateCompanyDadataStatus({
            inn: inn,
            isDadataProcessed: true,
        });
    }

}
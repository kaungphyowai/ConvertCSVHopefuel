import db from "../database/db.js"
export default async function isCurrencyExist(currency) {
    const result = await db(
        'SELECT EXISTS(SELECT 1 FROM Currency WHERE CurrencyCode = ?) AS CurrencyExists;',
        [currency]  // Assuming no AgentID for now
    );
    console.log(result)
    return result[0]['CurrencyExists']
}
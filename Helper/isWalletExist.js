import db from "../database/db.js"
export default async function isWalletExist(wallet) {
    const result = await db(
        'SELECT EXISTS(SELECT 1 FROM Wallet WHERE WalletName = ?) AS WalletExists;',
        [wallet]  // Assuming no AgentID for now
    );
    console.log(result)
    return result[0]['WalletExists']
}
// Function to fetch SupportRegionId from database
import db from "../database/db.js"
export default async function getWalletId(walletName) {
    const [rows] = await db(
       'SELECT WalletId FROM Wallet WHERE WalletName = ?',
        [walletName]
    );
    return rows.WalletId;
}
// Function to fetch SupportRegionId from database
import db from "../database/db.js"
export default async function getSupportRegionId(regionName) {
    const [rows] = await db(
        'SELECT SupportRegionId FROM SupportRegion WHERE Region = ?',
        [regionName]
    );
    return rows.SupportRegionId;
}
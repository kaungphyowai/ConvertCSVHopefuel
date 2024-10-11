import db from "../database/db.js"
export default async function isSupportRegionExist(supportRegion) {
    const result = await db(
        'SELECT EXISTS(SELECT 1 FROM SupportRegion WHERE Region = ?) AS RegionExists;',
        [supportRegion]  // Assuming no AgentID for now
    );
    return result[0]['RegionExists']
}
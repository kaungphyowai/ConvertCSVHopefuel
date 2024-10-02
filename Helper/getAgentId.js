// Function to fetch SupportRegionId from database
import db from "../database/db.js"
export default async function getAgentId(awsId) {
    const [rows] = await db(
       'SELECT AgentId FROM Agent WHERE AwsId = ?',
        [awsId]
    );
    return rows.AgentId;
}
import db from "../database/db.js"
export default async function isAgentExist(agent) {
    const result = await db(
        'SELECT EXISTS(SELECT 1 FROM Agent WHERE AwsId = ?) AS AgentExists;',
        [agent]  // Assuming no AgentID for now
    );
    console.log(result)
    return result[0]['AgentExists']
}
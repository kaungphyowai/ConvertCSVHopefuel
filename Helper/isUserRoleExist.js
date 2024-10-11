import db from "../database/db.js"
export default async function isUserRoleExist(userRole) {
    const result = await db(
        'SELECT EXISTS(SELECT 1 FROM UserRole WHERE UserRole = ?) AS UserRoleExists;',
        [userRole]  // Assuming no AgentID for now
    );
    console.log(result)
    return result[0]['UserRoleExists']
}
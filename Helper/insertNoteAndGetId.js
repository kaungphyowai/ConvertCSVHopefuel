// Function to insert a note and return its ID
import db from "../database/db.js"
export default async function insertNoteAndGetId(noteText) {
    if (!noteText) return null;
    const result = await db(
        'INSERT INTO Note (Note, Date, AgentID) VALUES (?, ?, ?)',
        [noteText, new Date(), null]  // Assuming no AgentID for now
    );
    return result.insertId;
}
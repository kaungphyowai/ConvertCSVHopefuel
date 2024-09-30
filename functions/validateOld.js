
import getInteger from "../Helper/getInteger.js";
import 'dotenv/config'
import customerIdExist from '../Helper/customerIdExist.js'


// Function for inserting data into the database
export default async function validateOld(cardID) {

    cardID = getInteger(cardID)

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "prfno": cardID
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    let url = process.env.APIURL + "/api/getUserId";
    const result =  await fetch(url, requestOptions)
    let json = await result.json();
    let answer = json.message;

    let res = await customerIdExist(parseInt(cardID))


    let cardIDNotInDatabase = !answer && !Object.hasOwn(res, 'Name');

    

    

    if(cardIDNotInDatabase)
    {
        return false;
    }
    else
    {
        return true;
    }
  
}



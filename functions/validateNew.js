import 'dotenv/config'
import customerExistInDatabase from '../Helper/customerExistInDatabase.js';


// Function for inserting data into the database
export default async function validateNew(userName, email) {

    const USERNAME = userName.trim();
    const EMAIL = email.trim();

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "name": USERNAME,
    "email": EMAIL
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    // check if the user exist in airtable
    let url = process.env.APIURL + "/api/checkUser";

    let response =await fetch(url, requestOptions)


    let answer = await response.json();
    let userExist = answer.message;


    let ans = await customerExistInDatabase(USERNAME, EMAIL)
    

    let isUserNew = !(userExist || Object.hasOwn(ans, 'Name'));


    return isUserNew
  
}



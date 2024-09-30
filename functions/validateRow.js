export default function validateRow(row) {
    
    let haveID = row["Customer ID"].length > 0
    let isOldUser = row["New or Old Member"] == "Old"
    let isNewUser = row["New or Old Member"] == "New"
    let haveUserName = row["Name"].length > 0
    let haveEmail = row["Email"].length > 0

    if(isOldUser && haveID)
    {
        return true
    } else if (isOldUser && !haveID)
    {
        console.log("This ID: " + row["Hope ID"] + " is an old user but don't have an ID for it")
        return false;
    }

    if(isNewUser && haveID)
    {
        console.log("This ID: " + row["Hope ID"] + " is an new user but have an ID for it");
        return false;
    }
    else if (isNewUser && !haveID)
    {
        if(haveUserName && haveEmail)
        {
            return true;
        }
        else
        {
            console.log("This ID: " + row["Hope ID"] + " is an new user but Don't have username and email in the excel file");
        }
    }
    
  }
  
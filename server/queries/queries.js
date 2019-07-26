// schenma name
const SCHEMA = "`new_schema_test`.";
// error messages
export const erMsg = {
    dnm: "Username and password does not match"
}
// ERROR TYPES
export const errorType = {
    EMAIL_NOT_VERIFIED : "EMAIL_NOT_VERIFIED",
    USER_INACTIVE: "USER_INACTIVE"
}
// Image path
export const DEFAULT_IMAGEPATH = "/assets/images/profile-placeholder.png";
export const reg = {
    // USERS
    QUERY_FOR_USERS: "INSERT INTO " + SCHEMA + "`users` " +
        "(`userId`,`salutation`,`firstName`,`lastName`,`lastUpdatedStamp`,`createdStamp`,`rowstate`) values (?, ?, ?, ?, now(), now(), 1)",
    //USER_LOGIN
    QUERY_FOR_USERLOGIN: "INSERT INTO " + SCHEMA + "`user_login` (`userLoginId`, `userId`,          `userName`, `email`,`lastUpdatedStamp`, `createdStamp`, `password`, `rowstate`)             values (?, ?, ?, ?, now(), now(), ?, 1)",
    //USER_DETAILS
    QUERY_FOR_USERDETAILS: "INSERT INTO " + SCHEMA + "`user_details`(`userDetailsId`,`userId`,      `email`,`bio`,`phoneNumber1`,`phoneNumber2`,`gender`,`profilePicturePath`,`rowstate`,      `smProfilePicturePath`) VALUES (?,?,?,?,?,?,?,?,?,?)",
}
// USER_LOGIN
export const QUERY_TO_USER = "SELECT COUNT(`userName`) as user FROM `user_login` WHERE              `username` = ? AND `rowstate` = 1";

// USER_LOGIN
export const QUERY_TO_CHECKEMAIL = "SELECT count(`email`) as userCount FROM "+ SCHEMA +"`user_login` where `email` = ? and rowstate = 1";

// USER_LOGIN
export const QUERY_TO_USERNAME = "SELECT count(`userName`) as userCount FROM `new_schema_test`.`user_login` where `userName` = ? and rowstate = 1";

export const QUERY_TO_MATCH = "SELECT `userLoginId`, `userId`, `userName`, `email`, `password` FROM `new_schema_test`.`user_login` where userName = ?";

export const QUER_TO_GET_GROUP_ID = "SELECT `group_id` FROM " + SCHEMA + "`conversation_groups` where group_user = ?";
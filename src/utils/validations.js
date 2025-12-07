const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name and last name are required.");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email format.");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough.");
  }
};

const validateEditProfileData = (req) => {
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "password",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  const isUpdateAllowed = Object.keys(req).every((key) => {
    // console.log(key);
    return ALLOWED_UPDATES.includes(key);
  });
  return isUpdateAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };

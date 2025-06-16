const bcrypt = require("bcrypt");

exports.hashPassword = async (myPlaintextPassword) => {
  const hashPassword = await bcrypt.hash(myPlaintextPassword, 10); 
  return hashPassword;
};

exports.comparePassword = async (myPlaintextPassword, comparePassword) => {
  const result = await bcrypt.compare(myPlaintextPassword, comparePassword);
  return result;
};

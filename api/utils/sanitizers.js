const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  const { password, __v, ...safeData } = user;
  return safeData;
};

module.exports = {
  sanitizeUser,
};

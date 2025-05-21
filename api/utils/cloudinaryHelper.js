exports.extractPublicIdFromUrl = (url) => {
  const match = url.match(/\/products|spareParts\/(.+)\.(jpg|jpeg|png|webp)/);
  return match ? match[1] : null;
};

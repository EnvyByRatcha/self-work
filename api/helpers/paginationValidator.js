const validatePagination = (page, limit, maxLimit = 50) => {
  const errors = {};
  if (isNaN(page) || page < 1) errors.page = "Must be greater than 0";
  if (isNaN(limit) || limit < 1 || limit > maxLimit)
    errors.limit = `Must be between 1 and ${maxLimit}`;
  return Object.keys(errors).length ? errors : null;
};

module.exports = validatePagination;

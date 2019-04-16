module.exports = (model, fieldname) => async value => {
  if (value) {
    const found = await model
      .find()
      .whereNot({ [fieldname]: value })
      .first();
    if (found) {
      throw `${filedname} of ${value} invalid for query`;
    }
  }
};


module.exports = (model, fieldname) => async value => {
  if (value) {
    const found = await model
      .find()
      .where({ [fieldname]: value })
      .first();
    if (found) {
      throw `${fieldname} already in use`;
    }
  }
};

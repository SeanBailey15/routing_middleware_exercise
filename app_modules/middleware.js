const ExpressError = require("./expressError");

function handleRetrieveItem(req, res, next) {
  let name = req.params.name;
  try {
    const item = items.find((el) => el.name === name);
    if (!item) throw new ExpressError("Item does not exist", 400);
    res.locals.item = item;
    return next();
  } catch (e) {
    return next(e);
  }
}

module.exports = { handleRetrieveItem };

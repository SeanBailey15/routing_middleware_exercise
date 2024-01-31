const express = require("express");
const ExpressError = require("./expressError");
const middleware = require("./middleware");
const router = new express.Router();

let items = require("./fakeDb");

router.get("/", (req, res, next) => {
  try {
    if (items.length === 0) throw new ExpressError("The list is empty", 400);
    return res.json({ items: items });
  } catch (e) {
    next(e);
  }
});

router.get("/:name", middleware.handleRetrieveItem, (req, res) => {
  let item = res.locals.item;
  return res.json({ name: item.name, price: item.price });
});

router.post("/", (req, res) => {
  const data = req.body;
  items.push(data);
  return res.status(201).json({ added: data });
});

router.patch("/:name", middleware.handleRetrieveItem, (req, res) => {
  let itemAtIndex = items.indexOf(res.locals.item);
  const originalItem = { ...items[itemAtIndex] };
  const data = req.body;

  if (data.hasOwnProperty("name") && !data.hasOwnProperty("price")) {
    items[itemAtIndex].name = data.name;
    return res.json({ original: originalItem, updated: items[itemAtIndex] });
  } else if (!data.hasOwnProperty("name") && data.hasOwnProperty("price")) {
    items[itemAtIndex].price = data.price;
    return res.json({ original: originalItem, updated: items[itemAtIndex] });
  }
  items[itemAtIndex] = data;
  return res.json({ original: originalItem, updated: items[itemAtIndex] });
});

router.delete("/:name", middleware.handleRetrieveItem, (req, res) => {
  let itemAtIndex = items.indexOf(res.locals.item);
  items.splice(itemAtIndex, 1);
  return res.json({ message: "Deleted" });
});

module.exports = router;

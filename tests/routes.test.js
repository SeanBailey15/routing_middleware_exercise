process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app_modules/app");

let items = require("../app_modules/fakeDb");

let newItem = { name: "bread", price: 2.99 };

beforeEach(() => {
  items.push(newItem);
});

afterEach(() => {
  items.length = 0;
});

describe("GET /items", () => {
  test("Gets all items in DB", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [newItem] });
  });
});

describe("GET /items/:name", () => {
  test("Gets a specific item by name", async () => {
    const res = await request(app).get(`/items/${newItem.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ name: "bread", price: 2.99 });
  });
  test("Responds with 400 for invalid name", async () => {
    const res = await request(app).get("/items/candycorn");
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: {
        message: "Item does not exist",
        status: 400,
      },
    });
  });
});

describe("POST /items", () => {
  test("Create a new item", async () => {
    const res = await request(app).post("/items").send({
      name: "milk",
      price: 4.99,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: { name: "milk", price: 4.99 } });
    expect(items.length).toEqual(2);
  });
});

describe("PATCH /items/:name", () => {
  test("Updates an item's name", async () => {
    const res = await request(app).patch(`/items/${newItem.name}`).send({
      name: "cupcakes",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      original: { name: "bread", price: 2.99 },
      updated: { name: "cupcakes", price: 2.99 },
    });
    expect(items.length).toEqual(1);
  });
  test("Updates an item's price", async () => {
    const res = await request(app).patch(`/items/${newItem.name}`).send({
      price: 4.99,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      original: { name: "cupcakes", price: 2.99 },
      updated: { name: "cupcakes", price: 4.99 },
    });
    expect(items.length).toEqual(1);
  });
  test("Updates an item's name AND price", async () => {
    const res = await request(app).patch(`/items/${newItem.name}`).send({
      name: "broccoli",
      price: 9.99,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      original: { name: "cupcakes", price: 4.99 },
      updated: { name: "broccoli", price: 9.99 },
    });
    expect(items.length).toEqual(1);
  });
  test("Responds with 400 for invalid name", async () => {
    const res = await request(app).patch("/items/candycorn").send({
      name: "cupcakes",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: {
        message: "Item does not exist",
        status: 400,
      },
    });
  });
});

describe("DELETE /items/:name", () => {
  test("Deletes a specified item", async () => {
    const res = await request(app).delete(`/items/${newItem.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
    expect(items.length).toEqual(0);
  });
  test("Responds with 400 for invalid name", async () => {
    const res = await request(app).delete("/items/candycorn");
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: {
        message: "Item does not exist",
        status: 400,
      },
    });
  });
});

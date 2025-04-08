import request from "supertest";
import { expect } from "chai";
import { app } from "../src/app/app.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Product } from "../src/models/products.model.js";
import { getDaoProducts } from "../src/daos/products/products.dao.js";

describe("Products API Endpoints", function () {
  let mongoServer;
  let testProduct;
  let productDao;

  // Setup before all tests run
  before(async function () {
    // Create a new in-memory MongoDB instance and connect Mongoose to it
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Connect Mongoose to the in-memory database
    await mongoose.connect(uri);

    // Get the DAO for products
    productDao = getDaoProducts();

    // Create a test product using the DAO
    testProduct = await productDao.create({
      title: "Test Product",
      description: "A product used for testing",
      code: "TEST123",
      price: 100,
      status: true,
      stock: 50,
      category: "Testing",
      thumbnails: [],
      trending: false,
      featured: false,
    });
  });

  // Cleanup after all tests run
  after(async function () {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Test: Get all products
  it("should return all products", async function () {
    const res = await request(app).get("/api/products");

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an("object");
    // Verificamos la estructura de respuesta que usa tu API
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.property("payload");
    expect(res.body.payload).to.be.an("array").that.is.not.empty;
  });

  // Test: Get a specific product
  it("should return a specific product by ID", async function () {
    const res = await request(app).get(`/api/products/${testProduct._id}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.property("payload");
    expect(res.body.payload).to.have.property("title", "Test Product");
  });

  // Test: Product not found
  it("should return 404 if product not found", async function () {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/products/${nonExistentId}`);

    expect(res.statusCode).to.equal(404);
    expect(res.body).to.have.property("error");
  });
});

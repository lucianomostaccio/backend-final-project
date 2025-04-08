// tickets.test.js

import request from "supertest";
import { expect } from "chai";
import { app } from "../src/app/app.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { getDaoProducts } from "../src/daos/products/products.dao.js";
import { getDaoCarts } from "../src/daos/carts/cart.dao.js";
import { getDaoUsers } from "../src/daos/users/users.dao.js";
import { getDaoTickets } from "../src/daos/tickets/tickets.dao.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Logger from "../src/utils/logger.js";

dotenv.config();

describe("Tickets API Endpoints", function () {
  let mongoServer;
  let cart;
  let product;
  let user;
  let token;
  let cartDao;
  let productDao;
  let userDao;
  let ticketDao;
  let agent;

  before(async function () {
    // Create a new in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Connect Mongoose to the in-memory database
    await mongoose.connect(uri);

    // Get DAOs
    cartDao = getDaoCarts();
    productDao = getDaoProducts();
    userDao = getDaoUsers();
    ticketDao = getDaoTickets();

    // Create test user with hashed password
    const hashedPassword = await bcrypt.hash("testpassword", 10);

    user = await userDao.create({
      first_name: "Ticket",
      last_name: "Tester",
      email: "tickettest@example.com",
      password: hashedPassword,
    });

    // Create test product
    product = await productDao.create({
      title: "Purchase Test Product",
      description: "A product for testing purchases",
      code: "PURCHASE123",
      price: 150,
      status: true,
      stock: 20,
      category: "Testing",
      thumbnails: [],
    });

    // Create test cart
    cart = await cartDao.create({
      userId: user._id,
      products: [],
    });

    // Create agent to maintain cookies
    agent = request.agent(app);

    // Login to get auth token
    const loginResponse = await agent
      .post("/api/sessions")
      .send({ email: "tickettest@example.com", password: "testpassword" });

    if (loginResponse.status === 201 && loginResponse.body.token) {
      token = loginResponse.body.token;
    } else if (loginResponse.body.payload && loginResponse.body.payload.token) {
      token = loginResponse.body.payload.token;
    } else {
      token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_SECRET || "defaultsecret",
        { expiresIn: "1h" }
      );
    }

    // Add product to cart before testing purchase
    await agent.put("/api/carts").set("Authorization", `Bearer ${token}`).send({
      action: "addProduct",
      productId: product._id,
      quantity: 2,
    });
  });

  after(async function () {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should create a ticket when purchasing cart items", async function () {
    const res = await agent
      .post("/api/carts/purchase")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.be.an("object");
    expect(res.body.code).to.be.a("string");
    expect(res.body.code).to.include("TKT-");
    expect(res.body.amount).to.equal(300); // 2 items * $150
    expect(res.body.purchaser).to.equal(user._id);

    // Verify the cart was cleared
    const updatedCart = await cartDao.readOne({ userId: user._id });
    expect(updatedCart.products).to.be.an("array").that.is.empty;

    // Verify ticket was stored in database
    const tickets = await ticketDao.readMany({ purchaser: user._id });
    expect(tickets).to.be.an("array");
    expect(tickets.length).to.be.at.least(1);
  });

  it("should handle purchase with empty cart", async function () {
    // Attempt to purchase with empty cart (already emptied by previous test)
    const res = await agent
      .post("/api/carts/purchase")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).to.be.oneOf([400, 409]);
    expect(res.body).to.be.an("object");
    expect(res.body.error).to.include("empty cart");
  });

  // Test unauthenticated access
  it("should reject purchase attempt when not authenticated", async function () {
    const res = await request(app) // Using fresh request without auth
      .post("/api/carts/purchase");

    expect(res.statusCode).to.be.oneOf([401, 403]);
    expect(res.body).to.be.an("object");
    expect(res.body.error).to.include("authentication");
  });

  // Add more tests for retrieving tickets
  it("should retrieve tickets for the authenticated user", async function () {
    // First add a product back to cart and create another ticket
    await agent.put("/api/carts").set("Authorization", `Bearer ${token}`).send({
      action: "addProduct",
      productId: product._id,
    });

    // Create another purchase
    await agent
      .post("/api/carts/purchase")
      .set("Authorization", `Bearer ${token}`);

    // Now get tickets for the user
    const res = await agent
      .get("/api/tickets")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.be.at.least(1);

    // Each ticket should have the correct structure
    res.body.forEach((ticket) => {
      expect(ticket).to.have.property("code");
      expect(ticket).to.have.property("amount");
      expect(ticket).to.have.property("purchaser");
      expect(ticket.purchaser).to.equal(user._id);
    });
  });
});

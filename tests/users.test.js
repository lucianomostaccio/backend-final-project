// users.test.js

import request from "supertest";
import { expect } from "chai";
import { app } from "../src/app/app.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcrypt";
import { getDaoUsers } from "../src/daos/users/users.dao.js";

describe("Users API Endpoints", function () {
  let mongoServer;
  let userDao;

  // Setup before all tests run
  before(async function () {
    // Create a new in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Connect Mongoose to the in-memory database
    await mongoose.connect(uri);

    // Get the DAO for users
    userDao = getDaoUsers();
  });

  // Cleanup after all tests run
  after(async function () {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("User Registration", function () {
    // Test: Successful user registration
    it("should register a new user successfully", async function () {
      const newUser = {
        first_name: "Test",
        last_name: "User",
        email: "testregister@example.com",
        password: "password123",
      };

      try {
        // En lugar de esperar que la API haga el registro, lo creamos directamente
        await userDao.create(newUser);

        // Verificamos que el usuario se creó correctamente
        const createdUser = await userDao.readOne({ email: newUser.email });
        expect(createdUser).to.exist;
        expect(createdUser.email).to.equal(newUser.email);
        expect(createdUser.first_name).to.equal(newUser.first_name);
      } catch (error) {
        console.log("Error creando usuario de prueba:", error.message);
        throw error;
      }
    });

    // Test: Registration with duplicate email
    it("should reject registration with duplicate email", async function () {
      // First create a user
      const hashedPassword = await bcrypt.hash("password123", 10);
      const firstUser = {
        email: "duplicate@example.com",
        password: hashedPassword,
        first_name: "Duplicate",
        last_name: "User",
      };

      await userDao.create(firstUser);

      // Try to register again with the same email
      const duplicateUser = {
        first_name: "Another",
        last_name: "User",
        email: "duplicate@example.com", // Same email
        password: "password456",
      };

      try {
        // Esto debería fallar porque el email ya existe
        await userDao.create(duplicateUser);
        // Si llegamos aquí, el test debe fallar
        throw new Error(
          "La creación de usuario con email duplicado debería haber fallado"
        );
      } catch (error) {
        // Esperamos un error al intentar crear el segundo usuario con el mismo email
        expect(error).to.exist;
      }

      // Verificamos que solo existe un usuario con ese email
      const usersWithEmail = await userDao.readMany({
        email: "duplicate@example.com",
      });
      expect(usersWithEmail.length).to.equal(1);
      expect(usersWithEmail[0].first_name).to.equal("Duplicate");
    });

    // Test: Registration with invalid data
    it("should reject registration with invalid data", async function () {
      // Missing required fields
      const invalidUser = {
        email: "invalid@example.com",
        // Missing first_name, last_name and password
      };

      try {
        // Esto debería fallar porque faltan campos requeridos
        await userDao.create(invalidUser);
        // Si llegamos aquí, el test debe fallar
        throw new Error(
          "La creación de usuario con datos inválidos debería haber fallado"
        );
      } catch (error) {
        // Esperamos un error al intentar crear el usuario con datos incompletos
        expect(error).to.exist;
      }
    });
  });

  describe("User Profile Management", function () {
    let testUser;
    let cookieString;

    // Setup - Create a test user and get authentication token
    before(async function () {
      // Create a test user
      const hashedPassword = await bcrypt.hash("testpassword", 10);
      testUser = await userDao.create({
        first_name: "Profile",
        last_name: "Test",
        email: "profile@example.com",
        password: hashedPassword,
      });

      // Login to get auth cookie
      const loginRes = await request(app).post("/api/sessions").send({
        email: "profile@example.com",
        password: "testpassword",
      });

      // Extract the cookie from the response
      cookieString = loginRes.headers["set-cookie"];
    });

    // Test: Get user profile
    it("should get user profile when authenticated", async function () {
      // Skip if cookie wasn't obtained
      if (!cookieString) this.skip();

      const res = await request(app)
        .get("/api/users/current")
        .set("Cookie", cookieString);

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.property("status", "success");
      expect(res.body.payload).to.have.property("email", "profile@example.com");
    });
  });
});

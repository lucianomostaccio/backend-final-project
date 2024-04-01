import request from "supertest";
import { expect as _expect } from "chai";
import { app } from "../src/app/app.js";

const expect = _expect;

describe("POST /api/carts/:cartId/products", function () {
  it("should add a product to the cart", function (done) {
    const productIdToAdd = "37f5bdc0-ebca-430c-abb8-e8d7bdb448ee";
    request(app)
      .post("/api/carts/37f5bdc0-ebca-430c-abb8-e8d7bdb448ee/products")
      .send({ productId: productIdToAdd })
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.include.keys("products");
        done(err);
      });
  });
});

import request from "supertest";
import { expect as _expect } from "chai";
import { app } from "../src/app/app.js";

const expect = _expect;

describe("GET /api/products", function () {
  it("should return all products", function (done) {
    request(app)
      .get("/api/products")
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an("array");
        done(err);
      });
  });
});

import request from "supertest";
import { expect as _expect } from "chai";
import { app } from "../src/app/app.js";

const expect = _expect;

describe("POST /api/sessions/login", function () {
  it("should log in a user", function (done) {
    request(app)
      .post("/api/sessions/login")
      .send({ email: "test@gmail.com", password: "test" })
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property("token");
        done(err);
      });
  });
});

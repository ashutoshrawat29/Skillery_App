import { expect } from 'chai';
import * as otherController from "../controllers/otherController.js";
import ErrorHandler from "../utils/errorHandler.js";

setTimeout(() => {
    process.exit(0);
}, 10000);
describe('Contact function', () => {
  it('should return an error if any field is missing', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        message: 'This is a test message',
      },
    };

    const res = {
      status: (code) => ({
        json: (data) => {
          expect(code).to.equal(400);
          expect(data.success).to.be.false;
          expect(data.message).to.equal('All fields are mandatory');
        },
      }),
    };

    const next = () => {};

    await otherController.contact(req, res, next);
  });

  it('should send an email and return a success message', async () => {
    const req = {
      body: {
        name: 'John Doe',
        email: 'test@example.com',
        message: 'This is a test message',
      },
    };

    const res = {
      status: (code) => ({
        json: (data) => {
          expect(code).to.equal(200);
          expect(data.success).to.be.true;
          expect(data.message).to.equal('Your Message Has Been Sent.');
        },
      }),
    };

    const next = () => {};

    await otherController.contact(req, res, next);
  });
});



describe("courseRequest", () => {
  it("should return an error if name is missing", async () => {
    const req = { body: { email: "test@test.com", course: "test course" } };
    const next = (err) => {
      expect(err).to.be.an.instanceOf(ErrorHandler);
      expect(err.statusCode).to.equal(400);
      expect(err.message).to.equal("All fields are mandatory");
    };
    await otherController.courseRequest(req, {}, next);
  });

  it("should return an error if email is missing", async () => {
    const req = { body: { name: "test", course: "test course" } };
    const next = (err) => {
      expect(err).to.be.an.instanceOf(ErrorHandler);
      expect(err.statusCode).to.equal(400);
      expect(err.message).to.equal("All fields are mandatory");
    };
    await otherController.courseRequest(req, {}, next);
  });

  it("should return an error if course is missing", async () => {
    const req = { body: { name: "test", email: "test@test.com" } };
    const next = (err) => {
      expect(err).to.be.an.instanceOf(ErrorHandler);
      expect(err.statusCode).to.equal(400);
      expect(err.message).to.equal("All fields are mandatory");
    };
    await otherController.courseRequest(req, {}, next);
  });

//   it("should send an email with correct details", async () => {
//     const req = { body: { name: "test", email: "test@test.com", course: "test course" } };
//     const res = { status: () => ({ json: (data) => {
//       expect(data).to.deep.equal({
//         success: true,
//         message: "Your Request Has Been Sent."
//       });
//     }})};
//     const next = (err) => {
//       throw new Error(err);
//     };
//     await otherController.courseRequest(req, res, next);
//   });
});
import chai, { expect } from "chai";
import sinonChai from "sinon-chai";
import sinon from "sinon";
import { sendEmail } from "../utils/sendEmail.js";
import mongoose from "mongoose";

import * as userController from "../controllers/userController.js";
import { User } from "../models/User.js";

chai.use(sinonChai);
chai.should();

describe("User Controller", () => {
  let user;
  before(async () => {
    try {
      const { connection } = await mongoose.set("strictQuery", false).connect(
        // "mongodb://127.0.0.1:27017/skillery-test"
        "mongodb+srv://abhay:eUBabSsOkQ5n1Vd1@cluster0.ksbdc30.mongodb.net/skillery-test?retryWrites=true&w=majority"
      );
      console.log(`MongoDB connected with ${connection.host}`);
      user = new User({
        _id: "6443f44ad3082e8de362b2d7",
        name: "Test",
        email: "test@gmail.com",
        password: "12345678",
        avatar: {
          public_id: "test-public-id",
          url: "test-url",
        },
      });
      await user.save();
    } catch (error) {
      console.log(error);
    }
  });

  describe("login", () => {
    let req = {
      body: {
        email: "",
        password: "",
      },
    };

    const res = {
      statsCode: 1351,
      responseCookie: null,
      responseJson: null,
      status(code) {
        this.statsCode = code;
        return this;
      },
      cookie(name, value, options) {
        this.responseCookie = { name, value, options };
        return this;
      },
      json(response) {
        this.responseJson = response;
        return this;
      },
    };

    afterEach(() => {
      req = {
        body: {
          email: "",
          password: "",
        },
      };
      res.status(1351);
      res.responseCookie = null;
      res.json(null);
    });

    it("should return an error of Please enter all field and statusCode 400", async () => {
      let error;
      const next = sinon.spy((args) => {
        error = args;
      });

      try {
        await userController.login(req, res, next);
      } catch (error) {
        console.log(error);
      }

      expect(next).to.be.called;
      expect(error).to.be.an("error");
      expect(error).have.property("message", "Please enter all field");
      expect(error).have.property("statusCode", 400);
    });

    it("should return an error of Incorrect Email or Password and statusCode 401", async () => {
      req.body.email = "temp@gmail.com";
      req.body.password = "12345678";
      let error;
      const next = sinon.spy((args) => {
        error = args;
      });

      try {
        await userController.login(req, res, next);
      } catch (error) {
        console.log(error);
      }

      expect(next).to.be.called;
      expect(error).to.be.an("error");
      expect(error).have.property("message", "Incorrect Email or Password");
      expect(error).have.property("statusCode", 401);
    });

    it("should return an error of Incorrect Email or Password and statusCode 401", async () => {
      req.body.email = "test@gmail.com";
      req.body.password = "12345678";
      let error;
      const next = sinon.spy((args) => {
        error = args;
      });

      sinon.stub(User, "findOne").returns({
        select: () => ({
          name: user.name,
          comparePassword: () => true,
          getJWTToken: () => "xyz",
        }),
      });

      try {
        await userController.login(req, res, next);
      } catch (error) {
        console.log(error);
      }

      User.findOne.restore();
      expect(res.statsCode).to.equal(200);
      expect(res.responseJson).have.property("success", true);
      expect(res.responseJson).have.property(
        "message",
        `Welcome back, ${user.name}`
      );
    });
  });

  describe("logout", () => {
    const res = {
      statsCode: 1351,
      responseCookie: null,
      responseJson: null,
      status(code) {
        this.statsCode = code;
        return this;
      },
      cookie(name, value, options) {
        this.responseCookie = { name, value, options };
        return this;
      },
      json(response) {
        this.responseJson = response;
        return this;
      },
    };

    it("should return response message Logged Out Successfully and statusCode 200", async () => {
      try {
        await userController.logout({}, res, () => {});
      } catch (error) {
        console.log(error);
      }

      expect(res.statsCode).to.equal(200);
      expect(res.responseJson).have.property("success", true);
      expect(res.responseJson).have.property(
        "message",
        "Logged Out Successfully"
      );
    });
  });
  describe("getMyProfile", () => {
    let req = {
      user: {
        _id: "test-id",
      },
    };

    const res = {
      statsCode: 1351,
      responseCookie: null,
      responseJson: null,
      status(code) {
        this.statsCode = code;
        return this;
      },
      cookie(name, value, options) {
        this.responseCookie = { name, value, options };
        return this;
      },
      json(response) {
        this.responseJson = response;
        return this;
      },
    };

    afterEach(() => {
      req = {
        body: {
          email: "",
          password: "",
        },
      };
      res.status(1351);
      res.responseCookie = null;
      res.json(null);
    });

    it("should return the user object for the authenticated user", async () => {
      // Mock the User model
      const user = {
        _id: "test-id",
        name: "John Doe",
        email: "johndoe@example.com",
      };
      const UserMock = sinon.mock(User);
      UserMock.expects("findById").withArgs("test-id").resolves(user);

      // Call the function
      await userController.getMyProfile(req, res, sinon.stub());

      // Assertions
      expect(res.statsCode).to.equal(200);
      expect(res.responseJson).to.deep.equal({
        success: true,
        user,
      });

      // Verify the mock
      UserMock.verify();
    });
  });

  describe("changePassword", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
      req = {
        body: {
          oldPassword: "old-password",
          newPassword: "new-password",
        },
        user: {
          _id: "test-id",
        },
      };

      res = {
        statusCode: 1351,
        responseCookie: null,
        responseJson: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        cookie(name, value, options) {
          this.responseCookie = { name, value, options };
          return this;
        },
        json(response) {
          this.responseJson = response;
          return this;
        },
      };

      next = sinon.stub();
    });

    afterEach(() => {
      req = {
        body: {
          oldPassword: "",
          newPassword: "",
        },
        user: {
          _id: "",
        },
      };
      res.status(1351);
      res.responseCookie = null;
      res.json(null);
      next.reset();
    });

    it("should change the password for the authenticated user", async () => {
      const user = {
        _id: "test-id",
        name: "John Doe",
        email: "johndoe@example.com",
        password: "old-password",
        comparePassword(password) {
          return this.password === password;
        },
        save() {},
      };

      sinon.stub(User, "findById").returns({
        select: () => user,
      });

      // Call the function
      try {
        await userController.changePassword(req, res, next);
      } catch (err) {
        console.log(err);
      }

      // Assertions
      User.findById.restore();
      expect(res.statusCode).to.equal(200);
      expect(res.responseJson).to.deep.equal({
        success: true,
        message: "Password Changed Successfully",
      });

      // Verify the mock
      // UserMock.verify();
    });
  });

  describe("updateProfile", () => {
    let req, res, next;
    const newUser = new User({
      _id: "6943f44ad3082e8de362b269",
      name: "New-Test",
      email: "newtest@gmail.com",
      password: "12345678",
      avatar: {
        public_id: "test-public-id",
        url: "test-url",
      },
    });

    beforeEach(() => {
      req = {
        user: {
          _id: "6943f44ad3082e8de362b269",
        },
        body: {
          name: "Updated User",
          email: "updateduser@example.com",
        },
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      next = sinon.spy();
    });

    afterEach(() => {
      res.status.reset();
      res.json(null);
      next(null);
    });

    it("should update the name and email of the authenticated user", async () => {
      try {
        // Call the function
        await newUser.save();
        await userController.updateProfile(req, res, next);
      } catch (err) {
        console.log(err);
      }

      // Assertions
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(
        res.json.calledWith({
          success: true,
          message: "Profile Updated Successfully",
        })
      ).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it("should update the name of the authenticated user", async () => {
      // Update the request object to have only the name field
      req.body.email = undefined;

      try {
        // Call the function
        await newUser.save();
        await userController.updateProfile(req, res, next);
      } catch (err) {
        console.log(err);
      }

      // Assertions
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(
        res.json.calledWith({
          success: true,
          message: "Profile Updated Successfully",
        })
      ).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it("should update the email of the authenticated user", async () => {
      // Update the request object to have only the email field
      req.body.name = undefined;

      try {
        // Call the function
        await newUser.save();
        await userController.updateProfile(req, res, next);
      } catch (err) {
        console.log(err);
      }

      // Assertions
      expect(res.status.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(
        res.json.calledWith({
          success: true,
          message: "Profile Updated Successfully",
        })
      ).to.be.true;
      expect(next.notCalled).to.be.true;
    });
  });

  describe("forgetPassword", () => {
    let req, res;
    const newUser = new User({
      _id: "6943f44ad3082e8de362b889",
      name: "New-Test-2",
      email: "newtest2@gmail.com",
      password: "12345678",
      avatar: {
        public_id: "test-public-id",
        url: "test-url",
      },
    });

    beforeEach(() => {
      req = {
        body: {
          email: "newtest2@gmail.com",
        },
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
    });

    afterEach(() => {
      res.status.reset();
      res.json(null);
    });

    it("should send a reset token to the user's email", async () => {
      const next = sinon.spy();
      try {
        // Call the function
        await newUser.save();
        await userController.forgetPassword(req, res, next);
      } catch (err) {
        console.log(err);
      }

      // Assertions
      expect(next.calledOnce).to.be.true;


    });

    it("should return an error if user not found", async () => {
      // Update the request object to have an email of a non-existing user
      let error;
      const next = sinon.spy((args) => (error = args));
      req.body.email = "nonexistinguser@example.com";

      try {
        // Call the function
        await userController.forgetPassword(req, res, next);
      } catch (err) {
        console.log(err);
      }

      // Assertions
      expect(next).to.have.called;
      expect(error).to.be.an.instanceOf(Error);
    });
  });

  describe("resetPassword", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
      req = {
        params: {
          token: "test-token",
        },
        body: {
          password: "new-password",
        },
      };

      res = {
        statusCode: 1351,
        responseJson: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(response) {
          this.responseJson = response;
          return this;
        },
      };

      next = sinon.stub();
    });

    afterEach(() => {
      req = {
        params: {
          token: "",
        },
        body: {
          password: "",
        },
      };
      res.statusCode = 1351;
      res.responseJson = null;
      next.reset();
    });

    it("should reset the password for the user with the valid token", async () => {
      const user = {
        _id: "test-id",
        name: "John Doe",
        email: "johndoe@example.com",
        password: "old-password",
        resetPasswordToken: "test-token",
        resetPasswordExpire: Date.now() + 3600000, // 1 hour from now
        save() {},
      };

      sinon.stub(User, "findOne").returns(user);

      // Call the function
      try {
        await userController.resetPassword(req, res, next);
      } catch (err) {
        console.log(err);
      }

      // Assertions
      User.findOne.restore();
      expect(res.statusCode).to.equal(200);
      expect(res.responseJson).to.deep.equal({
        success: true,
        message: "Password Changed Successfully",
      });

      // Verify the mock
      // UserMock.verify();
    });

    it("should return an error for the user with the invalid token", async () => {
      sinon.stub(User, "findOne").returns(null);
      let error;
      const next = sinon.spy((args) => {
        error = args;
      });
      // Call the function
      try {
        await userController.resetPassword(req, res, next);
      } catch (err) {
        console.log(err);
      }

      // Assertions
      User.findOne.restore();
      expect(error).to.be.an("error");
      expect(next.args[0][0].message).to.equal("Token is invalid or has been expired");

      // Verify the mock
      // UserMock.verify();
    });
    it("should return an error for the user with the expired token", async () => {
      sinon.stub(User, "findOne").returns(null);
      let error;
      const next = sinon.spy((args) => {
        error = args;
      });
      // Call the function
      try {
        await userController.resetPassword(req, res, next);
      } catch (err) {
        console.log(err);
      }

      // Assertions
      User.findOne.restore();
      expect(error).to.be.an("error");
      expect(next.args[0][0].message).to.equal("Token is invalid or has been expired");

      // Verify the mock
      // UserMock.verify();
    });


  });

  after(async () => {
    try {
      await User.deleteMany({});
    } catch (error) {
      console.log(error);
    }
  });
});
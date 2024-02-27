import express from "express";
import {
  addToPlaylist,
  changePassword,
  deleteMyProfile,
  deleteUser,
  forgetPassword,
  getAllUsers,
  getMyProfile,
  login,
  logout,
  register,
  removeFromPlaylist,
  resetPassword,
  updateProfile,
  updateprofilepicture,
  updateUserRole,
} from "../controllers/userController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *        type: object
 *        required: [name, email, password, role]
 *        properties:
 *          name:
 *            type: string
 *            description: User's name
 *          email:
 *            type: string
 *            description: User's email address
 *            format: email
 *          password:
 *            type: string
 *            description: User's password
 *            minLength: 6
 *            format: password
 *          role:
 *            type: string
 *            description: User's role
 *            enum: [user, admin, instructor]
 *            default: user
 *          subscription:
 *            type: object
 *            description: User's subscription status
 *            properties:
 *              id:
 *                type: string
 *                description: Subscription ID
 *              status:
 *                type: string
 *                description: Subscription status
 *          avatar:
 *            type: object
 *            description: User's avatar image
 *            properties:
 *              public_id:
 *                type: string
 *                description: Avatar public ID
 *              url:
 *                type: string
 *                description: Avatar image URL
 *          playlist:
 *            type: array
 *            description: User's playlist of courses
 *            items:
 *              type: object
 *              properties:
 *                course:
 *                  type: string
 *                  description: Course ID
 *                poster:
 *                  type: string
 *                  description: Course poster image URL
 *          createdAt:
 *            type: string
 *            format: date-time
 *            description: User creation timestamp
 *          resetPasswordToken:
 *            type: string
 *          resetPasswordExpire:
 *            type: string
 *
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 */

// To register a new user
router.route("/register").post(singleUpload, register);
/**
 * @swagger
 *
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *        - User
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: profile picture
 *             required:
 *               - name
 *               - email
 *               - password
 *               - file
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 */

// Login
router.route("/login").post(login);
/**
 * @swagger
 *
 * /login:
 *   post:
 *     summary: Login to user account
 *     tags:
 *        - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *
 *                 type: string
 */

// logout
router.route("/logout").get(logout);
/**
 * @swagger
 *
 * /logout:
 *   get:
 *     summary: Logout from user account
 *     tags:
 *        - User
 *     responses:
 *       200:
 *         description: User logged out successfully
 */

// Get my profile
router.route("/me").get(isAuthenticated, getMyProfile);
/**
 * @swagger
 *
 * /me:
 *   get:
 *     summary: Get current user's profile
 *     tags:
 *        - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

// Delete my profile
router.route("/me").delete(isAuthenticated, deleteMyProfile);
/**
 * @swagger
 * /me:
 *   delete:
 *     summary: Delete current user's profile
 *     tags:
 *        - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile deleted successfully
 */

// ChangePassword
router.route("/changepassword").put(isAuthenticated, changePassword);
/**
 * @swagger
 *
 * /changepassword:
 *   put:
 *     summary: Change current user's password
 *     tags:
 *        - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 */

// UpdateProfile
router.route("/updateprofile").put(isAuthenticated, updateProfile);
/**
 * @swagger
 *
 * /updateprofile:
 *   put:
 *     summary: Update the profile of the authenticated user.
 *     tags:
 *        - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: password123
 *               bio:
 *                 type: string
 *                 description: The bio of the user.
 *                 example: I'm a software developer.
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: The profile picture of the user.
 *     responses:
 *       '200':
 *         description: Successfully updated the user profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: User profile updated successfully.
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */

// UpdateProfilePicture
router
  .route("/updateprofilepicture")
  .put(isAuthenticated, singleUpload, updateprofilepicture);
/**
 * @swagger
 *
 * /updateprofilepicture:
 *   put:
 *     summary: Update the user's profile picture.
 *     description: Allows authenticated users to update their profile picture.
 *     tags:
 *        - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *             required:
 *               - profilePicture
 *     responses:
 *       '200':
 *         description: Profile picture updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the profile picture was updated successfully.
 *                 message:
 *                   type: string
 *                   description: Message indicating the status of the operation.
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */

// ForgetPassword
router.route("/forgetpassword").post(forgetPassword);
/**
 * @swagger
 * /forgetpassword:
 *   post:
 *     summary: Sends a reset password link to user's email
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user.
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: Email sent successfully.
 *       400:
 *         description: Bad request. Invalid email address.
 *       404:
 *         description: User with the given email address not found.
 *       500:
 *         description: Internal server error.
 */

// ResetPassword
router.route("/resetpassword/:token").put(resetPassword);
/**
 * @swagger
 * user/resetpassword/{token}:
 * put:
 *   summary: Reset user's password
 *   tags:
 *        - User
 *   description: Reset the password of the user who has the provided token.
 *   parameters:
 *     - in: path
 *       name: token
 *       required: true
 *       description: The reset password token sent to the user's email.
 *       schema:
 *         type: string
 *     - in: body
 *       name: password
 *       required: true
 *       description: The new password to be set.
 *       schema:
 *         type: object
 *         properties:
 *           password:
 *             type: string
 *             format: password
 *             description: The new password to be set.
 *   responses:
 *     200:
 *       description: Password reset successful.
 *     400:
 *       description: Invalid or expired token.
 *     500:
 *       description: Internal server error.
 *   security: []
 */

// AddtoPlaylist
router.route("/addtoplaylist").post(isAuthenticated, addToPlaylist);
/**
 * @swagger
 * /addtoplaylist:
 *   post:
 *     summary: Add a course to user's playlist
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: ID of the course to add to playlist
 *     responses:
 *       "200":
 *         description: Course added to playlist successfully
 *       "400":
 *         description: Invalid request payload
 *       "401":
 *         description: Unauthorized access
 *       "404":
 *         description: Course not found
 */

// RemoveFromPlaylist
router.route("/removefromplaylist").delete(isAuthenticated, removeFromPlaylist);
/**
 * @swagger
 * /removefromplaylist:
 *   delete:
 *     summary: Remove a course from user's playlist
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: ID of the course to remove from playlist
 *     responses:
 *       "200":
 *         description: Course removed from playlist successfully
 *       "400":
 *         description: Invalid request payload
 *       "401":
 *         description: Unauthorized access
 *       "404":
 *         description: Course not found
 */

router.route("/admin/users").get(isAuthenticated, authorizeAdmin, getAllUsers);
/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: true if request is successful
 *                 data:
 *                   type: array
 *                   description: Array of users
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID of the user
 *                         example: 610e871d3c8e95141447a5b5
 *                       name:
 *                         type: string
 *                         description: Name of the user
 *                         example: John Doe
 *                       email:
 *                         type: string
 *                         description: Email of the user
 *                         example: john@example.com
 *                       role:
 *                         type: string
 *                         description: Role of the user
 *                         example: subscriber
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

router
  .route("/admin/user/:id")
  .put(isAuthenticated, authorizeAdmin, updateUserRole)
  .delete(isAuthenticated, authorizeAdmin, deleteUser);
/**
 * @swagger
 * /admin/user/{id}:
 *   get:
 *     summary: Update role of a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user 
 *     responses:
 *       "200":
 *         description: Updated role successfully
 *       "404":
 *         description: User not found
 *       "500":
 *         description: Internal Server Error
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user 
 *     responses:
 *       "200":
 *         description: User deleted successfully
 *       "404":
 *         description: User not found
 *       "500":
 *         description: Internal Server Error
*/

export default router;

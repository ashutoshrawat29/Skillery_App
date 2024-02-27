import express from "express";
import {
  contact,
  courseRequest,
  getDashboardStats,
  getSubscribed,
} from "../controllers/otherController.js";

import { authorizeAdmin, authorizeAdminOrInstructor, isAuthenticated } from "../middlewares/auth.js";
import { isSubscribedCountPresent } from "../middlewares/cache.js";

const router = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *    Stats:
 *      type: object
 *      properties:
 *        users:
 *          type: number
 *          default: 0
 *        subscription:
 *          type: number
 *          default: 0
 *        views:
 *          type: number
 *          default: 0
 *        createdAt:
 *          type: string
 *          format: date-time
 *          default: '2023-04-03T00:00:00.000Z'
 *      required:
 *        - users
 *        - subscription
 *        - views
 *        - createdAt
 *
 * tags:
 *   name: Other
 *   description: Endpoints for handling miscellaneous requests
 *
 * /contact:
 *   post:
 *     summary: Send a message through the contact form
 *     description: Sends a message through the contact form with the provided details.
 *     tags: [Other]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the person sending the message
 *               email:
 *                 type: string
 *                 description: Email of the person sending the message
 *               message:
 *                 type: string
 *                 description: The message to be sent
 *     responses:
 *       200:
 *         description: The message was successfully sent
 *       400:
 *         description: The request was malformed or missing required parameters
 *       500:
 *         description: An internal server error occurred while attempting to send the message
 *
 * /courserequest:
 *   post:
 *     summary: Submit a course request
 *     description: Submits a course request with the provided details.
 *     tags: [Other]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the person submitting the course request
 *               email:
 *                 type: string
 *                 description: Email of the person submitting the course request
 *               course:
 *                 type: string
 *                 description: The course the person is requesting
 *               message:
 *                 type: string
 *                 description: Any additional information the person wants to provide
 *     responses:
 *       200:
 *         description: The course request was successfully submitted
 *       400:
 *         description: The request was malformed or missing required parameters
 *       500:
 *         description: An internal server error occurred while attempting to submit the course request
 *
 * /admin/stats:
 *   get:
 *     summary: Get admin dashboard statistics
 *     description: Retrieves statistics for the admin dashboard. Only authenticated admin users can access this endpoint.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The dashboard statistics were successfully retrieved
 *       401:
 *         description: Authentication credentials were missing or invalid
 *       403:
 *         description: The user does not have permission to access the admin dashboard
 *       500:
 *         description: An internal server error occurred while attempting to retrieve the dashboard statistics
 */
/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: API endpoints for sending a contact message
 * 
 * /contact:
 *   post:
 *     summary: Send a contact message.
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the sender.
 *               email:
 *                 type: string
 *                 description: The email address of the sender.
 *               message:
 *                 type: string
 *                 description: The message content.
 *             example:
 *               name: "John Doe"
 *               email: "john.doe@example.com"
 *               message: "Hello, I have a question about your service."
 *     responses:
 *       200:
 *         description: Returns a success message indicating the message was sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating the message was sent.
 *             example:
 *               message: "Message sent successfully."
 * 
 * /courserequest:
 *   post:
 *     summary: Send a course request.
 *     tags: [CourseRequest]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - course_name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the person making the course request.
 *               email:
 *                 type: string
 *                 description: The email address of the person making the course request.
 *               course_name:
 *                 type: string
 *                 description: The name of the course being requested.
 *             example:
 *               name: "John Doe"
 *               email: "john.doe@example.com"
 *               course_name: "Introduction to JavaScript"
 *     responses:
 *       200:
 *         description: Returns a success message indicating the course request was sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating the course request was sent.
 *             example:
 *               message: "Course request sent successfully."
 *
 *
 * /stats:
 *   get:
 *     summary: Get dashboard statistics.
 *     tags: [Stats]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the dashboard statistics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_users:
 *                   type: integer
 *                   description: The total number of registered users.
 *                 total_courses:
 *                   type: integer
 *                   description: The total number of courses.
 *                 total_enrollments:
 *                   type: integer
 *                   description: The total number of course enrollments.
 *             example:
 *               total_users: 1000
 *               total_courses: 50
 *               total_enrollments: 500
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 * 
 * /subscribed:
 *   get:
 *     summary: Get the list of subscribed users.
 *     tags: [Subscribed]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the list of subscribed users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
// contact form
router.route("/contact").post(contact);

// Request form
router.route("/courserequest").post(courseRequest);

// Get Dashboard Stats
router
  .route("/stats")
  .get(isAuthenticated, authorizeAdminOrInstructor, getDashboardStats);

// Get Subscribed User
router
.route("/subscribed")
.get(isAuthenticated, isSubscribedCountPresent, getSubscribed);

export default router;

import express from "express";
import {
  addLecture,
  createCourse,
  deleteCourse,
  deleteLecture,
  getAllCourses,
  getCourseLectures,
  getInstructorCourses,
} from "../controllers/courseController.js";
import {
  authorizeAdmin,
  authorizeInstructor,
  isAuthenticated,
  authorizeSubscribers,
  authorizeAdminOrInstructor,
} from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Course:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *          minLength: 4
 *          maxLength: 80
 *          description: Course title
 *        description:
 *          type: string
 *          minLength: 20
 *          description: Course description
 *        lectures:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                description: Lecture title
 *              description:
 *                type: string
 *                description: Lecture description
 *              video:
 *                type: object
 *                properties:
 *                  public_id:
 *                    type: string
 *                    description: Public ID of video
 *                  url:
 *                    type: string
 *                    description: URL of video
 *                required:
 *                  - public_id
 *                  - url
 *            required:
 *              - title
 *              - description
 *              - video
 *        poster:
 *          type: object
 *          properties:
 *            public_id:
 *              type: string
 *              description: Public ID of course poster
 *            url:
 *              type: string
 *              description: URL of course poster
 *          required:
 *            - public_id
 *            - url
 *        views:
 *          type: integer
 *          default: 0
 *          description: Number of course views
 *        numOfVideos:
 *          type: integer
 *          default: 0
 *          description: Number of videos in course
 *        category:
 *          type: string
 *          description: Course category
 *        createdBy:
 *          type: string
 *          description: Name of course creator
 *          example: John Doe
 *        createdAt:
 *          type: string
 *          format: date-time
 *          default: '2023-04-03T00:00:00.000Z'
 *      required:
 *        - title
 *        - description
 *        - poster
 *        - category
 *        - createdBy
 */



// Get All courses without lectures
/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     description: Returns a list of all courses without their lectures
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: A list of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.route("/courses").get(getAllCourses);

// create new course - only admin
/**
 * @swagger
 * /createcourse:
 *   post:
 *     summary: Create a new course
 *     description: Creates a new course with a title, description, and thumbnail image. Only authenticated admin users can create a new course.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the course
 *               description:
 *                 type: string
 *                 description: The description of the course
 *               category:
 *                 type: string
 *                 description: The category of the course
 *               createdBy:
 *                 type: string
 *                 description: Course creator of the course    
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The thumbnail image of the course
 *             required:
 *               - title
 *               - description
 *               - category
 *               - createdBy
 *               - file
 *     responses:
 *       201:
 *         description: The newly created course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 */
router
  .route("/createcourse")
  .post(isAuthenticated, authorizeAdminOrInstructor, singleUpload, createCourse);

// Add lecture, Delete Course, Get Course Details
/**
 * @swagger
 * /course/{id}:
 *   get:
 *     summary: Get details for a specific course
 *     description: Returns details for a specific course, including the course title, description, and a list of its lectures. Only authenticated subscribers can view course details.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the course to retrieve details for
 *     responses:
 *       200:
 *         description: The details for the requested course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseDetails'
 *
 *   post:
 *     summary: Add a new lecture to a course
 *     description: Adds a new lecture to a course, including a title, description, and video file. Only authenticated admin users can add lectures to a course.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the course to add the lecture to
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the lecture
 *               description:
 *                 type: string
 *                 description: The description of the lecture
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: The video file of the lecture
 *             required:
 *               - title
 *               - description
 *               - video
 *     responses:
 *       201:
 *         description: The newly created lecture
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lecture'
 *
 *   delete:
 *     summary: Delete a course
 *     description: Deletes a course with the specified ID. Only authenticated admin users can delete a course.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the course to delete
 *     responses:
 *       204:
 *         description: The course was successfully deleted
 *
 * /lecture:
 *   delete:
 *     summary: Delete a lecture
 *     description: Deletes a lecture with the specified ID. Only authenticated admin users can delete a lecture.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the lecture to delete
 *     responses:
 *       204:
 *         description: The lecture was successfully deleted
 */
router
  .route("/course/:id")
  .get(isAuthenticated, authorizeSubscribers, getCourseLectures)
  .post(isAuthenticated, authorizeAdminOrInstructor, singleUpload, addLecture)
  .delete(isAuthenticated, authorizeAdminOrInstructor, deleteCourse);

// Delete Lecture
/**
 * @swagger
 * /lecture:
 *   delete:
 *     summary: Delete a lecture
 *     description: Deletes a lecture with the specified ID. Only authenticated admin users can delete a lecture.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the lecture to delete
 *     responses:
 *       204:
 *         description: The lecture was successfully deleted
 *       404:
 *         description: The lecture with the specified ID was not found
 *       401:
 *         description: Authentication credentials were missing or invalid
 *       403:
 *         description: The user does not have permission to delete the lecture
 *       500:
 *         description: An internal server error occurred while attempting to delete the lecture
 */
router.route("/lecture").delete(isAuthenticated, authorizeAdminOrInstructor, deleteLecture);

router
.route("/instructorcourses")
.get(isAuthenticated, authorizeInstructor, getInstructorCourses)

router
.route("/instructorcreatecourse")
.post(isAuthenticated,authorizeInstructor,singleUpload,createCourse);
/**
 * @swagger
 * /lecture:
 *   delete:
 *     summary: Delete a lecture by ID.
 *     tags: [Lecture]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lectureId
 *         required: true
 *         description: ID of the lecture to delete.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Lecture deleted successfully.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Lecture not found.
 */

/**
 * @swagger
 * /instructorcourses:
 *   get:
 *     summary: Get the list of courses created by the authenticated instructor.
 *     tags: [Instructor]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the list of courses created by the authenticated instructor.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /instructorcreatecourse:
 *   post:
 *     summary: Create a new course.
 *     tags: [Instructor]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the course.
 *               description:
 *                 type: string
 *                 description: Description of the course.
 *               price:
 *                 type: number
 *                 description: Price of the course.
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Thumbnail image for the course.
 *             required:
 *               - title
 *               - description
 *               - price
 *               - thumbnail
 *     responses:
 *       201:
 *         description: Course created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Invalid request data.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

export default router;

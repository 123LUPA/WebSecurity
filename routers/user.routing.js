import express from 'express';
import User from '../models/user'
//define router
let userRouter = express.Router();

/**
 * @swagger
 * definitions:
 *  User:
 *      type: object
 *      required:
 *      - email
 *      - password
 *      properties:
 *          companyName:
 *              type: string
 *          email:
 *              type: string
 *          password:
 *              type: string
 *          resetPasswordToken:
 *              type: string
 *          resetPasswordExpires:
 *              type: string
 *          loginAttempts:
 *              type: number
 *          startTime:
 *              type: string
 *          endTime:
 *              type: string
 */

/**
 * @swagger
 * /users:
 *  get:
 *      tags:
 *      - user
 *      summary: get all users
 *      parameters:
 *          - in: header
 *            name: x-access-token
 *            schema:
 *              type: string
 *            required: true
 *      description: get all users
 *      responses:
 *          201:
 *              description: ok
 *
 */
userRouter.get('/', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});


export default userRouter;

// module.exports = router;

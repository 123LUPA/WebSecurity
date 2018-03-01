import express from 'express';
import taskController from "../controllers/task.controller";
import userRouter from "./user.routing";
import userController from "../controllers/user.controller";
//define router
let taskRouter = express.Router();

/**
 * @swagger
 * definitions:
 *  Task:
 *      type: object
 *      required:
 *      - title
 *      - description
 *      - author
 *      properties:
 *          title:
 *              type: string
 *          description:
 *              type: string
 *          author:
 *              type: string
 */
/**
 * @swagger
 * /tasks:
 *  post:
 *      tags:
 *      - task
 *      summary: create task
 *      description: create task
 *      parameters:
 *      - in: body
 *        name: task
 *        schema:
 *           $ref: '#/definitions/Task'
 *      responses:
 *          201:
 *              description: ok
 *
 */
taskRouter.post('/', (req, res)=> {
    taskController.create(req.body).then((created, err)=>{
        if(err)
            res.status(400).send(err);
        res.send(created);
    }).catch((e)=>{
        console.log(e);
        res.status(400).send(e);
    });
});

/**
 * @swagger
 * /tasks:
 *  get:
 *      tags:
 *      - task
 *      summary: get all tasks
 *      description: get all tasks
 *      responses:
 *          201:
 *              description: ok
 *
 */
taskRouter.get('/', function(req, res) {
    taskController.getAll().then((tasks, err)=>{
        if(err)
            res.status(400).send(err);
        res.json({tasks: tasks});
    }).catch((e)=>{
        res.status(400).send(e.errmsg);
    });
});

/**
 * @swagger
 * /tasks/{id}:
 *  delete:
 *      tags:
 *      - task
 *      summary: delete specific task
 *      description: delete specific task based on id
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *      responses:
 *          200:
 *              description: ok
 */
taskRouter.delete('/:id', function (req, res) {
    taskController.deleteOne(req.params.id).then((deleted, err)=>{
        if(err)
            res.status(400).send(err);
        res.send(deleted);
    }).catch((e)=>{
        res.status(400).send(e.errmsg);
    });
});
/**
 * @swagger
 * /tasks/{id}:
 *  put:
 *      tags:
 *      - task
 *      summary: update specific task
 *      description: update specific task based on id
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *      - in: body
 *        name: task to update
 *        schema:
 *           $ref: '#/definitions/Task'
 *      responses:
 *          200:
 *              description: ok
 */
taskRouter.put('/:id', function (req, res) {
    taskController.updateOne(req.params.id, req.body).then((updated, err)=>{
        if(err)
            res.status(400).send(err);
        res.send(updated);
    }).catch((e)=>{
        res.status(400).send(e.errmsg);
    });
});
export default taskRouter;
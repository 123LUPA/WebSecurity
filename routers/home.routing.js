/**
 * Created by Palko on 03/03/2018.
 */
import express from 'express';
import userController from '../controllers/user.controller'
let homeRouter = express.Router();


homeRouter.post('', function(req, res) {
    userController.findUserByEmailInToken(req).then((user, err)=> {
        if (user) {
           return res.send(user);
        }
       return res.sendStatus(400);
    });
});

export default homeRouter;


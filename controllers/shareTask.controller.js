import boardModel from '../models/board';
import BaseController from './base.controller';
import {decrypt} from '../services/encryption.service';
import {encrypt} from '../services/encryption.service';
import userController from '../controllers/user.controller';
import taskController from '../controllers/task.controller'
import forEachAsync from 'forEachAsync';
class ShareTaskController  extends BaseController {


    constructor() {
        super(boardModel.getModel());
        this.boardModel = boardModel.getModel();
    }

    shareTask(board) {

        let userObj = new this.boardModel(board);
        //save new model

        return userObj.save();
    }

    getShareTaskRequest(userEmail) {

        var requestSenders = [];
        var activity = [];

        return new Promise((resolve, reject) => {

            var decryptedemail = decrypt(userEmail);

            console.log(decryptedemail);

            this.model.find({requestReceiver: decryptedemail}, (err, requests) => {

                if (err) return reject(err);

                    requests.forEach(err,request=>{

                        userController.userModel.findOne({_id: request.requestSender}, (err, user) => {

                            requestSenders.push(user.companyName);
                    });
                });
            });
        });
    }
}
const shareTaskController = new ShareTaskController();
export default shareTaskController;
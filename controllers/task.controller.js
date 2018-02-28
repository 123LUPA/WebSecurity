import taskModel from '../models/task';
import BaseController from './base.controller';
class TaskController  extends BaseController{


    constructor(){
        super(taskModel.getModel());
    }

}
const taskController = new TaskController();
export default taskController;
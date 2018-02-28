class BaseController{
    constructor(model){
        this.model = model;
    }
    //get all objs form mongo
    getAll(){
       return this.model.find({});
    }
    //save obj in mongo
    create(obj){
        let objToSave = new this.model(obj);
        return objToSave.save();
    }
}
export default BaseController;

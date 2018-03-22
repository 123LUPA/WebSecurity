import {Task} from "../model/task";

export class Board{
  constructor(requestReceiver: String,taskId:String, accepted: boolean){
    this.requestReceiver = requestReceiver;
    this.taskId=taskId ;
    this.accepted = accepted;
  }
  accepted: boolean;
  requestReceiver: String;
  taskId:String;

}

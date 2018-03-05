export class Processing{
  constructor(isProcessing: boolean, isCompleted: boolean, isError: boolean){
    this.isProcessing = isProcessing;
    this.isCompleted = isCompleted;
    this.isError = isError;
  }
  isProcessing: boolean;
  isCompleted: boolean;
  isError: boolean;
}

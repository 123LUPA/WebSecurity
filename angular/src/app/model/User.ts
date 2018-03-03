/**
 * Created by Palko on 03/02/2018.
 */
export class User{
  constructor(companyName: String, email: String, password: String){
    this.companyName = companyName;
    this.email = email;
    this.password = password;
  }
  companyName: String;
  email: String;
  password: String;

}

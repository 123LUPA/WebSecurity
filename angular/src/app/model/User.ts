/**
 * Created by Palko on 03/02/2018.
 */
export class User{
  constructor(companyName: String, email: String, password: String, image: String, role: String){
    this.companyName = companyName;
    this.email = email;
    this.password = password;
    this.image = image;
    this.role = role;

  }
  companyName: String;
  email: String;
  password: String;
  image: String;
  role: String;

}

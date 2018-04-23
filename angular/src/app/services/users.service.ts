import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Cookie} from "ng2-cookies/ng2-cookies";
import Config from "../../../app-config";

@Injectable()
export class UsersService {
  private token = Cookie.get("token");
  private headers = new HttpHeaders();
  private testUrl = Config.nodeApi;

  constructor( private http: HttpClient) {
  }
  getUsers(){
    let testUrl = this.testUrl + 'users';
    this.headers = this.headers.set('X-Access-Token', this.token);
    return this.http.get(testUrl, {headers: this.headers});

  }




}

import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AutenticarRequest } from 'src/app/models/interfaces/autenticar/Autenticar-request';
import { AutenticarResponse } from 'src/app/models/interfaces/autenticar/Autenticar-response';
import { CadastroUserRequest } from 'src/app/models/interfaces/user/CadastroUser-request';
import { CadastroUserResponse } from 'src/app/models/interfaces/user/CadastroUser-response';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = environment.API_URL

  constructor(
    private http: HttpClient,
    private cookie: CookieService
  ) { }

  cadastroUser(requestData: CadastroUserRequest): Observable<CadastroUserResponse> {
    return this.http.post<CadastroUserResponse>(`${this.API_URL}/user`, requestData)
  }

  autenticarUser(requestData:AutenticarRequest): Observable<AutenticarResponse> {
    return this.http.post<AutenticarResponse>(`${this.API_URL}/auth`, requestData)
  }

  validacaoUserLogin(): boolean {
    //Verifica se o usuário possui um token
    const TOKEN = this.cookie.get('USER_TOKEN')
    return TOKEN ? true : false
  }

}

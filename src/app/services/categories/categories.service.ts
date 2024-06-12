import { EditCategoryRequest } from './../../../../../API/stock-api/src/models/interfaces/category/EditCategoryRequest';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UpdateModeEnum } from 'chart.js';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { GetCategoriesResponseInterface } from 'src/app/models/interfaces/categories/response/getCategories-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private API_URL = environment.API_URL
  private TOKEN = this.cookie.get('USER_TOKEN')
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.TOKEN}`,
    })
  }

  constructor(
    private cookie: CookieService,
    private http: HttpClient,
  ) { }

  getAllCategories(): Observable<Array<GetCategoriesResponseInterface>> {
    return this.http.get<Array<GetCategoriesResponseInterface>>(`${this.API_URL}/categories`, this.httpOptions)
  }

  createCategory(category: {name: string}): Observable<Array<GetCategoriesResponseInterface>>{
    return this.http.post<Array<GetCategoriesResponseInterface>>(`${this.API_URL}/category`, category, this.httpOptions)
  }

  editCategory(update: {name: string, id: string}): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/category/edit`, {name: update.name}, {
      ...this.httpOptions,
      params: {
        category_id: update.id
      }
    })
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/category/delete`, {
      ...this.httpOptions,
      params: {
        category_id: id
      }
    })
  }


}

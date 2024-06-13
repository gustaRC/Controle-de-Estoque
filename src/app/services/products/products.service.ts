import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';
import { EditProductRequestInterface } from 'src/app/models/interfaces/products/request/editProductRequest-interface';
import { ProductCreateRequestInterface } from 'src/app/models/interfaces/products/request/productCreateRequest-interface';
import { SaleProductRequest } from 'src/app/models/interfaces/products/request/saleProduct-request';
import { DeleteProductResponse } from 'src/app/models/interfaces/products/response/deleteProduct-response';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/getAllProducts-reponse';
import { ProductCreateResponseInterface } from 'src/app/models/interfaces/products/response/productCreateResponse-interface';
import { SaleProductResponse } from 'src/app/models/interfaces/products/response/saleProduct-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private API_URL = environment.API_URL
  private TOKEN = this.cookie.get('USER_TOKEN')
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.TOKEN}`,
    })
  }

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
  ) { }

  getAllProducts(): Observable<Array<GetAllProductsResponse>> {
    return this.http.get<Array<GetAllProductsResponse>>(
      `${this.API_URL}/products`, this.httpOptions
    ).pipe(
      map((product) => product.filter(data => data?.amount > 0))
    )
  }

  deleteProduct(id: string): Observable<DeleteProductResponse> {
    return this.http.delete<DeleteProductResponse>(`${this.API_URL}/product/delete`, {
      ...this.httpOptions, params: {
        product_id: id,
      }
    })
  }

  createProduct(product: ProductCreateRequestInterface): Observable<ProductCreateResponseInterface> {
    return this.http.post<ProductCreateResponseInterface>(`${this.API_URL}/product`, product, this.httpOptions)
  }

  editProduct(product: EditProductRequestInterface): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/product/edit`, product, this.httpOptions)
  }

  saleProduct(data: SaleProductRequest): Observable<SaleProductResponse> {
    return this.http.put<SaleProductResponse>(`${this.API_URL}/product/sale`, {amount: data?.amount}, {
      ...this.httpOptions,
      params: {
        product_id: data?.product_id
      }
    })
  }

}

import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take, throwError } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/getAllProducts-reponse';

@Injectable({
  providedIn: 'root'
})
/*
  INTUITO DO SERVICE É SALVAR O DADOS DE PRODUTOS PARA ASSIM NÃO SOBRECARREGAR A PÁGINA COM REQUISIÇÕES EXCESSIVAS
  É UMA ESTRATEGIA! NÃO É ALGO VITAL PARA A APLICAÇÃO, SEM ISSO TAMBÉM DARIA CERTO, MAS METODOS ANTI MEMORY LEAK SÃO BEM VINDOS!
*/
export class ProductsDataTransferService {

  /*
  BehaviorSubject requer um valor inicial de iniciação. Ao ser chamado, diferente do Subject
  que não mostrará nada ate ser emitido, o BehavioSubject já vai nos informar algum valor.
  Neste caso o valor inicial será null
  */
  public productsDataEmitter$ = new BehaviorSubject<Array<GetAllProductsResponse> | null>(null)
  //Variaveis Observables/Subjects recebem um dolar no final para identificação. BOA PRÁTICA!
  public productsBackup: Array<GetAllProductsResponse> = []

  constructor() { }

  setProducts(datas: Array<GetAllProductsResponse>) {
    if (datas) {
      this.productsDataEmitter$.next(datas)
      this.getProducts()
    }
  }

  getProducts() {
    this.productsDataEmitter$.pipe(
      take(1),
      map(data => data?.filter(product => product.amount > 0))
    ).subscribe(
      resp => {
        if (resp)
          this.productsBackup = resp
      }
    )
    return this.productsBackup;
  }
}

import { ProductDeleteEventInterface } from './../../../../models/interfaces/products/event/ProductDeleteEvent-interface';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductEventEnum } from 'src/app/models/enums/products/ProductEvent-enum';
import { ProductEventInterface } from 'src/app/models/interfaces/products/event/ProductEvent-interface';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/getAllProducts-reponse';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
})
export class ProductsTableComponent implements OnInit {

  @Input() products: Array<GetAllProductsResponse> = []
  @Output() actionTableEvent = new EventEmitter<ProductEventInterface>();
  @Output() deleteProductEvent = new EventEmitter<ProductDeleteEventInterface>();

  productSelected!: GetAllProductsResponse;
  addProductEvent = ProductEventEnum.ADD_PRODUCT;
  editProductEvent = ProductEventEnum.EDIT_PRODUCT;

  constructor() { }

  ngOnInit(): void {
  }

  actionProductEventEmit(action: string, product?: any) {
    if (action && action !== '') {
      const productEventData = product && product !== '' ? {action, product} : {action}
      this.actionTableEvent.emit(productEventData)
    }
  }

  actionDeleteProduct(product_id: string, productName: string) {
    if (product_id != '' && productName != '') {
      this.deleteProductEvent.emit({product_id, productName})
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductEventEnum } from 'src/app/models/enums/products/ProductEvent-enum';
import { ProductFormComponent } from 'src/app/modules/products/components/product-form/product-form.component';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html'
})
export class ToolbarNavigationComponent implements OnInit {

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
  }

  sairApp() {
    this.cookieService.delete('USER_TOKEN');
    this.router.navigate(['/home']);
  }

  saleProduct() {
    const saleProduct = ProductEventEnum.SALE_PRODUCT

    this.dialogService.open(ProductFormComponent, {
      header: saleProduct,
      width: '70%',
      contentStyle: { overflow: 'auto'},
      baseZIndex: 10000,
      data: {
        event: {action: saleProduct}
      }
    })
  }
}

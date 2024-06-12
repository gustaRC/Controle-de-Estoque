import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductsDataTransferService } from './../../../shared/services/products/products-data-transfer.service';
import { ProductsService } from './../../../services/products/products.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/getAllProducts-reponse';
import { ProductEventInterface } from 'src/app/models/interfaces/products/event/ProductEvent-interface';
import { ProductDeleteEventInterface } from 'src/app/models/interfaces/products/event/ProductDeleteEvent-interface';
import { ProductFormComponent } from '../components/product-form/product-form.component';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
})
export class ProductsHomeComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject();
  public productsDatas: Array<GetAllProductsResponse> = [];

  private ref!: DynamicDialogRef

  constructor(
    private productsService: ProductsService,
    private productsDataTransferService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.getServiceProductsData();
  }

  getServiceProductsData() {
    const productsLoaded = this.productsDataTransferService.getProducts();

    if (productsLoaded.length > 0) {
      this.productsDatas = productsLoaded
    } else this.getAPIProductsDatas()
  }

  getAPIProductsDatas() {
    this.productsService.getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        resp => {
          if (resp)
            this.productsDatas = resp
            this.productsDataTransferService.setProducts(this.productsDatas)
        },
        err => {
          console.log(err)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produto',
            life: 2500,
          })
          this.router.navigate(['/dashboard'])
        }
      )
  }

  receivedEmit(event: ProductEventInterface) {
    if (event.action) {
      this.ref = this.dialogService.open(ProductFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: {overflow: 'auto'},
        baseZIndex: 10000,
        data: {
          event: event,
          productDatas: this.productsDatas
        }
      });
      this.ref.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.getAPIProductsDatas()
      })

    }
  }

  receivedDeleteEmit(event: any) {
    if (event) {
      this.confirmationService.confirm({
        message: `Confirma a exclusão do produto: ${event?.productName}?`,
        header: 'Confirmação de Exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteProduct(event?.product_id)
      })
    }
  }

  deleteProduct(id: string) {
    if (id) {
      this.productsService.deleteProduct(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        resp => {
          if (resp) {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto removido com sucesso!',
              life: 2500
            })
          }

          this.getAPIProductsDatas();
        },
        err => {
          console.log(err)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Houve erro ao remover produto!',
            life: 2500
          })
        }

      )
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}

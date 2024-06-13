import { ProductsDataTransferService } from './../../../../shared/services/products/products-data-transfer.service';
import { ProductCreateResponseInterface } from './../../../../models/interfaces/products/response/productCreateResponse-interface';
import { ProductsService } from './../../../../services/products/products.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesService } from './../../../../services/categories/categories.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { GetCategoriesResponseInterface } from 'src/app/models/interfaces/categories/response/getCategories-response';
import { ProductCreateRequestInterface } from 'src/app/models/interfaces/products/request/productCreateRequest-interface';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/getAllProducts-reponse';
import { EditProductRequestInterface } from 'src/app/models/interfaces/products/request/editProductRequest-interface';
import { ProductEventEnum } from 'src/app/models/enums/products/ProductEvent-enum';
import { SaleProductRequest } from 'src/app/models/interfaces/products/request/saleProduct-request';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject<void>()

  @Input() evento!: string

  categories: Array<GetCategoriesResponseInterface> = [];
  categoriesSelected: string | undefined;

  productEvent = ProductEventEnum
  productsDatas: Array<GetAllProductsResponse> = [];

  selectedProductSale!: GetAllProductsResponse;

  dialogData: {action: string, product?: GetAllProductsResponse} = { action: this.productEvent.ADD_PRODUCT }

  productForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: ['', Validators.required],
  })

  saleProductForm = this.formBuilder.group({
    amount: [0, Validators.required],
    product_id: ['', Validators.required]
  })

  constructor(
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private dynamicDialogConfig : DynamicDialogConfig,
    private productsDataService: ProductsDataTransferService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setDialogData();
    this.getAllCategories();
    this.getAllProducts();
  }

  setDialogData() {
    this.dialogData = this.dynamicDialogConfig.data.event
    const dialogProduct = this.dialogData.product
    this.categoriesSelected = dialogProduct?.category.id
    if (this.dialogData.action == 'Editar Produto') {
      this.productForm.setValue({
        name: dialogProduct?.name,
        price: dialogProduct?.price,
        description: dialogProduct?.description,
        category_id: dialogProduct?.category.id,
        amount: dialogProduct?.amount,
      })
    }
  }

  getAllCategories() {
    this.categoriesService.getAllCategories()
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      resp => {
        if (resp.length > 0) {
          this.categories = resp
        }
      },
      err => {
        console.log(err)
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar categorias!',
          life: 2000,
        })
      }

    )
  }

  getAllProducts() {
    if (this.dialogData?.action === this.productEvent.SALE_PRODUCT){
      this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
            this.productsDatas &&
              this.productsDataService.setProducts(this.productsDatas);
          }
        },
      });
    }
  }

  submitProduct() {
    if (this.dialogData.action == this.productEvent.ADD_PRODUCT) {
      this.submitAdd()
    } else if (this.dialogData.action == this.productEvent.EDIT_PRODUCT) {
      const idProduct = this.dialogData?.product ? this.dialogData?.product?.id : ''
      this.submitEdit(idProduct)
    }

  }

  submitAdd() {
    if (this.productForm?.value && this.productForm?.valid) {
      const addProduct: ProductCreateRequestInterface = {
        name: this.productForm.value.name as string,
        price: this.productForm.value.price as string,
        description: this.productForm.value.description as string,
        category_id: this.productForm.value.category_id as string,
        amount: Number(this.productForm.value.amount)
      }

      this.productsService.createProduct(addProduct)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        resp => {
          if (resp) {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Produto "${addProduct.name}" adicionado com sucesso!`,
              life: 2500
            })
          }
        },
        err => {
          console.log(err)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar produto!',
            life: 2500,
          })
        }
      )

      this.productForm.reset()
    }
  }

  submitEdit(productID: string) {
    if (this.productForm?.value && this.productForm?.valid) {
      const editProduct: EditProductRequestInterface = {
        name: this.productForm.value.name as string,
        price: this.productForm.value.price as string,
        description: this.productForm.value.description as string,
        product_id: productID as string,
        amount: Number(this.productForm.value.amount),
        category_id: this.productForm.value.category_id
      }

      this.productsService.editProduct(editProduct)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        resp => {
          if (resp) {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Produto "${editProduct.name}" editado com sucesso!`,
              life: 2500
            })
          }
        },
        err => {
          console.error(err)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao editar produto!',
            life: 2500,
          })
        }
      )
    }

  }

  submitSale() {
    if (this.saleProductForm?.value && this.saleProductForm?.valid) {
      const saleDataProduct: SaleProductRequest = {
        amount: this.saleProductForm?.value?.amount as number,
        product_id: this.saleProductForm?.value?.product_id as string,
      }

      this.productsService.saleProduct(saleDataProduct)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        dados => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Produto vendido com sucesso! ${saleDataProduct.amount} unidades foram vendidos!`,
            life: 2500
          })
          this.getAllProducts();
          this.saleProductForm.reset();
          this.router.navigate(['/dashboard'])

        },
        error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Houve erro ao vender produto!',
            life: 2500
          })
          console.error(error)
        }
      )


    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}

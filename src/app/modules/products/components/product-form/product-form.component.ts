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

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject<void>()

  @Input() evento!: string

  categories: Array<GetCategoriesResponseInterface> = [];
  categoriesSelected: string | undefined;

  dialogData: {action: string, product?: GetAllProductsResponse} = { action: 'Adicionar Produto' }

  productForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: ['', Validators.required],
  })

  constructor(
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private dynamicDialogConfig : DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.setDialogData();
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

  submitProduct() {
    if (this.dialogData.action == 'Adicionar Produto') {
      this.submitAdd()
    } else if (this.dialogData.action == 'Editar Produto') {
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


  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}

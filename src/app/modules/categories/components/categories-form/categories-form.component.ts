import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { CategoryEventEnum } from 'src/app/models/enums/categories/CategoryEvent-enum';
import { CategoryEventInterface } from 'src/app/models/interfaces/categories/events/CategoryEvent-interface';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
})
export class CategoriesFormComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject<void>();

  public addCategoryAction = CategoryEventEnum.ADD_PRODUCT;
  public editCategoryAction = CategoryEventEnum.EDIT_PRODUCT;

  dialogData: {action: string, category?: CategoryEventInterface} = { action: 'Adicionar Categoria' }

  public categoryForm = this.formBuilder.group({
    name: ['', Validators.required]
  })

  constructor(
    public ref: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private categoriesService: CategoriesService,
    private dynamicDialogConfig: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.setDialogData()
  }

  setDialogData() {
    this.dialogData = this.dynamicDialogConfig.data.event
    const dialogCategory = this.dialogData.category

    if (this.dialogData.action == 'Editar Produto') {
      this.categoryForm.setValue({
        name: dialogCategory?.name
      })
    }
  }

  submitCategory() {
    if (this.dialogData.action == this.addCategoryAction) {
      this.addCategory()
    } else if (this.dialogData.action == this.editCategoryAction) {
      this.editCategory()
    }

  }

  addCategory() {
    if (this.categoryForm?.value && this.categoryForm?.valid) {
      const newCategory: {name: string} = {
        name: this.categoryForm.value.name as string
      }

      this.categoriesService.createCategory(newCategory)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.categoryForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Categoria ${newCategory.name} criada com sucesso!`,
            life: 2500
          })
        },
        error: (err) => {
          console.error(err)
          this.categoryForm.reset()
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar categoria!',
            life: 2500,
          })
        }
      })

    }
  }

  editCategory() {
    if (this.categoryForm?.value && this.categoryForm.valid) {
      const updateCategory: {name: string, id: string} = {
        name: this.categoryForm.value.name as string,
        id: this.dialogData.category?.id as string
      }

      this.categoriesService.editCategory(updateCategory)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        dados => {
          this.categoryForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Categoria ${updateCategory.name} criada com sucesso!`,
            life: 2500
          })
        },
        error => {
          console.error(error)
          this.categoryForm.reset()
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao editar categoria!',
            life: 2500,
          })
        }
      )

    }

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

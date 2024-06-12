import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { CategoriesService } from './../../../../services/categories/categories.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Query } from '@angular/core';
import { GetCategoriesResponseInterface } from 'src/app/models/interfaces/categories/response/getCategories-response';
import { Subject, takeUntil } from 'rxjs';
import { CategoryEventInterface } from 'src/app/models/interfaces/categories/events/CategoryEvent-interface';
import { CategoriesFormComponent } from '../../components/categories-form/categories-form.component';

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
})
export class CategoriesHomeComponent implements OnInit,  OnDestroy {

  private readonly destroy$ = new Subject<void>();

  categories: Array<GetCategoriesResponseInterface> = []

  private ref!: DynamicDialogRef;

  constructor(
    private messageService : MessageService,
    private categoriesService: CategoriesService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.getAllCategories()
  }

  getAllCategories() {
    this.categoriesService.getAllCategories()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resp) => {
        if (resp.length > 0) {
          this.categories = resp
        }
      },
      error: (err) => {
        console.log(err)
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar categorias!',
          life: 2000,
        })
        this.router.navigate(['/dashboard'])
      }
    })
  }

  receivedEmit(event: CategoryEventInterface) {
    if (event.action) {
      this.ref = this.dialogService.open(CategoriesFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: {overflow: 'auto'},
        baseZIndex: 10000,
        data: {
          event: event,
          categoriesDatas: this.categories
        }
      });
      this.ref.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.getAllCategories()
      })
    }
  }

  receivedDeleteEmit(event: any) {
    if (event) {
      this.confirmationService.confirm({
        message: `Confirma a exclusão da categoria: ${event?.name}?`,
        header: 'Confirmação de Exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteCategory(event?.id)
      })
    }
  }

  deleteCategory(id: string) {
    if (id) {
      this.categoriesService.deleteCategory(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        resp => {
          if (resp != null) {
            this.getAllCategories();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Categoria removida com sucesso!',
              life: 2500
            })
          }
          this.getAllCategories();
        },
        err => {
          console.log(err)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Houve erro ao remover categoria!',
            life: 2500
          })
          this.getAllCategories();
        }
      )
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}

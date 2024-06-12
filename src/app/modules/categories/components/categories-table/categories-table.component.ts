import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoryEventEnum } from 'src/app/models/enums/categories/CategoryEvent-enum';
import { CategoryEventInterface } from 'src/app/models/interfaces/categories/events/CategoryEvent-interface';
import { GetCategoriesResponseInterface } from 'src/app/models/interfaces/categories/response/getCategories-response';

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
})
export class CategoriesTableComponent implements OnInit {

  @Input() public categories: Array<GetCategoriesResponseInterface> = []
  categorySelected!: GetCategoriesResponseInterface

  public addCategoryAction = CategoryEventEnum.ADD_PRODUCT;
  public editCategoryAction = CategoryEventEnum.EDIT_PRODUCT;

  @Output() actionTableEvent = new EventEmitter<{action: string, category?: any}>();
  @Output() deleteEvent = new EventEmitter<any>()

  constructor() { }

  ngOnInit(): void {
  }

  actionCategoryEventEmit(action: string, category?: CategoryEventInterface) {
    if (action && action !== '') {
      const categoryEventData = category ? {action, category} : {action}
      this.actionTableEvent.emit(categoryEventData)
    }
  }

  actionDeleteCategoryEmit(categoryData: {id: string, name: string}) {
    if (categoryData) {
      this.deleteEvent.emit(categoryData)
    }
  }

}

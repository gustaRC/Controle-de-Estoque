import { ProductsDataTransferService } from './../../../../shared/services/products/products-data-transfer.service';
import { MessageService } from 'primeng/api';
import { ProductsService } from './../../../../services/products/products.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/getAllProducts-reponse';
import { Subject, takeUntil } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
})
export class DashboardHomeComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  public productsList: Array<GetAllProductsResponse> = []

  public productsChartDatas!: ChartData;
  public productsChartOptions!: ChartOptions;


  constructor(
    private productsService: ProductsService,
    private messageService: MessageService,
    private productsDataTransferService : ProductsDataTransferService
  ) { }

  ngOnInit(): void {
    this.defineProducts()
  }

  defineProducts() {
    const chargedProducts = this.productsDataTransferService.getProducts()

    if(chargedProducts.length > 0) {
      this.productsList = chargedProducts
      this.setProductsChartGraphics();
    } else this.getProductsData()
  }

  getProductsData() {
    this.productsService.getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        products => {
          if (products.length > 0) {
            this.productsList = products
            this.productsDataTransferService.setProducts(this.productsList);
            this.setProductsChartGraphics();
          }
        },
        error => {
          console.log(error)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produtos!',
            life: 2000
          })
        }

      )
  }

  setProductsChartGraphics(): void {
    //SE EXISTIR PRODUTOS, MOSTRARÁ O GRÁFICO
    if (this.productsList.length > 0) {

      //DEFININDO CONSTANTES PARA DEFINIÇÃO DE CLASSES/ESTILIZAÇÕES
      const estilosDocumento = getComputedStyle(document.documentElement)
      const corTxt = estilosDocumento.getPropertyValue('--text-color')
      const corTxt2 = estilosDocumento.getPropertyValue('--text-color-secondary')
      const borda = estilosDocumento.getPropertyValue('--surface-border')

      //DEFININDO OS DADOS DO GRÁFICO
      this.productsChartDatas = {
        labels: this.productsList.map(el => el?.name),
        //datasets = VALORES/ESTILIZAÇÃO DOS DADOS QUE SERÃO MOSTRADOS
        datasets: [{
          data: this.productsList.map(el => el?.amount),
          label: 'Quantidade',
          backgroundColor: estilosDocumento.getPropertyValue('--indigo-400'),
          borderColor: estilosDocumento.getPropertyValue('--indigo-400'),
          hoverBackgroundColor: estilosDocumento.getPropertyValue('--indigo-500')
        }]
      }

      let maxNumber = 0
      this.productsList.forEach(el => {
        el.amount > maxNumber && (maxNumber = el.amount)
      });

      //DEFININDO AS OPÇÕES DO GRÁFICO
      this.productsChartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: {color: corTxt}
          }
        },
        scales: {
          x: {
            ticks: {color: corTxt2, font: {weight: '500'}},
            grid: {color: borda}
          },
          y: {
            ticks: {color: corTxt2},
            grid: {color: borda},
            //CALCULO DE PORCENTAGEM (20% do maxNumber)
            max: Math.round(maxNumber + ((20 * maxNumber) / 100))
          }
        }
      }

    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

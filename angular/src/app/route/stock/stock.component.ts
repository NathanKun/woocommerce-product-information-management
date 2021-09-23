import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Product} from '../../interface/Product';
import {ProductService} from '../../service/product.service';
import {AlertService} from '../../service/alert.service';
import {StockService} from '../../service/stock.service';
import {ProductWoo} from '../../interface/ProductWoo';
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements AfterViewInit {

  @ViewChild('skuInput') skuInput: ElementRef;
  @ViewChild('stockInput') stockInput: ElementRef;

  products: Product[] = []
  loading: Boolean = false
  product: ProductWoo = null
  inputText: string = null

  newStockControl = new FormControl('', [
    Validators.required, Validators.pattern(/^[0-9]{1,6}$/)
  ])

  constructor(
    private pdtApi: ProductService,
    private stockApi: StockService,
    private alertService: AlertService,) {
  }

  async ngAfterViewInit() {
    this.products = await this.pdtApi.getProducts()
    this.skuInput.nativeElement.focus();
  }

  getStock(sku: string) {
    if (!sku || sku.length == 0) return

    this.loading = true
    this.inputText = sku

    this.stockApi.getProduct(sku).subscribe(
      pdt => {
        this.product = pdt
        this.newStockControl.setValue(pdt.stock_quantity)
        this.skuInput.nativeElement.value = ''
        this.loading = false
        setTimeout(() => this.stockInput.nativeElement.focus(), 100)
      }, error => {
        this.alertService.error(error)
        this.product = null
        this.newStockControl.reset()
        this.loading = false
        setTimeout(() => this.skuInput.nativeElement.focus(), 100)
      }
    )
  }

  setStock(id: number, stock: number) {
    this.loading = true

    this.stockApi.setProductStock(id, stock).subscribe(
      pdt => {
        this.product = pdt
        this.newStockControl.setValue(pdt.stock_quantity)
        this.loading = false

        setTimeout(() => this.skuInput.nativeElement.focus(), 100)
      }, error => {
        this.loading = false
        this.alertService.error(error)
      }
    )
  }

  stockInputChange(stock: number) {

  }
}

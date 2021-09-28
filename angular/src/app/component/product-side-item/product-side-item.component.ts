import {Component, Input, OnInit, Output} from '@angular/core'
import {Category} from '../../interface/Category'
import {EventEmitter} from '@angular/core'
import {Product} from '../../interface/Product';

@Component({
  selector: 'app-product-side-item',
  templateUrl: './product-side-item.component.html',
  styleUrls: ['./product-side-item.component.scss']
})
export class ProductSideItemComponent {

  @Input() category: Category
  @Input() categoryIdToProductMap: Map<number, Product[]>
  @Output() selected = new EventEmitter<Product>()

  constructor() { }

  editOnClick(pdt: Product, event: MouseEvent) {
    event?.stopPropagation()
    this.selected.emit(pdt)
  }

  childEditOnClick(pdt: Product) {
    this.selected.emit(pdt)
  }
}

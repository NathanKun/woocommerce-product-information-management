import {Component, Input, Output} from '@angular/core'
import {Category} from '../../interface/Category'
import {EventEmitter} from '@angular/core'
import {Product} from '../../interface/Product';
import {ProductType} from '../../enumeration/ProductType';
import {animate, AUTO_STYLE, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-product-side-item',
  templateUrl: './product-side-item.component.html',
  styleUrls: ['./product-side-item.component.scss'],
  animations: [
  trigger('collapse', [
    state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
    state('true', style({ height: '0', visibility: 'hidden' })),
    transition('false => true', animate('300ms ease-in')),
    transition('true => false', animate('300ms ease-out'))
  ])
]
})
export class ProductSideItemComponent {

  @Input() category: Category
  @Input() categoryIdToProductMap: Map<number, Product[]>
  @Output() selected = new EventEmitter<Product>()
  @Output() toggle = new EventEmitter<Product>()

  Simple = ProductType.Simple
  Variable = ProductType.Variable
  Variation = ProductType.Variation

  constructor() { }

  editOnClick(pdt: Product, event: MouseEvent) {
    event?.stopPropagation()
    this.selected.emit(pdt)
  }

  childEditOnClick(pdt: Product) {
    this.selected.emit(pdt)
  }

  toggleOnClick(pdt: Product, event) {
    event?.stopPropagation()
    this.toggle.emit(pdt)
  }
}

import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, QueryList, ViewChildren} from '@angular/core'
import {Category} from '../../interface/Category'
import {Product} from '../../interface/Product';
import {ProductType} from '../../enumeration/ProductType';
import {animate, AUTO_STYLE, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-product-side-item',
  templateUrl: './product-side-item.component.html',
  styleUrls: ['./product-side-item.component.scss'],
  animations: [
    trigger('collapse', [
      state('false', style({height: AUTO_STYLE, visibility: AUTO_STYLE})),
      state('true', style({height: '0', visibility: 'hidden'})),
      transition('false => true', animate('300ms ease-in')),
      transition('true => false', animate('300ms ease-out'))
    ])
  ]
})
export class ProductSideItemComponent implements OnChanges {

  @Input() category: Category
  @Input() categoryIdToProductMap: Map<number, Product[]>
  @Output() selected = new EventEmitter<Product>()
  @Output() toggle = new EventEmitter<Product>()

  @ViewChildren('productMatListItem', {read: ElementRef}) productMatListItems: QueryList<ElementRef>;

  Simple = ProductType.Simple
  Variable = ProductType.Variable
  Variation = ProductType.Variation

  constructor() {
  }

  ngOnChanges() {
    const pdts = this.categoryIdToProductMap.get(this.category.id)
    if (pdts && pdts.length) {
      for (const pdt of pdts) {
        pdt.$highlight.subscribe(() => {
          pdt.highlight = true
          setTimeout(() => {
            pdt.highlight = false
          }, 3000)

          const ele = this.productMatListItems.toArray()
            .filter(ele => {
              return ele.nativeElement.getAttribute('pdt-id') == pdt.id
            })[0]
            .nativeElement

          setTimeout(() => ele.scrollIntoView({behavior: 'smooth', block: 'center'}), 300)
        })
      }
    }
  }

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

  categoryPanelExpandedChange(event) {
    this.category.expanded = event
  }
}

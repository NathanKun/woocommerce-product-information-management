import {Component, Input, OnInit, Output} from '@angular/core'
import {Category} from "../../interface/Category"
import {EventEmitter} from "@angular/core"

@Component({
  selector: 'app-category-side-item',
  templateUrl: './category-side-item.component.html',
  styleUrls: ['./category-side-item.component.scss']
})
export class CategorySideItemComponent implements OnInit {

  @Input() category: Category
  @Output() selected = new EventEmitter<Category>()

  constructor() { }

  ngOnInit(): void {
  }

  editOnClick(catg: Category, event: Event) {
    event?.stopPropagation()
    this.selected.emit(catg)
  }

  childEditOnClick(catg: Category) {
    this.selected.emit(catg)
  }
}

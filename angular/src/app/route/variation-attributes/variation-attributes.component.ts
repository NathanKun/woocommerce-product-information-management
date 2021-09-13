import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AlertService} from '../../service/alert.service';
import {SettingsService} from '../../service/settings.service';
import {NGXLogger} from 'ngx-logger';
import {MediaMatcher} from '@angular/cdk/layout';
import {Settings} from '../../interface/Settings';
import {VariationAttribute} from '../../interface/VariationAttribute';
import {VariationAttributeService} from '../../service/variation-attribute.service';
import {Category} from "../../interface/Category";

@Component({
  selector: 'app-variation-attributes',
  templateUrl: './variation-attributes.component.html',
  styleUrls: ['./variation-attributes.component.scss']
})
export class VariationAttributesComponent implements AfterViewInit, OnDestroy {

  settings: Settings

  variationAttributes: VariationAttribute[] = []
  selectedVariationAttribute: VariationAttribute = null
  editingNewVariationAttribute = false;

  mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  constructor(
    public dialog: MatDialog,
    private alertService: AlertService,
    private api: VariationAttributeService,
    private settingsService: SettingsService,
    private logger: NGXLogger,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 700px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  async ngAfterViewInit() {
    try {
      this.settings = await this.settingsService.getSettings()
    } catch (error) {
      this.logger.error('Can not load settings')
      this.alertService.error('加载配置失败')
    }

    this.loadData()
  }

  loadData() {
    this.api.getVariationAttributes().subscribe(
      res => {
        this.variationAttributes = res
        this.logger.debug(this.variationAttributes)

        // refresh the selected item
        if (this.selectedVariationAttribute != null) {
          let found = false
          for (let catg of this.variationAttributes) {
            if (catg.name === this.selectedVariationAttribute.name) {
              this.selectedVariationAttribute = catg
              found = true
              break;
            }
          }

          if (!found) {
            this.selectedVariationAttribute = null
          }
        }
      },
      error => {
        this.logger.error(error)
        this.alertService.error('出现错误。')
      }
    )
  }

  editOnClick(event: VariationAttribute) {
    this.editingNewVariationAttribute = false
    this.selectedVariationAttribute = event
  }

  addVariationAttributeOnClick() {
    this.editingNewVariationAttribute = true
    this.selectedVariationAttribute = {id: 0, name: '', terms: []}
  }

  saveButtonOnclick(attr: VariationAttribute) {
    if (this.editingNewVariationAttribute) {
      this.saveNewVariationAttribute(attr)
    } else {
      this.updateVariationAttribute(attr)
    }
  }

  deleteVariationAttribute(attr: VariationAttribute) {
    this.api.deleteVariationAttribute(attr).subscribe(
      this.handleSuccess, this.handleError
    )
  }

  private saveNewVariationAttribute(attr: VariationAttribute) {
    this.api.saveNewVariationAttribute(attr).subscribe(
      (res) => {
        this.alertService.success('创建成功。')
        this.editingNewVariationAttribute = false
        // set the returned created attr's id to selected attr, loadData fun will use the id to replace selectedVariationAttribute obj with a created one
        this.selectedVariationAttribute.id = Number(res)
        this.loadData()
      }, this.handleError
    )
  }

  private updateVariationAttribute(attr: VariationAttribute) {
    this.api.updateVariationAttribute(attr).subscribe(
      this.handleSuccess, this.handleError
    )
  }

  private handleSuccess = () => {
    this.loadData()
  }

  private handleError = error => {
    this.logger.error(error)
    this.alertService.error('出现错误。')
  }
}

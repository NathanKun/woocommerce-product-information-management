import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AlertService} from '../../service/alert.service';
import {SettingsService} from '../../service/settings.service';
import {NGXLogger} from 'ngx-logger';
import {MediaMatcher} from '@angular/cdk/layout';
import {Settings} from '../../interface/Settings';
import {VariationAttribute} from '../../interface/VariationAttribute';
import {VariationAttributeService} from '../../service/variation-attribute.service';

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

        // add missing term translation locale
        this.variationAttributes.forEach(attr =>
          attr.terms.forEach(term => {
            this.settings.pimLocaleOrderMap.forEach((_, lang) => {
              const found = term.translations.find(t => t.lang == lang)
              if (!found) {
                term.translations.push({lang: lang, translation: ''})
              }
            })

            // remove translation which is not in pimLocales
            term.translations = term.translations.filter(t => this.settings.pimLocaleOrderMap.has(t.lang))
          })
        )

        // sort term translation
        const localeOrderMap = new Map<string, number>()
        this.settings.pimLocales.forEach(l => {
          localeOrderMap.set(l.name, l.order)
        })
        this.variationAttributes.forEach(attr =>
          attr.terms.forEach(term => {
            term.translations.sort((t1, t2) => {
              const t1Order = this.settings.pimLocaleOrderMap.get(t1.lang)
              const t2Order = this.settings.pimLocaleOrderMap.get(t2.lang)
              return t1Order - t2Order
            })
          }))

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

  editOnClick(attr: VariationAttribute) {
    this.editingNewVariationAttribute = false
    this.selectedVariationAttribute = attr
  }

  addVariationAttributeOnClick() {
    this.editingNewVariationAttribute = true
    this.selectedVariationAttribute = {id: 0, name: '', terms: []}
  }

  addVariationAttributeTermOnClick() {
    const translations = this.settings.pimLocales.map(l => {
      return {
        lang: l.languageCode,
        translation: ''
      }
    })
    const term = {
      name: '',
      translations: translations
    }
    this.selectedVariationAttribute.terms.push(term)
  }

  deleteVariationAttributeTermOnClick(index: number) {
    this.selectedVariationAttribute.terms.splice(index, 1)
  }

  saveButtonOnclick(attr: VariationAttribute) {
    // check
    let check = true

    if (!attr.name || attr.name.length === 0) {
      check = false
    }

    if (attr.terms.length === 0) {
      check = false
    }

    attr.terms.forEach(term => {
      if (!term.name || term.name.length === 0) {
        check = false
      }
      term.translations.forEach(translation => {
        if (!translation.translation || translation.translation.length === 0) {
          check = false
        }
      })
    })

    if (!check) {
      this.alertService.error('有项目为空或无属性变量，无法保存。')
      return
    }

    if (new Set(attr.terms.map(t => t.name)).size < attr.terms.length) {
      check = false
    }

    if (!check) {
      this.alertService.error('有重复的项目名，无法保存。')
      return
    }

    const languageToTranslationSetMap = new Map<string, Set<string>>();
    for (const term of attr.terms) {
      for (const t of term.translations) {
        t.translation = t.translation.trim()

        let langList: Set<string> = languageToTranslationSetMap.get(t.lang)
        if (langList == null) {
          langList = new Set<string>()
        }
        langList.add(t.translation.toLowerCase())
        languageToTranslationSetMap.set(t.lang, langList)
      }
    }

    for (const [lang, translationSet] of languageToTranslationSetMap) {
      if (translationSet.size !== attr.terms.length) {
        this.alertService.error('有重复的翻译，无法保存。同语种内不可以有相同的翻译。')
        return
      }
    }

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
        this.editingNewVariationAttribute = false
        // set the returned created attr's id to selected attr, loadData fun will use the id to replace selectedVariationAttribute obj with a created one
        this.selectedVariationAttribute.id = Number(res)
        this.loadData()
        this.alertService.success('创建成功。')
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
    this.alertService.success('操作成功。')
  }

  private handleError = error => {
    this.logger.error(error)
    this.alertService.error('出现错误。')
  }
}

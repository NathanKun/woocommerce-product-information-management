import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {PwaUpdateService} from './service/pwaupdate.service';
import {NGXLogger} from 'ngx-logger';
import {MediaMatcher} from '@angular/cdk/layout';
import {SideNavItem} from './interface/SideNavItem';
import {SettingsService} from './service/settings.service';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {Svg} from './util/Svg';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {

  sideNavItems: SideNavItem[] = [
    {name: '主页', route: '/home'},
    {name: '类别', route: '/categories'},
    {name: '产品', route: '/products'},
    {name: '库存', route: '/stock'},
    {name: '设置', route: '/settings'},
    {name: '产品属性变量', route: '/variation-attributes'},
    {name: '导出', route: '/export'},
  ];

  mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  constructor(
    private pwaUpdateService: PwaUpdateService,
    private settingsService: SettingsService,
    private logger: NGXLogger,
    private matIconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    pwaUpdateService.subscribeAvailable();
    settingsService.getSettings().then((res) => this.logger.info(res))

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);

    this.matIconRegistry.addSvgIconLiteral(
      `barcode`,
      sanitizer.bypassSecurityTrustHtml(Svg.BARCODE)
    );
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}

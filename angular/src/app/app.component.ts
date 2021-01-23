import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {PwaUpdateService} from './service/pwaupdate.service';
import {NGXLogger} from 'ngx-logger';
import {MediaMatcher} from '@angular/cdk/layout';
import {SideNavItem} from './interface/SideNavItem';
import {SettingsService} from "./service/settings.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  mobileQuery: MediaQueryList;

  sideNavItems: SideNavItem[] = [
    {name: '主页', route: '/home'},
    {name: '类别', route: '/categories'},
    {name: '产品', route: '/products'},
    {name: '设置', route: '/settings'},
  ];

  private readonly _mobileQueryListener: () => void;

  constructor(
    private pwaUpdateService: PwaUpdateService,
    private settingsService: SettingsService,
    private logger: NGXLogger,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    pwaUpdateService.subscribeAvailable();
    settingsService.getSettings().then((res) => this.logger.info(res))

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}

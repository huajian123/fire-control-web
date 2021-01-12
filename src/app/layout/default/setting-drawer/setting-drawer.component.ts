import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';
import {SettingInterface, ThemeService} from '../../../core/services/store/theme.service';

interface NormalModel {
  image?: string;
  title: string;
  isChecked: boolean;
}

interface Theme extends NormalModel {
  key: 'dark' | 'light' | 'night';
}

interface Color extends NormalModel {
  key: string;
  color: string;
}

interface Mode extends NormalModel {
  key: 'side' | 'top';
}


@Component({
  selector: 'app-setting-drawer',
  templateUrl: './setting-drawer.component.html',
  styleUrls: ['./setting-drawer.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingDrawerComponent implements OnInit, OnDestroy {
  private destory$ = new Subject<void>();
  themesOptions$ = this.themesService.getThemesMode();
  isNightTheme$ = this.themesService.getIsNightTheme();
  _isNightTheme = false;
  _themesOptions: SettingInterface = {
    theme: 'dark',
    color: 'daybreak',
    mode: 'side',
    fixedWidth: false,
    colorWeak: false
  };
  isCollapsed = false;


  themes: Theme[] = [
    {
      key: 'dark',
      image: '/assets/imgs/theme-dark.svg',
      title: '暗色菜单风格',
      isChecked: true,
    },
    {
      key: 'light',
      image: '/assets/imgs/theme-light.svg',
      title: '亮色菜单风格',
      isChecked: false,
    },
    {
      key: 'night',
      image: '/assets/imgs/theme-dark.svg',
      title: '黑夜模式风格',
      isChecked: false,
    },
  ];
  colors: Color[] = [
    {
      key: 'dust',
      color: '#F5222D',
      title: '薄暮',
      isChecked: false
    },
    {
      key: 'volcano',
      color: '#FA541C',
      title: '火山',
      isChecked: false
    },
    {
      key: 'sunset',
      color: '#FAAD14',
      title: '日暮',
      isChecked: false
    },
    {
      key: 'cyan',
      color: '#13C2C2',
      title: '明青',
      isChecked: false
    },
    {
      key: 'green',
      color: '#52C41A',
      title: '极光绿',
      isChecked: false
    },
    {
      key: 'daybreak',
      color: '#1890FF',
      title: '拂晓蓝（默认）',
      isChecked: true
    },
    {
      key: 'geekblue',
      color: '#2F54EB',
      title: '极客蓝',
      isChecked: false
    },
    {
      key: 'purple',
      color: '#722ED1',
      title: '酱紫',
      isChecked: false
    },
  ];
  modes: Mode[] = [
    {
      key: 'side',
      image: '/assets/imgs/menu-side.svg',
      title: '侧边菜单布局',
      isChecked: true
    },
    {
      key: 'top',
      image: '/assets/imgs/menu-top.svg',
      title: '顶部菜单布局',
      isChecked: false,
    }
  ];
  layouts = [
    {
      key: 'fixedWidth',
      title: '固定宽度',
      disabled(setting: { mode: string; }): boolean {
        return setting.mode === 'side';
      }
    }
  ];

  constructor(private themesService: ThemeService, @Inject(DOCUMENT) private doc: Document) {
  }

  @HostListener('click', ['$event'])
  onClicked(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  // 切换到黑暗主题
  changeThemeToNight(): void {
    this.addCss('./assets/themes/style.dark.css', 'dark-theme');
  }

  addCss(path: string, id: string): void {
    const doms = this.doc.getElementById(id);
    if (doms) {
      return;
    }
    const themeUrl = path;
    // create new link element
    const style = this.doc.createElement('link') as HTMLLinkElement;
    // put the link into the document head
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.id = id;
    style.href = themeUrl;
    this.doc.body.appendChild(style);
  }

  removeCss(select: string): void {
    const doms = this.doc.querySelectorAll(select);
    if (doms && doms.length > 0) {
      doms.forEach((dom) => dom.remove());
    }
  }

  removeNightTheme(): void {
    this.removeCss('#dark-theme');
  }

  // 切换主题色
  changePrimaryColor(colorItem: Color): void {
    this.selOne(colorItem, this.colors);
    this.addCss('./assets/themes/style.red.css', 'primary-red');
  }

  // 选择一个isChecked为true,其他为false
  selOne(item: NormalModel, itemArray: NormalModel[]): void {
    itemArray.forEach((_item) => _item.isChecked = false);
    item.isChecked = true;
  }


  changeMode(mode: Mode): void {
    this.selOne(mode, this.modes);
    this.themesService.setIsCollapsed(false);
    this._themesOptions.mode = mode.key;
    this.themesService.setThemesMode(this._themesOptions);
  }

  // 切换主题
  changeTheme(themeItem: Theme): void {
    this.selOne(themeItem, this.themes);
    if (themeItem.key === 'night') {
      this.changeThemeToNight();
      this._themesOptions.theme = 'dark';
      this.themesService.setIsNightTheme(true);
    } else {
      this.removeNightTheme();
      this._themesOptions.theme = themeItem.key;
      this.themesService.setIsNightTheme(false);
    }
    this.themesService.setThemesMode(this._themesOptions);
  }

  ngOnInit(): void {
    this.themesOptions$.pipe(takeUntil(this.destory$)).subscribe((res: SettingInterface) => this._themesOptions = res);
    // this.isNightTheme$.pipe(takeUntil(this.destory$)).subscribe((res: boolean) => this._isNightTheme = res);
  }

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }
}

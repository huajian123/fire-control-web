import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Input} from '@angular/core';
import {filter, map, mergeMap, tap} from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {TabService} from '../../../core/services/tab.service';
import {ThemeService} from '../../../core/services/store/theme.service';
import {Subscription} from 'rxjs';
import * as _ from 'lodash';

interface Menu {
  path?: string;
  title: string;
  icon?: string;
  open?: boolean;
  selected?: boolean;
  children?: Menu[];
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent implements OnInit, OnDestroy {
  menus: Menu[] = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      open: false,
      selected: false,
      children: [
        {
          title: '分析页',
          open: false,
          selected: false,
          path: '/default/dashboard/analysis',
        },
        {
          title: '监控页',
          open: false,
          selected: false,
          path: '/default/dashboard/monitor',
        },
        {
          title: '工作台',
          open: false,
          selected: false,
          path: '/default/dashboard/workbench',
        },
      ]
    },
    {
      title: '表单页',
      icon: 'form',
      open: false,
      selected: false,
      children: [
        {
          title: '基础表单',
          open: false,
          selected: false,
          path: '/default/form/base',
        },
        {
          title: '分布表单',
          open: false,
          selected: false,
          path: '/default/form/step',
        },
        {
          title: '高级表单',
          open: false,
          selected: false,
          path: '/default/form/advanced',
        },
      ]
    },
    {
      title: '列表页',
      icon: 'table',
      open: false,
      selected: false,
      children: [
        {
          title: '搜索列表',
          open: false,
          selected: false,
          path: '',
          children: [
            {
              title: '搜索列表(文章）',
              open: false,
              selected: false,
              path: '',
            },
            {
              title: '搜索列表(项目)',
              open: false,
              selected: false,
              path: '',
            },
            {
              title: '搜索列表(应用)',
              open: false,
              selected: false,
              path: '',
            },
          ]
        },
        {
          title: '查询表格',
          open: false,
          selected: false,
          path: '',
        },
        {
          title: '标准表格',
          open: false,
          selected: false,
          path: '',
        },
        {
          title: '卡片列表',
          open: false,
          selected: false,
          path: '',
        },
      ]
    },
    {
      title: '详情页',
      icon: 'profile',
      open: false,
      selected: false,
      children: [
        {
          title: '基础详情页',
          open: false,
          selected: false,
          path: '',
        },
        {
          title: '高级详情页',
          open: false,
          selected: false,
          path: '',
        },
      ]
    },
    {
      title: '结果页',
      icon: 'check-circle',
      open: false,
      selected: false,
      children: [
        {
          title: '成功页',
          open: false,
          selected: false,
          path: '',
        },
        {
          title: '失败页',
          open: false,
          selected: false,
          path: '',
        },
      ]
    },
    {
      title: '异常页',
      icon: 'warning',
      open: false,
      selected: false,
      children: [
        {
          title: '403',
          open: false,
          selected: false,
          path: '',
        },
        {
          title: '404',
          open: false,
          selected: false,
          path: '',
        },
        {
          title: '500',
          open: false,
          selected: false,
          path: '',
        },
      ]
    },
    {
      title: '个人页',
      icon: 'user',
      open: false,
      selected: false,
      children: [
        {
          title: '个人中心',
          open: false,
          selected: false,
          path: '',
        },
        {
          title: '个人设置',
          open: false,
          selected: false,
          path: '',
        },
      ]
    },
    {
      title: '图形编辑器',
      icon: 'highlight',
      open: false,
      selected: false,
      children: [
        {
          title: '流程编辑器',
          open: false,
          selected: false,
          path: '',
        },
        {
          title: '脑图编辑器',
          open: false,
          selected: false,
          path: '',
        },
        {
          title: '拓扑编辑器',
          open: false,
          selected: false,
          path: '',
        },
      ]
    },
  ];
  routerPath = '';
  themesOptions$ = this.themesService.getThemesMode();
  isCollapsed$ = this.themesService.getIsCollapsed();
  isCollapsed = false;
  subs: Array<Subscription> = [];
  copyMenus: Menu[] = _.cloneDeep(this.menus);

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private tabService: TabService,
              private cdr: ChangeDetectorRef, private themesService: ThemeService) {
    this.routerPath = this.router.url;
    this.subs[0] = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap(() => {
          // todo
          // @ts-ignore
          this.routerPath = this.activatedRoute.snapshot['_routerState'].url;
          this.clickMenuItem(this.menus);
          this.clickMenuItem(this.copyMenus);
          // 是折叠的菜单
          if (this.isCollapsed) {
            this.closeMenuOpen(this.menus);
          } else {
           // this.menus = this.copyMenus;
          }
        }),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => {
          return route.outlet === 'primary';
        }),
        mergeMap((route) => {
          return route.data;
        }),
      )
      .subscribe((routeData) => {
        this.tabService.addTab({title: routeData['title'], path: this.routerPath});
        this.tabService.findIndex(this.routerPath);
      });
  }

  clickMenuItem(menus: Menu[]): void {
    if (!menus) {
      return;
    }
    const index = this.routerPath.indexOf('?') === -1 ? this.routerPath.length : this.routerPath.indexOf('?');
    const routePath = this.routerPath.substring(0, index);
    for (const item of menus) {
      item.open = false;
      item.selected = false;
      // 一级菜单
      if (!item.children || item.children.length === 0) {
        if (item.path === routePath) {
          item.selected = true;
        }
        continue;
      }
      // 二级菜单
      for (const subItem of item.children) {
        subItem.selected = false;
        subItem.open = false;
        if (!subItem.children || subItem.children?.length === 0) {
          if (subItem.path === routePath) {
            item.open = true;
            item.selected = true;
            subItem.selected = true;
            subItem.open = true;
          }
          continue;
        }
        for (const thirdItem of subItem.children) {
          if (thirdItem.path === routePath) {
            item.open = true;
            item.selected = true;
            subItem.selected = true;
            subItem.open = true;
            thirdItem.open = true;
            thirdItem.selected = true;
          } else {
            thirdItem.open = false;
            thirdItem.selected = false;
          }
        }
      }
    }
    this.cdr.markForCheck();
  }

  // 改变当前菜单展示状态
  changeOpen(currentMenu: Menu, allMenu: Menu[]): void {
    allMenu.forEach((item) => {
      item.open = false;
    });
    currentMenu.open = true;
  }

  closeMenuOpen(menus: Menu[]): void {
    menus.forEach(menu => {
      menu.open = false;
      if (menu.children && menu.children.length > 0) {
        this.closeMenuOpen(menu.children);
      } else {
        return;
      }
    });
  }

  // 监听折叠菜单事件
  subIsCollapsed(): void {
    this.isCollapsed$.subscribe(isCollapsed => {
      this.isCollapsed = isCollapsed;
      // 菜单展开
      if (!this.isCollapsed) {
        this.menus = _.cloneDeep(this.copyMenus);
        this.clickMenuItem(this.menus);
      } else { // 菜单收起
        this.copyMenus = _.cloneDeep(this.menus);
        this.closeMenuOpen(this.menus);
      }
      this.cdr.markForCheck();
    });
  }


  ngOnInit(): void {
    this.subIsCollapsed();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}

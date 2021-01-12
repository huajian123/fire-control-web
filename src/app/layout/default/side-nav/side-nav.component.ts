import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnDestroy} from '@angular/core';
import {filter, map, mergeMap, tap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ThemeService} from '../../../core/services/store/theme.service';
import {TabService} from '../../../core/services/tab.service';



@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavComponent implements OnInit {

  themesOptions$ = this.themesService.getThemesMode();
  @Input() isCollapsed = false;


  constructor(private router: Router, private activatedRoute: ActivatedRoute, private tabService: TabService,
              private cdr: ChangeDetectorRef, private themesService: ThemeService) {

  }



  ngOnInit(): void {
  }

}

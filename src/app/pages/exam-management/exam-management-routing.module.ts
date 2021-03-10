import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  /*{path: 'role-manage', loadChildren: () => import('./role-manage/role-manage.module').then(m => m.RoleManageModule)},
  {path: 'user-manage', loadChildren: () => import('./user-manage/user-manage.module').then(m => m.UserManageModule)},*/
  {path: 'question-bank', loadChildren: () => import('./question-bank/question-bank.module').then(m => m.QuestionBankModule)},
  {path: '', redirectTo: 'question-bank', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamManagementRoutingModule {
}

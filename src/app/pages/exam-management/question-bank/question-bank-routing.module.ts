import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {QuestionBankComponent} from './question-bank.component';

const routes: Routes = [
  {path: '', component: QuestionBankComponent, data: {title: '题库管理', key: 'question-bank'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionBankRoutingModule {
}

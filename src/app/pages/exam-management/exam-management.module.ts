import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ExamManagementRoutingModule} from './exam-management-routing.module';
import {QuestionBankComponent} from './question-bank/question-bank.component';


@NgModule({
  declarations: [QuestionBankComponent],
  imports: [
    CommonModule,
    ExamManagementRoutingModule
  ]
})
export class ExamManagementModule {
}

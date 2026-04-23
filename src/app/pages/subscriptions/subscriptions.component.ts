import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, _ } from '@ngx-translate/core';
import { BaseIndexComponent } from 'src/app/shared/components/basic-crud/base-index.component';
import { TableWrapperComponent } from 'src/app/shared/components/table-wrapper/table-wrapper.component';
import { LangService } from 'src/app/shared/services/lang.service';
import { Subscription } from './services/service-type';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [TranslateModule, TableWrapperComponent, FormsModule],
  templateUrl: './subscriptions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SubscriptionComponent extends BaseIndexComponent<Subscription> {
  currentLang = inject(LangService).currentLanguage;

  ngOnInit() {
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: 'packages/subscriptions',
        delete: 'packages/subscriptions/delete',
      },
      indexTitle: this.translate.instant(_('Subscription')),
      createBtnLabel: this.translate.instant(_('Create Subscription')),
      indexIcon: 'fa-solid fa-bell',
      indexTableKey: 'SUBSCRIPTION_KEY',
      columns: [
        {
          name: 'id',
          title: 'id',
          searchable: false,
          orderable: false,
        },
        {
          name: `package.name_${this.currentLang()}`,
          title: 'package',
          searchable: true,
          orderable: true,
        },
        {
          name: 'subscriber_type',
          title: 'subscriber_type',
          searchable: false,
          orderable: false,
        },
        {
          name: `user.username`,
          title: 'subscriber',
          searchable: true,
        },
        {
          name: `status`,
          title: 'status',
          searchable: true,
        },
        {
          name: 'start_date',
          title: 'start date',
          type: 'date',
          searchable: false,
        },
        {
          name: 'end_date',
          title: 'end date',
          type: 'date',
          searchable: false,
        },
        {
          name: 'amount',
          title: 'amount',
          searchable: true,
        },
      ],
    };
  }
}

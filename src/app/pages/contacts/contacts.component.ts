import {
  ChangeDetectionStrategy,
  Component,
  inject,
  TemplateRef,
  viewChild,
} from '@angular/core';

import { _, TranslatePipe } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { BaseIndexComponent } from 'src/app/shared/components/basic-crud/base-index.component';
import { TableWrapperComponent } from 'src/app/shared/components/table-wrapper/table-wrapper.component';
import { LangService } from 'src/app/shared/services/lang.service';
import { Contact } from './services/service-type';

@Component({
  selector: 'app-contacts',
  imports: [TableWrapperComponent, TooltipModule, ButtonModule, TranslatePipe],
  templateUrl: './contacts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContactsComponent extends BaseIndexComponent<Contact> {
  currentLang = inject(LangService).currentLanguage;
  confirmationService = inject(ConfirmationService);

  message = viewChild.required<TemplateRef<any>>('message');

  showMessage(message: string) {
    this.confirmationService.confirm({
      message: message,
      header: this.translate.instant(_('message')),
      icon: 'fa-solid fa-envelope',
      acceptVisible: false,
      rejectVisible: false,
      rejectButtonStyleClass: 'p-button-text',
    });
  }
  ngOnInit() {
    this.indexMeta = {
      ...this.indexMeta,
      indexTitle: 'contacts',
      indexIcon: 'fa-solid fa-envelope',
      endpoints: {
        index: 'contact-us/contact-us',
        delete: 'contact-us/contact-us/delete',
      },
      indexTableKey: 'CONTACT_KEY',
      columns: [
        {
          title: 'id',
          name: 'id',
        },
        {
          title: 'name',
          name: `name`,
        },
        {
          name: 'phone',
          title: 'phone',
          searchable: true,
          orderable: false,
        },
        {
          name: 'email',
          title: 'email',
          searchable: true,
          orderable: false,
        },
        {
          name: 'created_at',
          title: 'created_at',
          type: 'date',
          searchable: false,
          orderable: false,
        },
        {
          name: 'message',
          title: 'message',
          render: this.message(),
          searchable: true,
          orderable: false,
        },
      ],
    };
  }
}

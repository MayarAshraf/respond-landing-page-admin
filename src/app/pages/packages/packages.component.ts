import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, _ } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { BaseIndexComponent } from 'src/app/shared/components/basic-crud/base-index.component';
import { TableWrapperComponent } from 'src/app/shared/components/table-wrapper/table-wrapper.component';
import { LangService } from 'src/app/shared/services/lang.service';
import { PackageDialogComponent } from './package-dialog.component';
import { Package } from './services/service-type';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [TranslateModule, TableWrapperComponent, ButtonModule, RouterLink],
  templateUrl: './packages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PackagesComponent extends BaseIndexComponent<Package> {
  currentLang = inject(LangService).currentLanguage;
  ngOnInit() {
    this.dialogComponent = PackageDialogComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: 'packages/packages',
        delete: 'packages/packages/delete',
      },
      indexTitle: this.translate.instant(_('Packages')),
      createBtnLabel: this.translate.instant(_('Create Package')),
      indexIcon: 'fa-solid fa-box',
      indexTableKey: 'PACKAGE_KEY',
      columns: [
        {
          name: 'id',
          title: this.#translate(_('#ID')),
          searchable: false,
          orderable: false,
        },
        {
          name: 'order',
          title: this.#translate(_('Order')),
          searchable: false,
          orderable: false,
        },
        {
          name: `name_${this.currentLang()}`,
          title: this.#translate(_('name')),
          searchable: true,
          orderable: false,
        },
        {
          name: 'slug',
          title: this.#translate(_('slug')),
          searchable: true,
          orderable: false,
        },
        {
          name: 'price',
          title: this.#translate(_('price')),
          searchable: true,
          orderable: true,
        },
        {
          name: 'discount',
          title: this.#translate(_('Discount')),
          searchable: false,
          orderable: false,
        },
        {
          name: 'final_price',
          title: this.#translate(_('final price')),
          searchable: false,
          orderable: false,
        },
        {
          name: 'duration',
          title: this.#translate(_('Duration')),
          searchable: true,
          orderable: false,
        },
        {
          name: 'ad_limit_per_month',
          title: this.#translate(_('Add Limit')),
          searchable: false,
          orderable: false,
        },
      ],
    };
  }

  #translate(text: string) {
    return this.translate.instant(text);
  }
}

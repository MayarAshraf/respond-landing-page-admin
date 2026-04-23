import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateModule, _ } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { BaseCreateUpdateComponent } from 'src/app/shared/components/basic-crud/base-create-update/base-create-update.component';
import { FormDialogComponent } from 'src/app/shared/components/basic-crud/base-create-update/form-dialog/form-dialog.component';
import { StaticDataService } from 'src/app/shared/services/static-data.service';
import { PackageItemModel } from '../services/service-type';

@Component({
  selector: 'app-package-item-dialog',
  standalone: true,
  imports: [TranslateModule, ButtonModule, FormDialogComponent],
  templateUrl:
    '../../../shared/components/basic-crud/base-create-update/base-create-update.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackageItemDialogComponent extends BaseCreateUpdateComponent<any> {
  #languages = inject(StaticDataService).languages;

  ngOnInit() {
    if (this.editData && this.editData.isNew && !this.editData.id) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Add Package Item')),
        submitButtonLabel: this.translate.instant(_('Add Package Item')),
      };
      this.model = new PackageItemModel();
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Update Package Item')),
        submitButtonLabel: this.translate.instant(_('Update Package Item')),
      };
      this.model = new PackageItemModel(this.editData);
    }

    this.fields = [
      {
        type: 'tabs-field',
        fieldGroup: this.#languages.map((lang) => ({
          props: {
            label: `${lang.label} (${lang.value.toUpperCase()})`,
          },
          fieldGroup: this.#BuildLangFields(lang.value),
        })),
      },
    ];
  }

  #BuildLangFields(lang: string): FormlyFieldConfig[] {
    return [
      {
        fieldGroup: [
          this.fieldBuilder.fieldBuilder([
            {
              key: `name_${lang}`,
              type: 'floated-input-field',
              className: 'col-12 md:col-6',
              props: {
                label: _(`title`),
                required: lang === 'en',
                placeholder: _(`title`),
              },
            },
          ]),
          this.fieldBuilder.fieldBuilder([
            {
              key: `description_${lang}`,
              type: 'textarea-field',
              props: {
                label: _(`description`),
                placeholder: _(`description`),
              },
            },
          ]),
        ],
      },
    ];
  }

  override createUpdateRecord({}) {
    if (this.createUpdateForm.invalid) return;
    const id =
      this.editData && this.editData.isNew && !this.editData.id
        ? Date.now()
        : this.model.id;

    this.dialogRef.close({
      ...this.model,
      id,
      isNew: this.editData.isNew ?? false,
    });
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateModule, _ } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { distinctUntilChanged, map, tap } from 'rxjs';
import { BaseCreateUpdateComponent } from 'src/app/shared/components/basic-crud/base-create-update/base-create-update.component';
import { FormDialogComponent } from 'src/app/shared/components/basic-crud/base-create-update/form-dialog/form-dialog.component';
import { FieldBuilderService } from 'src/app/shared/services/field-builder.service';
import { LangService } from 'src/app/shared/services/lang.service';
import { LookupsService } from 'src/app/shared/services/lookups.service';
import { SlugInputService } from 'src/app/shared/services/slug-input.service';
import { StaticDataService } from 'src/app/shared/services/static-data.service';
import { PackageItemDialogComponent } from './package-item-dialog/package-item-dialog.component';
import { PackageItemModel, PackageModel } from './services/service-type';

@Component({
  selector: 'app-package-dialog',
  standalone: true,
  templateUrl:
    '../../shared/components/basic-crud/base-create-update/base-create-update.component.html',
  imports: [TranslateModule, ChipModule, ButtonModule, FormDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackageDialogComponent extends BaseCreateUpdateComponent<PackageModel> {
  #fieldBuilder = inject(FieldBuilderService);
  #languages = inject(StaticDataService).languages;
  #langService = inject(LangService);
  currentLang = inject(LangService).currentLanguage;
  #slugField = inject(SlugInputService);
  #lookups = inject(LookupsService);
  dialogService = inject(DialogService);
  dialogPackageRef: DynamicDialogRef | null = null;

  chips = signal<any[]>([]);

  protected configDialog: DynamicDialogConfig<PackageModel> = {
    showHeader: false,
    width: '800px',
    height: '100%',
    modal: true,
    focusOnShow: false,
    styleClass: 'm-0 max-h-full transform-none',
    position: this.#langService.currentLanguage() === 'en' ? 'right' : 'left',
    rtl: this.#langService.currentLanguage() !== 'en',
    closable: true,
    closeOnEscape: true,
    dismissableMask: false,
  };

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      dialogData$: this.#lookups.getLookupsList('currencies'),
      endpoints: {
        store: 'packages/packages',
        update: 'packages/packages/update',
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Update Package')),
        submitButtonLabel: this.translate.instant(_('Update Package')),
      };
      this.model = new PackageModel(this.editData, this.currentLang());
      this.chips.set(this.editData.package_items_info);
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Create Package')),
        submitButtonLabel: this.translate.instant(_('Create Package')),
      };
      this.model = new PackageModel();
    }
    this.#updateFields();
  }

  #updateFields() {
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: 'order',
          type: 'floated-input-field',
          props: {
            type: 'number',
            label: _('order'),
            min: 0,
          },
        },
        this.#slugField.getSlugField(),
        {
          key: 'currency_id',
          type: 'select-field',
          resetOnHide: false,
          defaultValue: 55,
          props: {
            isFloatedLabel: true,
            required: true,
            label: _('Select currency'),
            placeholder: _('Select currency'),
            options: this.#lookups.getLookupsList('currencies').pipe(
              map((data) =>
                data.map((item: any) => ({
                  label: item.slug,
                  value: item.id,
                })),
              ),
            ),
          },
        },
      ]),
      {
        template: `<div class="border-1 border-200 mb-3"></div>`,
      },
      {
        type: 'tabs-field',
        fieldGroup: this.#languages.map((lang) => ({
          props: {
            label: `${lang.label} (${lang.value.toUpperCase()})`,
          },
          fieldGroup: this.#BuildLangFields(lang.value),
        })),
      },
      {
        template: `<div class="border-1 border-200 mb-3"></div>`,
      },
      this.#fieldBuilder.fieldBuilder(
        [
          {
            key: 'package_items_info',
            type: 'autocomplete-field',
            className: 'md:col-6 col-11',
            props: {
              multiple: true,
              placeholder: _('Select Packages'),
              label: _('Select Packages'),
              endpoint: `packages/autocomplete-items`,
              fieldKey: 'package_item_ids',
            },
            hooks: {
              onInit: (field) => {
                return field.formControl?.valueChanges.pipe(
                  tap((data) => {
                    this.chips.update((items) => {
                      // for watch delete item for chip
                      const updatedItems = items.filter(
                        (item) =>
                          item.isNew ||
                          data.some((i: any) => i.value === item.id),
                      );

                      // for watch new item for chip
                      data.forEach((dataItem: any) => {
                        const isNewItem = !updatedItems.some(
                          (item) => item.id === dataItem.value,
                        );

                        if (isNewItem) {
                          updatedItems.push({
                            ...new PackageItemModel({
                              id: dataItem.value,
                              name_en: dataItem.label_en,
                              name_ar: dataItem.label_ar,
                              description_en: dataItem.description_en,
                              description_ar: dataItem.description_en,
                            }),
                          });
                        }
                      });

                      return updatedItems;
                    });
                  }),
                );
              },
            },
          },
          { key: 'package_items' },
          { key: 'package_item_ids' },
          {
            type: 'button-field',
            className: 'col-1',
            props: {
              tooltip: this.translate.instant(_('Add package Item')),
              type: 'button',
              buttonIcon: 'fa-solid fa-plus',
              buttonClass:
                'w-full p-button-outlined p-button-sm p-button-plain field-height',
              onClick: () => {
                this.dialogPackageRef = this.dialogService.open(
                  PackageItemDialogComponent,
                  {
                    ...this.configDialog,
                    data: {
                      isNew: true,
                    },
                  },
                );

                this.dialogPackageRef?.onClose
                  .pipe(takeUntilDestroyed(this.destroyRef))
                  .subscribe((chip: PackageModel) => {
                    if (!chip) return;
                    this.chips.update((chips) => [...chips, chip]);
                  });
              },
            },
          },
        ],
        'grid align-items-center',
      ),
      {
        type: 'chip-field',
        props: {
          chips: this.chips,
          accessTitle: `name_${this.currentLang()}`,
          icon: 'fa-solid fa-box',
          title: this.translate.instant(_('Package Items')),
          onUpdate: (chip: PackageItemModel, field: FormlyFieldConfig) => {
            this.dialogPackageRef = this.dialogService.open(
              PackageItemDialogComponent,
              { ...this.configDialog, data: chip },
            );

            this.dialogPackageRef?.onClose
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe((chip: PackageModel) => {
                if (!chip) return;

                const packageItemsInfoField = this.getField(
                  'package_items_info',
                  field,
                );

                const packageItemsIdsField = this.getField(
                  'package_item_ids',
                  field,
                );

                this.chips.update((chips) =>
                  chips.map((item) =>
                    item.id === chip.id ? { ...item, ...chip } : item,
                  ),
                );

                // watch for update autocomplete items
                if (
                  packageItemsIdsField?.value &&
                  packageItemsIdsField?.value.includes(chip.id)
                ) {
                  packageItemsInfoField?.setValue(
                    this.chips()
                      .filter((item) => !item.isNew)
                      .map((item) => {
                        return {
                          label: item[`name_${this.currentLang()}`],
                          value: item.id,
                        };
                      }),
                  );
                }
              });
          },
          onRemove: (id: number, field: FormlyFieldConfig) => {
            const packageItemsIdsField = this.getField(
              'package_item_ids',
              field,
            );
            const packageItemsInfoField = this.getField(
              'package_items_info',
              field,
            );

            this.chips.update((chips) => chips.filter((i) => i.id !== id));

            // watch for delete autocomplete items
            if (
              packageItemsIdsField?.value &&
              packageItemsIdsField?.value.includes(id)
            ) {
              packageItemsIdsField.setValue(
                packageItemsIdsField.value?.filter((i: any) => i !== id),
              );
              packageItemsInfoField?.setValue(
                packageItemsInfoField.value.filter((i: any) => i.value !== id),
              );
            }
          },
        },
      },
      this.#fieldBuilder.fieldBuilder([
        {
          key: 'ad_limit_per_month',
          type: 'input-group-field',
          props: {
            required: true,
            type: 'number',
            placeholder: _('ads limit'),
            flagGroup: this.translate.instant(_('Month')),
          },
        },
        {
          key: 'duration',
          type: 'input-group-field',
          props: {
            required: true,
            type: 'number',
            placeholder: _('duration'),
            flagGroup: this.translate.instant(_('Month')),
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: 'price',
          type: 'floated-input-field',
          props: {
            required: true,
            type: 'number',
            label: _('Price'),
            min: 0,
          },
        },
        {
          key: 'discount',
          type: 'input-group-field',
          props: {
            type: 'number',
            placeholder: _('Discount'),
            flagGroup: '%',
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: 'featured_units_number',
          type: 'floated-input-field',
          className: 'col-12 md:col-6',
          props: {
            type: 'number',
            label: _('featured units number'),
            placeholder: _('featured units number'),
          },
        },
      ]),
    ];
  }

  override updateModel() {
    const packageItems = this.chips().map((item: any) => {
      const { id, isNew, ...rest } = item;
      return isNew ? rest : { id, ...rest };
    });

    return (this.model = {
      ...this.model,
      package_items: packageItems,
    });
  }

  getField(key: string, field: FormlyFieldConfig) {
    return field?.form?.get?.(key);
  }

  #BuildLangFields(lang: string): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: `name_${lang}`,
          type: 'floated-input-field',
          className: 'col-12 md:col-6',
          props: {
            label: _(`title`),
            required: lang === 'en',
            placeholder: _(`title`),
          },
          hooks: {
            onInit: (field: FormlyFieldConfig) => {
              return field.formControl?.valueChanges.pipe(
                distinctUntilChanged(),
                tap((titleValue: any) => {
                  const slugField = field?.form?.get('slug');
                  if (slugField) {
                    slugField.setValue(titleValue);
                  }
                }),
              );
            },
          },
        },
        {
          key: `description_${lang}`,
          type: 'textarea-field',
          className: 'col-12',
          props: {
            label: _(`Description`),
            placeholder: _(`Description`),
          },
        },
      ]),
    ];
  }
}

export interface Currency {
  id: number;
  priority: number;
  iso_code: string;
  name: string;
  symbol: string;
  subunit: string;
  subunit_to_unit: number;
  symbol_first: number;
  html_entity: string;
  decimal_mark: string;
  thousands_separator: string;
  iso_numeric: number;
  created_at: string;
}

export interface Package {
  id: number;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  slug: string;
  order: number;
  ad_limit_per_month: number;
  currency: Currency;
  currency_id: number;
  duration: string;
  discount: number;
  final_price: string;
}

export class PackageModel {
  id: number | null;
  name_en: string | null;
  name_ar: string | null;
  isNew?: boolean;
  description_en: string | null;
  description_ar: string | null;
  slug: string | null;
  order: number | null;
  ad_limit_per_month: number | null;
  currency: any;
  currency_id: number | null = 55;
  duration: number | null;
  price: number | null;
  discount: number | null;
  package_items: { [key: string]: any }[] | null;
  package_items_info: { [key: string]: any }[] | null;
  package_item_ids: number[] | null;
  featured_units_number: number | null;

  constructor(editData?: PackageModel, currentLang?: string) {
    this.id = editData?.id || null;
    this.name_en = editData?.name_en || null;
    this.name_ar = editData?.name_ar || null;
    this.description_en = editData?.description_en || null;
    this.description_ar = editData?.description_ar || null;
    this.slug = editData?.slug || null;
    this.order = editData?.order ?? null;
    this.ad_limit_per_month = editData?.ad_limit_per_month || null;
    this.currency_id = editData?.currency_id || 55;
    this.duration = editData?.duration ?? null;
    this.price = editData?.price ?? null;
    this.discount = editData?.discount ?? null;
    this.package_items = editData?.package_items ?? [];
    this.package_items_info = editData?.package_items_info
      ? editData?.package_items_info?.map((item) => ({
          label: currentLang === 'en' ? item.name_en : item.name_ar,
          value: item.id,
        }))
      : null;
    this.package_item_ids = editData?.package_item_ids || null;
    this.featured_units_number = editData?.featured_units_number || null;
  }
}

export class PackageItemModel {
  id?: number | null;
  name_en: string | null;
  name_ar: string | null;
  description_en: string | null;
  description_ar: string | null;

  constructor(editData?: PackageItemModel) {
    this.id = editData?.id || null;
    this.name_en = editData?.name_en || null;
    this.name_ar = editData?.name_ar || null;
    this.description_en = editData?.description_en || null;
    this.description_ar = editData?.description_ar || null;
  }
}

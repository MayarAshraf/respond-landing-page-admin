export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  country_code: string;
  subject: string;
  message: string;
}

export class ContactModel {
  id?: number | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  country_code: string | null;
  subject: string | null;
  message: string | null;

  constructor(editData?: ContactModel) {
    this.id = editData?.id || null;
    this.name = editData?.name || null;
    this.email = editData?.email || null;
    this.phone = editData?.phone || null;
    this.country_code = editData?.country_code || null;
    this.subject = editData?.subject || null;
    this.message = editData?.message || null;
  }
}

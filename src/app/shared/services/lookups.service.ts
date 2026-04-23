import { inject, Injectable } from '@angular/core';
import { CachedListService } from './cached-lists.service';

@Injectable({
  providedIn: 'root',
})
export class LookupsService {
  #cacheList = inject(CachedListService);

  getLookupsList(slug: string) {
    return this.#cacheList.getListData(`lookups/by-parent-slug/${slug}`, 'GET');
  }

  getLabelBreadCrumb(id: number) {
    return this.#cacheList.getListData(
      'lookups/bread-crumb',
      `POST`,
      { id },
      `lookups/bread-crumb/${id}`,
    );
  }
}

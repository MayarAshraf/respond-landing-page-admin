import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { PopoverModule } from 'primeng/popover';
import { Tooltip } from 'primeng/tooltip';
import { LangSwitcherComponent } from 'src/app/shared/components/lang-switcher.component';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ConfirmService } from 'src/app/shared/services/global-services/confirm.service';
import { LangService } from 'src/app/shared/services/lang.service';

@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrl: './menu-sidebar.component.scss',
  imports: [
    RouterLink,
    RouterLinkActive,
    Tooltip,
    DrawerModule,
    MenubarModule,
    PopoverModule,
    ButtonModule,
    MenuModule,
    NgTemplateOutlet,
    TranslatePipe,
    LangSwitcherComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuSidebarComponent {
  #confirmService = inject(ConfirmService);
  #translate = inject(TranslateService);
  #authService = inject(AuthService);
  #router = inject(Router);
  #destroyRef = inject(DestroyRef);
  currentLang = inject(LangService).currentLanguage;

  dialogRef: DynamicDialogRef | null = null;
  currentUser = this.#authService.currentUser;

  visible = signal(true);

  topMenuItems = signal<MenuItem[]>([
    {
      label: _('users'),
      icon: 'fa-solid fa-user',
      routerLink: '/users',
      visible: true,
    },
    {
      label: _('packages'),
      icon: 'fa-solid fa-box',
      routerLink: 'packages',
      visible: true,
    },
  ]);

  bottomMenuItems = signal<MenuItem[]>([
    {
      label: _('contacts'),
      icon: 'fa-solid fa-envelope',
      routerLink: 'contacts',
      visible: true,
    },
  ]);

  logout() {
    this.#confirmService.confirmDelete({
      message: this.#translate.instant(_('please_confirm_to_proceed')),
      acceptCallback: () =>
        this.#authService
          .logout()
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe(() => {
            this.#router.navigateByUrl('auth/login');
          }),
    });
  }
}

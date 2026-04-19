import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { SHARED_COMPONENTS, SHARED_IMPORTS } from '../../shared/base-imports';
import { AdminService } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import {
  Role,
  UserAuditFilter,
  UserAuditLog,
  UserSearchFilter,
} from '../../models/admin';
import { User } from '../../models/user';
import { ToastService } from '../../shared/services/toast.service';

type AdminTab = 'users' | 'audits';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [...SHARED_IMPORTS, ...SHARED_COMPONENTS],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  private readonly fb = inject(FormBuilder);
  private readonly adminService = inject(AdminService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentUser = signal<User | null>(this.authService.getCurrentUser());
  readonly activeTab = signal<AdminTab>('users');

  readonly isAdmin = computed(() => {
    const roleName = (this.currentUser()?.roleName || '').toUpperCase();
    return roleName === 'ADMIN' || roleName === 'SYS_ADMIN';
  });

  readonly isLoadingUsers = signal<boolean>(false);
  readonly isLoadingRoles = signal<boolean>(false);
  readonly isUpdatingRoleFor = signal<string | null>(null);
  readonly isUpdatingStatusFor = signal<string | null>(null);
  readonly users = signal<User[]>([]);
  readonly usersTotalElements = signal<number>(0);
  readonly usersPage = signal<number>(0);
  readonly readonlyUsersPageSize = 10;

  readonly roles = signal<Role[]>([]);
  readonly rolesTotalElements = signal<number>(0);

  readonly isLoadingAudits = signal<boolean>(false);
  readonly isDeletingAudits = signal<boolean>(false);
  readonly audits = signal<UserAuditLog[]>([]);
  readonly auditsTotalElements = signal<number>(0);
  readonly auditsPage = signal<number>(0);
  readonly readonlyAuditsPageSize = 10;

  readonly isConfirmingWebhook = signal<boolean>(false);

  readonly roleDraftByUserId = signal<Record<string, string>>({});
  readonly statusDraftByUserId = signal<Record<string, string>>({});

  readonly usersTotalPages = computed(() =>
    Math.max(1, Math.ceil(this.usersTotalElements() / this.readonlyUsersPageSize)),
  );

  readonly auditsTotalPages = computed(() =>
    Math.max(1, Math.ceil(this.auditsTotalElements() / this.readonlyAuditsPageSize)),
  );

  readonly activeUsersInPage = computed(
    () => this.users().filter((user) => user.userStatus?.value === 'ACTIVE').length,
  );

  readonly bannedUsersInPage = computed(
    () => this.users().filter((user) => user.userStatus?.value === 'BANNED').length,
  );

  readonly userFilterForm = this.fb.group({
    username: [''],
    status: [''],
    roleName: [''],
    userPlan: [''],
  });

  readonly auditFilterForm = this.fb.group({
    username: [''],
    requestUri: [''],
    createdDateFrom: [''],
    createdDateTo: [''],
  });

  readonly webhookForm = this.fb.group({
    webhookUrl: ['', [Validators.required]],
  });

  readonly statusOptions: Array<{ value: string; label: string }> = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'PENDING_VERIFICATION', label: 'Chờ xác minh' },
    { value: 'ACTIVE', label: 'Hoạt động' },
    { value: 'DISABLED_BY_USER', label: 'Vô hiệu bởi user' },
    { value: 'BANNED', label: 'Bị khóa' },
  ];

  readonly planOptions: Array<{ value: string; label: string }> = [
    { value: '', label: 'Tất cả gói' },
    { value: 'FREEMIUM', label: 'Freemium' },
    { value: 'PREMIUM', label: 'Premium' },
  ];

  constructor() {
    if (this.isAdmin()) {
      this.loadRoles();
      this.searchUsers(true);
      this.searchAudits(true);
    }
  }

  protected setActiveTab(tab: AdminTab): void {
    this.activeTab.set(tab);
  }

  protected searchUsers(resetPage: boolean): void {
    if (resetPage) {
      this.usersPage.set(0);
    }

    this.isLoadingUsers.set(true);
    const filter = this.buildUserFilter();

    this.adminService
      .searchUsers(filter, this.usersPage(), this.readonlyUsersPageSize)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoadingUsers.set(false)),
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            const normalizedUsers = (response.data.content || []).map((user) =>
              this.normalizeUserDates(user),
            );

            this.users.set(normalizedUsers);
            this.usersTotalElements.set(response.data.totalElements || 0);
            this.hydrateDraftValues(normalizedUsers);
            return;
          }

          this.users.set([]);
          this.usersTotalElements.set(0);
          this.roleDraftByUserId.set({});
          this.statusDraftByUserId.set({});
          this.toastService.error(response.message || 'Không tải được danh sách người dùng');
        },
        error: (error) => {
          this.users.set([]);
          this.usersTotalElements.set(0);
          this.roleDraftByUserId.set({});
          this.statusDraftByUserId.set({});
          const message =
            error?.error?.message || 'Không tải được danh sách người dùng';
          this.toastService.error(message);
        },
      });
  }

  protected resetUserFilters(): void {
    this.userFilterForm.reset({
      username: '',
      status: '',
      roleName: '',
      userPlan: '',
    });
    this.searchUsers(true);
  }

  protected goToPreviousUsersPage(): void {
    if (this.usersPage() <= 0) {
      return;
    }

    this.usersPage.set(this.usersPage() - 1);
    this.searchUsers(false);
  }

  protected goToNextUsersPage(): void {
    if (this.usersPage() + 1 >= this.usersTotalPages()) {
      return;
    }

    this.usersPage.set(this.usersPage() + 1);
    this.searchUsers(false);
  }

  protected onRoleDraftChange(userId: string, value: string): void {
    this.roleDraftByUserId.update((prev) => ({
      ...prev,
      [userId]: value,
    }));
  }

  protected onStatusDraftChange(userId: string, value: string): void {
    this.statusDraftByUserId.update((prev) => ({
      ...prev,
      [userId]: value,
    }));
  }

  protected saveRole(user: User): void {
    const draftRole = this.roleDraftByUserId()[user.id] || user.roleName;
    if (!draftRole || draftRole === user.roleName || this.isUpdatingRoleFor()) {
      return;
    }

    this.isUpdatingRoleFor.set(user.id);

    this.adminService
      .updateUserRole(user.id, { roleName: draftRole })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isUpdatingRoleFor.set(null)),
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toastService.success('Cập nhật role thành công');
            this.searchUsers(false);
            return;
          }

          this.toastService.error(response.message || 'Cập nhật role thất bại');
        },
        error: (error) => {
          const message = error?.error?.message || 'Cập nhật role thất bại';
          this.toastService.error(message);
        },
      });
  }

  protected saveStatus(user: User): void {
    const draftStatus = this.statusDraftByUserId()[user.id] || user.userStatus?.value;
    if (!draftStatus || draftStatus === user.userStatus?.value || this.isUpdatingStatusFor()) {
      return;
    }

    this.isUpdatingStatusFor.set(user.id);

    this.adminService
      .updateUserStatus(user.id, { status: draftStatus })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isUpdatingStatusFor.set(null)),
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toastService.success('Cập nhật trạng thái thành công');
            this.searchUsers(false);
            return;
          }

          this.toastService.error(response.message || 'Cập nhật trạng thái thất bại');
        },
        error: (error) => {
          const message = error?.error?.message || 'Cập nhật trạng thái thất bại';
          this.toastService.error(message);
        },
      });
  }

  protected searchAudits(resetPage: boolean): void {
    if (resetPage) {
      this.auditsPage.set(0);
    }

    this.isLoadingAudits.set(true);

    this.adminService
      .searchUserAuditLogs(this.buildAuditFilter(), this.auditsPage(), this.readonlyAuditsPageSize)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoadingAudits.set(false)),
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            const normalizedAudits = (response.data.content || []).map((audit) => ({
              ...audit,
              createdDate: this.normalizeUtcDateString(audit.createdDate),
            }));
            this.audits.set(normalizedAudits);
            this.auditsTotalElements.set(response.data.totalElements || 0);
            return;
          }

          this.audits.set([]);
          this.auditsTotalElements.set(0);
          this.toastService.error(response.message || 'Không tải được audit log');
        },
        error: (error) => {
          this.audits.set([]);
          this.auditsTotalElements.set(0);
          const message = error?.error?.message || 'Không tải được audit log';
          this.toastService.error(message);
        },
      });
  }

  protected resetAuditFilters(): void {
    this.auditFilterForm.reset({
      username: '',
      requestUri: '',
      createdDateFrom: '',
      createdDateTo: '',
    });
    this.searchAudits(true);
  }

  protected goToPreviousAuditsPage(): void {
    if (this.auditsPage() <= 0) {
      return;
    }

    this.auditsPage.set(this.auditsPage() - 1);
    this.searchAudits(false);
  }

  protected goToNextAuditsPage(): void {
    if (this.auditsPage() + 1 >= this.auditsTotalPages()) {
      return;
    }

    this.auditsPage.set(this.auditsPage() + 1);
    this.searchAudits(false);
  }

  protected clearAuditLogsByFilter(): void {
    if (this.isDeletingAudits()) {
      return;
    }

    this.isDeletingAudits.set(true);

    this.adminService
      .deleteUserAuditLogs(this.buildAuditFilter())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isDeletingAudits.set(false)),
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toastService.success('Xóa audit log thành công');
            this.searchAudits(true);
            return;
          }

          this.toastService.error(response.message || 'Xóa audit log thất bại');
        },
        error: (error) => {
          const message = error?.error?.message || 'Xóa audit log thất bại';
          this.toastService.error(message);
        },
      });
  }

  protected confirmWebhookUrl(): void {
    if (this.webhookForm.invalid || this.isConfirmingWebhook()) {
      this.webhookForm.markAllAsTouched();
      return;
    }

    const webhookUrl = this.webhookForm.getRawValue().webhookUrl?.trim() || '';
    if (!webhookUrl) {
      return;
    }

    this.isConfirmingWebhook.set(true);

    this.adminService
      .confirmWebhook(webhookUrl)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isConfirmingWebhook.set(false)),
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toastService.success('Xác nhận webhook thành công');
            return;
          }

          this.toastService.error(response.message || 'Xác nhận webhook thất bại');
        },
        error: (error) => {
          const message = error?.error?.message || 'Xác nhận webhook thất bại';
          this.toastService.error(message);
        },
      });
  }

  protected getRoleDraft(userId: string): string {
    return this.roleDraftByUserId()[userId] || '';
  }

  protected getStatusDraft(userId: string): string {
    return this.statusDraftByUserId()[userId] || '';
  }

  protected getStatusBadgeClass(status: string | undefined): string {
    switch ((status || '').toUpperCase()) {
      case 'ACTIVE':
        return 'bg-emerald-100 text-emerald-700';
      case 'PENDING_VERIFICATION':
        return 'bg-amber-100 text-amber-700';
      case 'DISABLED_BY_USER':
        return 'bg-slate-100 text-slate-700';
      case 'BANNED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  protected trackByUserId(_index: number, user: User): string {
    return user.id;
  }

  protected trackByRoleId(_index: number, role: Role): number {
    return role.id;
  }

  protected trackByAuditId(_index: number, audit: UserAuditLog): number {
    return audit.id;
  }

  private loadRoles(): void {
    this.isLoadingRoles.set(true);

    this.adminService
      .searchRoles({}, 0, 100)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoadingRoles.set(false)),
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.roles.set(response.data.content || []);
            this.rolesTotalElements.set(response.data.totalElements || 0);
            return;
          }

          this.roles.set([]);
          this.rolesTotalElements.set(0);
          this.toastService.error(response.message || 'Không tải được danh sách role');
        },
        error: (error) => {
          this.roles.set([]);
          this.rolesTotalElements.set(0);
          const message = error?.error?.message || 'Không tải được danh sách role';
          this.toastService.error(message);
        },
      });
  }

  private hydrateDraftValues(users: User[]): void {
    const roleDrafts: Record<string, string> = {};
    const statusDrafts: Record<string, string> = {};

    users.forEach((user) => {
      roleDrafts[user.id] = user.roleName;
      statusDrafts[user.id] = user.userStatus?.value || '';
    });

    this.roleDraftByUserId.set(roleDrafts);
    this.statusDraftByUserId.set(statusDrafts);
  }

  private buildUserFilter(): UserSearchFilter {
    const raw = this.userFilterForm.getRawValue();
    const roleId = this.resolveRoleId(raw.roleName || '');

    return {
      username: raw.username?.trim() || undefined,
      userStatus: raw.status?.trim() || undefined,
      userPlan: raw.userPlan?.trim() || undefined,
      roleId,
    };
  }

  private buildAuditFilter(): UserAuditFilter {
    const raw = this.auditFilterForm.getRawValue();

    return {
      username: raw.username?.trim() || undefined,
      requestUri: raw.requestUri?.trim() || undefined,
      createdDateFrom: raw.createdDateFrom?.trim() || undefined,
      createdDateTo: raw.createdDateTo?.trim() || undefined,
    };
  }

  private resolveRoleId(roleName: string): number | undefined {
    if (!roleName) {
      return undefined;
    }

    const role = this.roles().find((item) => item.name === roleName);
    return role?.id;
  }

  private normalizeUserDates(user: User): User {
    return {
      ...user,
      createdDate: this.normalizeUtcDateString(user.createdDate),
      updatedDate: this.normalizeUtcDateString(user.updatedDate),
    };
  }

  private normalizeUtcDateString(value: string): string {
    if (!value) {
      return value;
    }

    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return trimmedValue;
    }

    const hasTimezone = /Z|[+-]\d{2}:\d{2}$/.test(trimmedValue);
    if (hasTimezone) {
      return trimmedValue;
    }

    const isoLikeValue = trimmedValue.includes('T')
      ? trimmedValue
      : trimmedValue.replace(' ', 'T');

    return `${isoLikeValue}Z`;
  }
}

import { BaseApiClient } from './base-client';

export interface UpdatePayload {
  name?: string;
  email?: string;
  isActive?: boolean;
}

export class AdminUsersClient extends BaseApiClient {
  getAdminUsers() {
    return this.get('/api/admin/users');
  }

  updateAdminUser(userId: string, payload: UpdatePayload){
    return this.patch(`/api/admin/users/${userId}`, payload)
  }


}
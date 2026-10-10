import React from 'react';
import UserManagement from '../components/UserManagement';

export default function UsersPage({ users = [], onRefresh }) {
  return <UserManagement users={users} onRefresh={onRefresh} />;
}

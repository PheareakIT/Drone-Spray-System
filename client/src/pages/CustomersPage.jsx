import React from 'react';
import CustomerManagement from '../components/CustomerManagement';

export default function CustomersPage({ customers = [], onRefresh }) {
  return <CustomerManagement customers={customers} onRefresh={onRefresh} />;
}

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Account = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user) {
    return <div className="text-center py-12">Please log in to view your account</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t('account.title')}</h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-500 text-sm">Name</label>
            <div className="font-semibold">{user.name}</div>
          </div>
          <div>
            <label className="block text-gray-500 text-sm">Email</label>
            <div className="font-semibold">{user.email}</div>
          </div>
          <div>
            <label className="block text-gray-500 text-sm">Phone</label>
            <div className="font-semibold">{user.phone || 'Not provided'}</div>
          </div>
          <div>
            <label className="block text-gray-500 text-sm">Role</label>
            <div className="font-semibold capitalize">{user.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;

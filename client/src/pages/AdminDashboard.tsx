import React, { useState } from 'react';
import CreateDosenForm from '../components/dosen/CreateDosenForm';
import CreateMahasiswaForm from '../components/mahasiswa/CreateMahasiswaForm';

type UserRole = 'dosen' | 'mahasiswa' | null;

const AdminDashboard: React.FC = () => {
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setShowRoleSelection(false);
  };

  const handleCloseForm = () => {
    setSelectedRole(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div 
                  className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => setShowRoleSelection(true)}
                >
                  <div className="p-5">
                    <h3 className="text-lg font-medium">User Management</h3>
                    <p className="mt-1 text-sm text-gray-500">Create new user accounts</p>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <h3 className="text-lg font-medium">Course Management</h3>
                    <p className="mt-1 text-sm text-gray-500">Manage all courses and assignments</p>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <h3 className="text-lg font-medium">System Settings</h3>
                    <p className="mt-1 text-sm text-gray-500">Configure system parameters</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Selection Modal */}
            {showRoleSelection && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg max-w-md w-full">
                  <h2 className="text-2xl font-bold mb-4">Select User Role</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleRoleSelect('dosen')}
                      className="p-4 text-center border-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <h3 className="text-lg font-medium">Dosen</h3>
                      <p className="text-sm text-gray-500">Create dosen account</p>
                    </button>
                    <button
                      onClick={() => handleRoleSelect('mahasiswa')}
                      className="p-4 text-center border-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <h3 className="text-lg font-medium">Mahasiswa</h3>
                      <p className="text-sm text-gray-500">Create mahasiswa account</p>
                    </button>
                  </div>
                  <button
                    onClick={() => setShowRoleSelection(false)}
                    className="mt-4 w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* User Creation Forms */}
            {selectedRole === 'dosen' && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg max-w-md w-full">
                  <h2 className="text-2xl font-bold mb-4">Create Dosen Account</h2>
                  <CreateDosenForm onClose={handleCloseForm} />
                </div>
              </div>
            )}

            {selectedRole === 'mahasiswa' && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg max-w-md w-full">
                  <h2 className="text-2xl font-bold mb-4">Create Mahasiswa Account</h2>
                  {/* We'll create this component next */}
                  <CreateMahasiswaForm onClose={handleCloseForm} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
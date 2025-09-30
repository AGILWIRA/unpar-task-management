import React from 'react';

const MahasiswaDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Mahasiswa Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <h3 className="text-lg font-medium">My Courses</h3>
                    <p className="mt-1 text-sm text-gray-500">View your enrolled courses</p>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <h3 className="text-lg font-medium">My Groups</h3>
                    <p className="mt-1 text-sm text-gray-500">View your group assignments</p>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <h3 className="text-lg font-medium">Submissions</h3>
                    <p className="mt-1 text-sm text-gray-500">Manage your assignment submissions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MahasiswaDashboard;
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface LoginValues {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const formik = useFormik<LoginValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: (values: LoginValues) => {
      // Only allow admin login for now
      if (values.email === 'admin@unpar.ac.id' && values.password === 'password123') {
        console.log('Logged in as Admin');
        window.location.href = '/admin';
      } else if (values.email === 'dosen@unpar.ac.id' || values.email === 'mahasiswa@student.unpar.ac.id') {
        // Show message for dosen and mahasiswa accounts
        alert('Account not activated. Please contact administrator.');
      } else {
        alert('Invalid credentials');
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          UNPAR Task Management System
        </h2>
        {/* Update helper message */}
        <div className="mt-2 text-center text-sm text-gray-600">
          <p className="font-semibold text-red-600 mb-2">
            Note: Only admin login is currently available
          </p>
          <p>Demo Credentials:</p>
          <p>Admin: admin@unpar.ac.id / password123</p>
          <p className="text-gray-400"><del>Dosen: dosen@unpar.ac.id / password123</del></p>
          <p className="text-gray-400"><del>Mahasiswa: mahasiswa@student.unpar.ac.id / password123</del></p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  {...formik.getFieldProps('email')}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm">{formik.errors.email}</div>
              ) : null}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  {...formik.getFieldProps('password')}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm">{formik.errors.password}</div>
              ) : null}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
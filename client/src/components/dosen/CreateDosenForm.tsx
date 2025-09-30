import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface CreateDosenFormProps {
  onClose: () => void;
}

const CreateDosenForm: React.FC<CreateDosenFormProps> = ({ onClose }) => {
  const formik = useFormik({
    initialValues: {
      email: '',
      nip: '',
      nama_lengkap: '',
      departemen: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      nip: Yup.string().required('Required'),
      nama_lengkap: Yup.string().required('Required'),
      departemen: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/dosen', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          alert('Dosen account created successfully');
          onClose();
        } else {
          const error = await response.json();
          alert(error.message || 'Failed to create dosen account');
        }
      } catch (error) {
        alert('Error creating dosen account');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...formik.getFieldProps('email')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-500 text-sm">{formik.errors.email}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="nip" className="block text-sm font-medium text-gray-700">
          NIP
        </label>
        <input
          id="nip"
          type="text"
          {...formik.getFieldProps('nip')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {formik.touched.nip && formik.errors.nip ? (
          <div className="text-red-500 text-sm">{formik.errors.nip}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="nama_lengkap" className="block text-sm font-medium text-gray-700">
          Nama Lengkap
        </label>
        <input
          id="nama_lengkap"
          type="text"
          {...formik.getFieldProps('nama_lengkap')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {formik.touched.nama_lengkap && formik.errors.nama_lengkap ? (
          <div className="text-red-500 text-sm">{formik.errors.nama_lengkap}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="departemen" className="block text-sm font-medium text-gray-700">
          Departemen
        </label>
        <input
          id="departemen"
          type="text"
          {...formik.getFieldProps('departemen')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {formik.touched.departemen && formik.errors.departemen ? (
          <div className="text-red-500 text-sm">{formik.errors.departemen}</div>
        ) : null}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
        >
          Create Account
        </button>
      </div>
    </form>
  );
};

export default CreateDosenForm;
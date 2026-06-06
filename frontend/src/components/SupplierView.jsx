import React, { useState, useEffect } from 'react';
import API from '../api';

const SupplierView = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    API.get('/suppliers')
      .then(res => setSuppliers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8 w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Supplier Directory</h2>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-gray-600 text-sm font-semibold">
            <tr>
              <th className="p-3">Supplier Name</th>
              <th className="p-3">Contact Person</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {suppliers.map(sup => (
              <tr key={sup.supplier_id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-semibold">{sup.supplier_name}</td>
                <td className="p-3">{sup.contact_person}</td>
                <td className="p-3">{sup.phone}</td>
                <td className="p-3">{sup.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierView;
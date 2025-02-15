import React, { useState, useEffect } from 'react';
import { api } from '../api/api';

const Dashboard = () => {
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const response = await api.getCompanyData();
      setCompanyData(response.data);
    } catch (error) {
      console.error('Failed to fetch company data:', error);
    }
  };

  const handleCreateCompany = async () => {
    try {
      await api.createCompany({ name: 'My Company' });
      fetchCompanyData();
    } catch (error) {
      console.error('Failed to create company:', error);
    }
  };

  const handleUpdateCompany = async () => {
    try {
      await api.updateCompany(companyData);
      fetchCompanyData();
    } catch (error) {
      console.error('Failed to update company:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Your Company</h2>
        {!companyData ? (
          <button
            onClick={handleCreateCompany}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Company
          </button>
        ) : (
          <div>
            <p><strong>Name:</strong> {companyData.name}</p>
            {companyData.inn && (
              <>
                <p><strong>INN:</strong> {companyData.inn}</p>
                <p><strong>OGRN:</strong> {companyData.ogrn}</p>
                <p><strong>Full Name:</strong> {companyData.fullName}</p>
                <p><strong>CEO Position:</strong> {companyData.ceoPosition}</p>
                <p><strong>CEO Name:</strong> {companyData.ceoName}</p>
                <p><strong>Address:</strong> {companyData.address}</p>
              </>
            )}
            <button
              onClick={handleUpdateCompany}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Update Company Data
            </button>
          </div>
        )}
      </div>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Documents</h2>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload Documents
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
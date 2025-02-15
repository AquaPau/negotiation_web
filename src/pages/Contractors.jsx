import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/api';

const Contractors = () => {
  const [contractors, setContractors] = useState([]);

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      const response = await api.getContractors();
      setContractors(response.data);
    } catch (error) {
      console.error('Failed to fetch contractors:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contractors</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Add Contractor
      </button>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <ul>
          {contractors.map((contractor) => (
            <li key={contractor.id} className="mb-2">
              <Link
                to={`/contractors/${contractor.id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {contractor.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Contractors;
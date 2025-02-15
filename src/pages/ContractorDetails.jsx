import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/api';

const ContractorDetails = () => {
  const { id } = useParams();
  const [contractor, setContractor] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [interactionPossibilities, setInteractionPossibilities] = useState(null);

  useEffect(() => {
    fetchContractorDetails();
  }, [id]);

  const fetchContractorDetails = async () => {
    try {
      const response = await api.getContractorDetails(id);
      setContractor(response.data.contractor);
      setDocuments(response.data.documents);
      setInteractionPossibilities(response.data.interactionPossibilities);
    } catch (error) {
      console.error('Failed to fetch contractor details:', error);
    }
  };

  const handleGetDocumentContent = async (documentId) => {
    try {
      const response = await api.getDocumentContent(documentId);
      // Update the document content in the state
      setDocuments(documents.map(doc =>
        doc.id === documentId ? { ...doc, content: response.data.content } : doc
      ));
    } catch (error) {
      console.error('Failed to fetch document content:', error);
    }
  };

  const handleGetDocumentRisks = async (documentId) => {
    try {
      const response = await api.getDocumentRisks(documentId);
      // Update the document risks in the state
      setDocuments(documents.map(doc =>
        doc.id === documentId ? { ...doc, risks: response.data.risks } : doc
      ));
    } catch (error) {
      console.error('Failed to fetch document risks:', error);
    }
  };

  const handleGetInteractionPossibilities = async () => {
    try {
      const response = await api.getInteractionPossibilities(id);
      setInteractionPossibilities(response.data);
    } catch (error) {
      console.error('Failed to fetch interaction possibilities:', error);
    }
  };

  if (!contractor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contractor Details</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="font-semibold">Name:</td>
              <td>{contractor.name}</td>
            </tr>
            <tr>
              <td className="font-semibold">INN:</td>
              <td>{contractor.inn}</td>
            </tr>
            <tr>
              <td className="font-semibold">OGRN:</td>
              <td>{contractor.ogrn}</td>
            </tr>
            <tr>
              <td className="font-semibold">Full Name:</td>
              <td>{contractor.fullName}</td>
            </tr>
            <tr>
              <td className="font-semibold">CEO Position:</td>
              <td>{contractor.ceoPosition}</td>
            </tr>
            <tr>
              <td className="font-semibold">CEO Name:</td>
              <td>{contractor.ceoName}</td>
            </tr>
            <tr>
              <td className="font-semibold">Address:</td>
              <td>{contractor.address}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold mb-4">Documents</h2>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Document Name</th>
              <th className="text-left">Content</th>
              <th className="text-left">Risks</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.name}</td>
                <td>
                  {doc.content ? (
                    doc.content
                  ) : (
                    <button
                      onClick={() => handleGetDocumentContent(doc.id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                    >
                      Get Content
                    </button>
                  )}
                </td>
                <td>
                  {doc.risks ? (
                    doc.risks
                  ) : (
                    <button
                      onClick={() => handleGetDocumentRisks(doc.id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                    >
                      Get Risks
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-xl font-semibold mb-4">Interaction Possibilities</h2>
        {interactionPossibilities ? (
          <p>{interactionPossibilities}</p>
        ) : (
          <button
            onClick={handleGetInteractionPossibilities}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Get Interaction Possibilities
          </button>
        )}
      </div>
    </div>
  );
};

export default ContractorDetails;
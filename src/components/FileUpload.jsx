"use client"

import { useState } from "react"
import { api } from "../api/api"

const FileUpload = ({ onUploadSuccess, onUploadError }) => {
  const [files, setFiles] = useState([])
  const [metadata, setMetadata] = useState({})
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files))
  }

  const handleMetadataChange = (e) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)
    try {
      await api.uploadCompanyFiles(files, metadata)
      onUploadSuccess("Files uploaded successfully!")
    } catch (error) {
      onUploadError("Error uploading files: " + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="files" className="block text-sm font-medium text-gray-700">
          Select Files
        </label>
        <input
          type="file"
          id="files"
          multiple
          onChange={handleFileChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="metadata" className="block text-sm font-medium text-gray-700">
          Metadata (optional)
        </label>
        <input
          type="text"
          id="metadata"
          name="metadata"
          onChange={handleMetadataChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={isUploading}
        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        {isUploading ? "Uploading..." : "Upload Files"}
      </button>
    </form>
  )
}

export default FileUpload


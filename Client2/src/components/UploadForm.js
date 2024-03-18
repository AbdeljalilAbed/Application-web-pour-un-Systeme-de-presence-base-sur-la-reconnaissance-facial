import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../config";

const UploadForm = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      axios.post(backendURL + "/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Data uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to upload data");
    }
  };

  return (
    <div>
      <input className="text-center" type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadForm;

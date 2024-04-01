import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../config";


function UploadImages() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(
        backendURL+"/images-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Upload successful:", response.data);
            alert("Data uploaded successfully");

    } catch (error) {
      console.error("Upload failed:", error);
            alert("Failed to upload data");

    }
  };

  return (
    <div className="col bg-body rounded p-2">    <div className="border border-primary border-3 rounded p-2">
      <div className="login-header">Upload Images Etudiants</div>
            <form>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleSubmit}>Upload</button>
      </form>

    </div>
</div>
  );
}

export default UploadImages;

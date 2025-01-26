import React, { useEffect } from "react";
import { CloudinaryUploadWidget } from "react-cloudinary-uploader";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./Upload.styles.css";

const SingleVideoUpload = ({ video, setVideo, setVideoForDB }) => {
  // Cloudinary configuration
  const cloudName = "dymsuaana";
  const uploadPreset = "udipti";

  // Handle video upload success
  const handleSuccess = (response) => {
    console.log("Video uploaded successfully:", response);

    setVideo(response.url); // Update video URL state

    setVideoForDB({
      public_id: response.public_id,
      url: response.url,
    });
  };

  useEffect(() => {
    const widget = document.querySelector(".widget_container button");
    const uploadBtn = document.querySelector("#upload_btn");

    uploadBtn.addEventListener("click", () => {
      widget.click();
    });
  }, []);

  return (
    <div className="uploader">
 
      {/* Cloudinary Uploader */}
      <div className="widget_container">
        <CloudinaryUploadWidget
          cloudName={cloudName}
          uploadPreset={uploadPreset}
          resourceType="video" // Specify video uploads
          onUploadSuccess={handleSuccess}
          buttonText="Upload Video"
          id="hide"
        />
      </div>

      {/* Upload button */}
      <div className="stepper_menu">
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          id="upload_btn"
        >
          Upload Video
        </Button>
      </div>
    </div>
  );
};

export default SingleVideoUpload;

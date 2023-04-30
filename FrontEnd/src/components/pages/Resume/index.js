import React, { useEffect, useState } from "react";
import { Button, Typography, IconButton } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { Document, Page, pdfjs} from "react-pdf";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoading, upload_resume } from "../../../store/ResumeSlice";
import { toast } from "react-toastify";
import SpinnerLoading from "../../commons/SpinnerLoading";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function Resume() {
  const loading = useSelector(selectIsLoading);
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const actionResult = await dispatch(upload_resume(file));
    if (upload_resume.fulfilled.match(actionResult)) {
      toast.success(actionResult.payload.message);
    }
    if (upload_resume.rejected.match(actionResult)) {
        toast.error(actionResult.payload.message);
    }
  };
  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
    setPageNumber(1);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => {
    setPageNumber((prevPageNumber) => prevPageNumber - 1);
  };

  const goToNextPage = () => {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };
  useEffect(() => {
    document.title = "Resume | Hire IT";
  }, []);

  return (
  <div>
    <SpinnerLoading loading={loading}/>
    <div className="resume-container">
    <form onSubmit={handleSubmit} className="resume-form-container">
      <input
        id="contained-button-file"
        type="file"
        style={{ display: "none" }}
        accept="application/pdf"
        onChange={handleFileUpload}
      />
      <div className="custom-file-upload-container">
        <label htmlFor="contained-button-file" className="custom-file-upload-label">
          <div className="custom-file-upload-frame">
          {file && <div className="navigate-button">
                    <IconButton
                      variant="contained"
                      onClick={goToPrevPage}
                      disabled={pageNumber <= 1}
                    >
                      <NavigateBeforeIcon fontSize="large"/>
                    </IconButton>
                    <IconButton
                      variant="contained"
                      onClick={goToNextPage}
                      disabled={pageNumber >= numPages}
                    >
                      <NavigateNextIcon fontSize="large"/>
                    </IconButton>
                  </div>}
            {!file && <CloudUploadIcon className="custom-file-upload-icon" />}
            <div className="custom-file-upload-text">
              {!file && "Upload your resume"}
              {file && (
                <div>
                  <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={pageNumber} />
                  </Document>
                  <div className="navigate-typograpy">
                  <Typography>
                      Page {pageNumber} of {numPages}
                    </Typography>
                  </div>
                  
                </div>
              )}
            </div>
          </div>
        </label>
      </div>
      <label htmlFor="contained-button-file" className="resume-button-container">
        <Button 
          className="resume-button upload-button"
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          Upload your resume
        </Button>
        {file && <Button 
          className="resume-button submit-button"
          variant="contained"
          type="submit"  
        >
          Submit
        </Button>}
      </label>
      </form>
  </div>
  </div>
  );
}

export default Resume;

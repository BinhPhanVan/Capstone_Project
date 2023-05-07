import { IconButton } from '@material-ui/core';
import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const PDFViewer = ({ file }) => {
    const [numPages, setNumPages] = React.useState(null);
    const [pageNumber, setPageNumber] = React.useState(1);
  
    const onDocumentLoadSuccess = ({ numPages }) => {
      setNumPages(numPages);
    };
  
    const handlePreviousPage = () => {
      if (pageNumber > 1) {
        setPageNumber(pageNumber - 1);
      }
    };
  
    const handleNextPage = () => {
      if (pageNumber < numPages) {
        setPageNumber(pageNumber + 1);
      }
    };

    return (
    <div className="pdf-view-container">
        <div className="pdf-container">
            <Document className="pdf-viewer" file={file} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} />
            </Document>
        </div>
        <div className="pdf-navigation">
            <IconButton
                variant="contained"
                onClick={handlePreviousPage}
                disabled={pageNumber <= 1}
            >
                <NavigateBeforeIcon fontSize="large"/>
            </IconButton>

            <div className="pdf-page-number">
                <span>Page {pageNumber} of {numPages}</span>
            </div>

            <IconButton
                variant="contained"
                onClick={handleNextPage}
                disabled={pageNumber >= numPages}
            >
                <NavigateNextIcon fontSize="large"/>
            </IconButton>
        </div>
    </div>
    
  );
};

export default PDFViewer;

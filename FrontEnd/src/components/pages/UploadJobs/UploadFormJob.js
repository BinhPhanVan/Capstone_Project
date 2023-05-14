import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { PROVINCES } from "../../../constants/locations";
import { useDispatch } from "react-redux";
import { upload_job } from "../../../store/JobSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UploadFormJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [job_name, setJobName] = useState("");
  const [file, setFile] = useState(null);
  const handleSubmitFormJob = async (e) => {
    e.preventDefault();
    const data = {
        "job_name": job_name,
        "location": location,
        "pdf_file": file
    }
    console.log(data);
    const actionResult = await dispatch(upload_job(data));
    if (upload_job.fulfilled.match(actionResult)) {
      toast.success(actionResult.payload.message);
      navigate("/recruiter/upload-jobs");
    }
    if (upload_job.rejected.match(actionResult)) {
      toast.error(actionResult.payload.message);
    }
  };
  return (
    <div>
      <div className="upload-job-page">
        <div className="upload-job-container">
          <div className="form">
            <Form className="upload-job-form" onSubmit={handleSubmitFormJob}>
              <h1>Upload Job</h1>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formHorizontalEmail"
              >
                <Form.Label column sm={2}>
                  Job Name
                </Form.Label>
                <Col sm={20}>
                  <Form.Control
                    type="text"
                    onChange={(e) => setJobName(e.target.value)}
                    name="job_name"
                    placeholder="Enter job name"
                    value={job_name}
                    required
                  />
                </Col>
              </Form.Group>

              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formHorizontalLocation"
              >
                <Form.Label column sm={2}>
                  Location
                </Form.Label>
                <Col sm={20}>
                  <Form.Control
                    as="select"
                    name="location"
                    placeholder="Choose location"
                    required
                    sx={{ height: "100%" }}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="">Select a location</option>
                    {PROVINCES.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formHorizontalFile"
              >
                <Form.Label column sm={2}>
                  Job Description
                </Form.Label>
                <Col sm={20}>
                  <Form.Control
                    type="file"
                    accept="application/pdf"
                    name="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1">
                <Col sm={{ span: 10, offset: 1 }}>
                  <Button type="submit">Upload Job</Button>
                </Col>
              </Form.Group>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFormJob;

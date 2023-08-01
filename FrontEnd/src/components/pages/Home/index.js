import HomeImageMain from "./HomeImageMain"
import {Row, Col } from "react-bootstrap";
import { useEffect } from "react";
function Home() {
  useEffect(() => {
    document.title = "Home | Hire IT";
  }, []);
  return (
    <div className="home-container">
      <Row>
        <Col md={6} className="d-flex align-items-center justify-content-center">
          <h2 className="home-content-1">
          The candidate search suggestion system for employers is a smart and effective solution to help employers search for and select candidates that match their job requirements.
          </h2>
        </Col>
        <Col md={6}>
          <HomeImageMain imgSrc="https://media.istockphoto.com/id/894412964/vi/anh/s%E1%BB%AD-d%E1%BB%A5ng-t%E1%BA%A5t-c%E1%BA%A3-c%C3%A1c-c%C3%B4ng-ngh%E1%BB%87-m%E1%BB%9Bi-nh%E1%BA%A5t-%C4%91%E1%BB%83-gi%E1%BB%AF-li%C3%AAn-l%E1%BA%A1c-v%E1%BB%9Bi-b%E1%BA%A1n-b%C3%A8.jpg?s=612x612&w=0&k=20&c=-x-gZDWtGTHRytUOozb2F-o2dRj4K9_HgFkSROvIdpg="></HomeImageMain>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
        <HomeImageMain imgSrc="https://media.istockphoto.com/id/1402874258/vi/anh/c%C3%A1c-doanh-nh%C3%A2n-th%C3%A0nh-%C4%91%E1%BA%A1t-v%E1%BB%97-tay-trong-m%E1%BB%99t-cu%E1%BB%99c-h%E1%BB%8Dp.jpg?s=612x612&w=0&k=20&c=XvbKIO4FEuY5VaWA8JDJr_IySBTVapf9oKAhCMQ0uPA="></HomeImageMain>
        </Col>
        <Col md={6} className="d-flex align-items-center justify-content-center">
          <h2 className="home-content-2">
          Employers can search for candidates based on criteria such as work experience, education, skills, expertise, or other information about the candidate's profile. 
          </h2> 
        </Col>
      </Row>
    </div>
  );
}

export default Home;

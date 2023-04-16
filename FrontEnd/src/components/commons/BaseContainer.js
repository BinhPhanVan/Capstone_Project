import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { useEffect } from "react";

function BaseContainer() {
    useEffect(() => {
        document.title = "Home | Hire IT";
      }, []);
  return (
    <div>
      <Header showLinks={true} />
      <div className="hireit-full-height-container">
        <div className="hireit-full-width">
          <div className="hireit-main-container">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default BaseContainer;

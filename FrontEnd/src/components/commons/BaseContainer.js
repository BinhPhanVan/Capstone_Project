import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAccount } from "../../store/AuthSlice";
import { useNavigate } from "react-router-dom";
function BaseContainer() {
  const navigate = useNavigate();
  const account = useSelector(selectAccount);

  useEffect(() => {
      document.title = "Home | Hire IT";
    }, []);

  useEffect(() => {
    if (account === null || !account) 
    {
      navigate("/login");
    }
  }, [account, navigate]);
  return account?(
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
  ): <></>;
}

export default BaseContainer;

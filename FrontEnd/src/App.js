
import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Resume from './components/pages/Resume';
import NotFound from './components/commons/NotFound';
import ConfirmSignUp from './components/pages/SignUp/ConfirmSignUp';
import BaseContainer from './components/commons/BaseContainer';
function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<BaseContainer />} >
            <Route path="" element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="resume" element={<Resume />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="confirmSignUp" element={<ConfirmSignUp />}></Route>
          <Route path="*" element={<NotFound />} />
          {/* <Route path="verify" element={<VerifySignup />} />
          <Route path="confirmSignup/:code" element={<ConfirmSignup />} />
          <Route path="*" element={<NotFound />} /> 
          element={<ConfirmSignUp />}*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

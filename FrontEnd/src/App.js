
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
import Profile from './components/pages/Profile';
import TurnOnJob from './components/pages/Jobs/TurnOnJob';
import SearchJob from './components/pages/Jobs/SearchJob';
function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<BaseContainer />} >
            <Route path="" element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="resume" element={<Resume />} />
            <Route path="profile" element={<Profile />} />
            <Route path="jobs" element={<SearchJob />}>
              <Route path="turn-on" element={<TurnOnJob />} />
              <Route path="search" element={<SearchJob />} />
            </Route>
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="confirmSignUp" element={<ConfirmSignUp />}></Route>
          <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

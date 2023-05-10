
import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from './components/pages/Login';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Resume from './components/pages/Resume';
import NotFound from './components/commons/NotFound';
import ConfirmSignUp from './components/pages/SignUp/ConfirmSignUp';
import BaseContainer from './components/commons/BaseContainer';
import Profile from './components/pages/Profile';
import TurnOnJob from './components/pages/Jobs/TurnOnJob';
import SearchJob from './components/pages/Jobs/SearchJob';
import SearchCandidate from './components/pages/Candidates/SearchCandidate';
import DevideSignUp from './components/pages/SignUp/DevideSignUp';
import CandidateSignUp from './components/pages/SignUp/CandidateSignUp';
import RecruiterSignUp from './components/pages/SignUp/RecruiterSignUp';
import SignUp from './components/pages/SignUp';
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
            <Route path="candidates" element={<SearchCandidate />}>
              <Route path="search" element={<SearchCandidate />} />
            </Route>
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<SignUp />}>
            <Route path="" element={<DevideSignUp />} />
            <Route path="candidate" element={<CandidateSignUp />} />
            <Route path="recruiter" element={<RecruiterSignUp />} />
          </Route>
          <Route path="confirmSignUp" element={<ConfirmSignUp />}></Route>
          <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

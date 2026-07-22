
import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import Issue from "./pages/Issue";
import Verify from "./pages/Verify";
import UniversityHome from "./pages/UniversityHome";
import ViewCertificates from "./pages/ViewCertificates";


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/issue" element={<Issue />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/university" element={<UniversityHome />} />
          <Route path="/certificates" element={<ViewCertificates />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
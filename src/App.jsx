import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MembersList from "./pages/MembersList";
import MemberDetails from "./pages/MemberDetails";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#60CAE2]/10 via-slate-50 to-[#6163C8]/10 font-[Poppins]">
        <header className="bg-white border-b border-[#60CAE2]/20 shadow-sm">
          <div className="w-full px-8 py-6">
            <div className="flex items-center gap-4">
              <img
                src="https://wallethunter.xyz/assets/brainwave-Db3xDWTl.svg"
                alt="Logo"
                className="h-10 w-auto"
              />
              <h1 className="text-4xl font-bold text-[#6163C8]">
                Wallet Hunter Dashboard
              </h1>
            </div>
          </div>
        </header>
        <main className="w-full p-8">
          <Routes>
            <Route path="/" element={<MembersList />} />
            <Route path="/member/:id" element={<MemberDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

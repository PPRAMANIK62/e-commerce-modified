import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navigation from "./pages/Auth/Navigation.jsx";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer />
      <Navigation />
      <main className="h-screen">
        <Outlet />
      </main>
    </>
  );
}

export default App;

import Header from "../../components/student/Header";
import Footer from "../../components/student/Footer";
import Chatbox from "../../components/student/Chatbox";
import { Outlet } from "react-router-dom";


const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6">
        <Outlet />
      </main>
      <Chatbox/>
      <Footer />
    </div>
  );
};

export default MainLayout;
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "YOOM",
  description: "Video calling application",
  icons:{
    icon:'/icons/logo.svg'
  }
};

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
  
      <main className="relative">
        <Navbar/>
        <div className="flex">
         <Sidebar/>
          <section className="flex flex-1 min-h-screen flex-col px-6 py-28 pb-6 max-md:pb-14 sm:px-14">
            <div className="w-full">{children}</div>
          </section>
        </div>
      </main>
    
  );
};

export default HomeLayout;

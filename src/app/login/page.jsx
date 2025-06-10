"use client";
import LoginCard from "@/components/login/login-card";
import Image from "next/image";

function Login() {
  return (
    <div className="min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://localdstvinstaller.co.za/wp-content/uploads/2018/08/netflix-1030x579.jpg)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.8), rgba(0,0,0,0.4), rgba(0,0,0,0.8))",
        }}
      />
      <div className="absolute top-4 left-4 z-10">
        <Image
          src="https://static.canva.com/web/images/856bac30504ecac8dbd38dbee61de1f1.svg"
          alt="Teamlans Canva"
          width={90}
          height={30}
          className="w-24 h-auto"
          priority
        />
      </div>
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <LoginCard />
      </div>
    </div>
  );
}

export default Login;

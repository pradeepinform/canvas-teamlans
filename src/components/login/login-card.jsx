"use client";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";

function LoginCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4 transition-all duration-300">
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800">Jump back in!</h3>
          <p className="mt-3 text-gray-500">
            Sign in to continue to TeamLans Canva
          </p>
        </div>
        <Button
          variant={"outline"}
          className={`w-full flex items-center justify-center gap-3 py-6 text-gray-700 border-gray-300 
            hover:border-[#8b3dff] hover:text-[#8b3dff] transition-all duration-300 group transform hover:scale-[1.01] active:scale-[0.99]
            `}
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <div className="bg-white rounded-full p-1 flex items-center justify-center group-hover:bg-[#8b3dff]/10 transition-colors duration-300">
            <svg
              className="w-7 h-7 group-hover:text-[#8b3dff] transition-colors duration-300"
              viewBox="0 0 533.5 544.3"
            >
              <path
                fill="#4285f4"
                d="M533.5 278.4c0-17.6-1.6-34.5-4.6-50.9H272v96.4h146.9c-6.3 33.8-25 62.5-53.2 81.8v68.1h85.8c50.1-46.1 79-114.1 79-195.4z"
              />
              <path
                fill="#34a853"
                d="M272 544.3c71.8 0 132-23.8 176-64.4l-85.8-68.1c-23.9 16-54.5 25.5-90.2 25.5-69 0-127.4-46.5-148.3-109.2h-89.1v68.6c43.9 86.9 133 147.6 237.4 147.6z"
              />
              <path
                fill="#fbbc04"
                d="M123.7 328.1c-10.3-30.8-10.3-63.6 0-94.4v-68.6H34.6c-29.3 57.8-29.3 126 0 183.8l89.1-20.8z"
              />
              <path
                fill="#ea4335"
                d="M272 107.7c37.6 0 71.5 12.9 98.1 34.5l73.5-73.5C404 23.9 343.8 0 272 0 167.6 0 78.5 60.7 34.6 147.6l89.1 68.6C144.6 154.2 203 107.7 272 107.7z"
              />
            </svg>
          </div>
          <span className="font-medium">Continue with Google</span>
        </Button>
      </div>
    </div>
  );
}

export default LoginCard;

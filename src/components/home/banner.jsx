"use client"

import { Crown, Loader } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { saveDesign } from "@/services/design-service";

function Banner() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  //const { userSubscription, userDesigns } = useEditorStore();
  //console.log(userSubscription, "userSubscription");


  const handleCreateNewDesign = async () => {
    

    if (loading) return;
    try {
      setLoading(true);
      const initialDesignData = {
        name: "Teamlans Design - Social Media Thumbnails",
        canvasData: null,
        width: 825,
        height: 465,
        category: "Teamlans Design",
      };
      const newDesign = await saveDesign(initialDesignData);
      if (newDesign?.success) {
        router.push(`/editor/${newDesign?.data?._id}`);
        setLoading(false);
      } else {
        throw new Error("Failed to create new design");
      }
      console.log(newDesign, "newDesign");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl overflow-hidden bg-gradient-to-r from-[#00c4cc] via-[#8b3dff] to-[#5533ff] text-white p-4 sm:p-6 md:p-8 text-center">
      <div className="flex flex-col sm:flex-row justify-center items-center mb-2 sm:mb-4">
        <Crown className="h-8 w-8 sm:h-8 sm:w-10 md:h-12 md:w-12 text-yellow-400" />
        <span className="sm:ml-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight">
          Create Teamlans Canva Design

        </span>

      </div>
      <h2 className="text-sm sm:text-base md:text-lg font-bold mb-4 sm:mb-6 max-w-2xl mx-auto">
        Design Social Media Platform that get more views
      </h2>
      <Button onClick={handleCreateNewDesign} className="text-[#8b3dff] bg-white hover:bg-gray-100 rounded-lg py-2 px-4 sm:px-6 sm:py-2.5">
        {loading && <Loader className="w-4 h-4" />}
        Create New Design

      </Button>

    </div>
  )
}

export default Banner;
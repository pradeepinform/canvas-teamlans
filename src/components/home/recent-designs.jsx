"use client";

import { useEditorStore } from "@/store";
import DesignList from "./design-list";
import { useEffect } from "react";
import { getUserDesigns } from "@/services/design-service";

function RecentDesigns() {
  const { userDesigns, userDesignsLoading , setUserDesigns, setUserDesignsLoading} = useEditorStore();

  useEffect(() =>{
    async function fetchDesigns() {
      setUserDesignsLoading(true);
      const result = await getUserDesigns();
      if(result?.success){
        setUserDesigns(result.data);
      }
      setUserDesignsLoading(false);

    }
    fetchDesigns();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Recent Designs</h2>
      <DesignList
        listOfDesigns={
          userDesigns && userDesigns.length > 0 ? userDesigns.slice(0, 4) : []
        }
        isLoading={userDesignsLoading}
        isModalView={false}
      />
    </div>
  );
}

export default RecentDesigns;

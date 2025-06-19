"use client";

import { getUserDesigns, deleteDesign } from "@/services/design-service";
import { Loader } from "lucide-react";
import { useEditorStore } from "@/store";
import DesignCard from "./designCard";


function DesignList({ listOfDesigns, isLoading, isModalView, setShowDesignsModal }) {
  const { setUserDesigns } = useEditorStore();

  async function fetchUserDesigns() {
    const result = await getUserDesigns();
    if (result?.success) setUserDesigns(result?.data);
  }

  const handleDeleteDesign = async (getCurrentDesignId) => {
    const response = await deleteDesign(getCurrentDesignId);
    if (response.success) {
      fetchUserDesigns();
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 gap-4`}>
      {!listOfDesigns.length && <h1 className="col-span-full text-center">No Design Found!</h1>}

      {listOfDesigns.map((design) => (
        <DesignCard
          key={design._id}
          design={design}
          handleDeleteDesign={handleDeleteDesign}
          refreshDesigns={fetchUserDesigns}
          isModalView={isModalView}
          setShowDesignsModal={setShowDesignsModal}
        />
      ))}
    </div>
  );
}

export default DesignList;

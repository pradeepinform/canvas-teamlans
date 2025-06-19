"use client";
import Banner from "@/components/home/banner";
import DesignTypes from "@/components/home/design-types";
import DesignModal from "@/components/home/designs-modal";
import Header from "@/components/home/header";
import RecentDesigns from "@/components/home/recent-designs";
import SideBar from "@/components/home/sidebar";
import { getUserDesigns } from "@/services/design-service";
import { useEditorStore } from "@/store";
import { useEffect } from "react";

export default function Home() {
  const {
    showDesignsModal,
    setShowDesignsModal,
    userDesigns,

    userDesignsLoading,
  } = useEditorStore();

  return (
    <div className="flex min-h-screen bg-white">
      <SideBar />
      <div className="flex-1 flex flex-col ml-[72px]">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto pt-20">
          <Banner />
          <DesignTypes />
          <RecentDesigns />
        </main>
      </div>

      <DesignModal
        isOpen={showDesignsModal}
        onClose={setShowDesignsModal}
        userDesigns={userDesigns}
        setShowDesignsModal={setShowDesignsModal}
        userDesignsLoading={userDesignsLoading}
      />
    </div>
  );
}

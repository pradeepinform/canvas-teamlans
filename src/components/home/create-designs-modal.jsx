"use client";

import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Sparkles } from "lucide-react";
import CreateAllSocialMeadiaDesigns from "./create-all-social-meadia-designs";

function CreateDesignModel({
  isOpen,
  onClose,
  userDesigns,
  setShowAllSoialMeadia,
  userDesignsLoading,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={"sm:max-w-[1400px] h-[600px] p-0 gap-0 overflow-auto"}
      >
        <div className="flex flex-col">
          <div className="p-6">
            <DialogTitle
              className={"text-2xl font-bold mb-4 flex items-center"}
            >
              <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
              Create All Designs
            </DialogTitle>
          </div>

          <CreateAllSocialMeadiaDesigns
            setShowAllSoialMeadia={setShowAllSoialMeadia}
            isModalView={true}
            listOfDesigns={userDesigns}
            isLoading={userDesignsLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateDesignModel;

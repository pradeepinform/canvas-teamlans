"use client";

import { centerCanvas } from "@/fabric/fabric-utils";
import { saveCanvasState } from "@/services/design-service";
import { debounce } from "lodash";
import { create } from "zustand";

export const useEditorStore = create((set, get) => ({
  // fabric.js canvas instance store karta hai
  canvas: null,

  // canvas set karta hai aur agar canvas set ho to usse center karta hai
  setCanvas: (canvas) => {
    set({ canvas });
    if (canvas) {
      centerCanvas(canvas);  // canvas ko viewport ke beech me center karta hai
    }
  },

  // current design ka unique ID store karta hai
  designId: null,

  // designId set karne ke liye function
  setDesignId: (id) => set({ designId: id }),

  // editing mode flag - agar true ho to edit mode me hai
  isEditing: true,

  // editing mode ko set karta hai
  setIsEditing: (flag) => set({ isEditing: flag }),

  // design ka naam store karta hai
  name: "teamlans Design",

  // design ka naam set karta hai
  setName: (value) => set({ name: value }),

  // properties panel dikhana ya chhupana ka flag
  showProperties: false,

  // properties panel ka visibility set karta hai
  setShowProperties: (flag) => set({ showProperties: flag }),

  // design ke save hone ka status (e.g. "saved", "saving...", "error")
  saveStatus: "saved",

  // saveStatus set karta hai
  setSaveStatus: (status) => set({ saveStatus: status }),

  // last modification timestamp ko store karta hai
  lastModified: Date.now(),

  // design me modification hua ya nahi (true/false)
  isModified: false,

  // design ko modified mark karta hai aur debounced save call karta hai
  markAsModified: () => {
    const designId = get().designId;

    if (designId) {
      set({
        lastModified: Date.now(),    // current time ko lastModified set karta hai
        saveStatus: "Saving...",     // status ko "Saving..." set karta hai
        isModified: true,            // design ko modified mark karta hai
      });

      get().debouncedSaveToServer(); // debounce function ke through saveToServer call karta hai (delay ke sath)
    } else {
      console.error("No design ID Available");
    }
  },

  // backend me canvas aur design name save karta hai
  saveToServer: async () => {
    const designId = get().designId;
    const canvas = get().canvas;

    if (!canvas || !designId) {
      console.log("No design ID Available or canvas instance is not available");
      return null; // agar canvas ya designId nahi hai to save nahi karega
    }

    try {
      // canvas state ko backend me save karta hai
      const savedDesign = await saveCanvasState(canvas, designId, get().name);

      set({
        saveStatus: "Saved",  // save successful hone par status update karta hai
        isModified: false,    // design ko ab modified nahi mark karta (kyunki save ho chuka)
      });

      return savedDesign;    // saved data return karta hai
    } catch (e) {
      set({ saveStatus: "Error" }); // error aane par status "Error" set karta hai
      return null;
    }
  },

  // saveToServer function ko debounce karta hai (500ms delay ke sath)
  debouncedSaveToServer: debounce(() => {
    get().saveToServer();
  }, 500),

  // user ke subscription data ko store karta hai (e.g. paid/free)
  userSubscription: null,

  // user subscription data set karta hai
  setUserSubscription: (data) => set({ userSubscription: data }),

  // user ke designs ka array store karta hai
  userDesigns: [],

  // user designs ko set karta hai
  setUserDesigns: (data) => set({ userDesigns: data }),

  // user designs loading indicator flag (true/false)
  userDesignsLoading: false,

  // user designs loading flag set karta hai
  setUserDesignsLoading: (flag) => set({ userDesignsLoading: flag }),

  // premium modal show/hide flag
  showPremiumModal: false,

  // premium modal visibility set karta hai
  setShowPremiumModal: (flag) => set({ showPremiumModal: flag }),

  // designs modal show/hide flag
  showDesignsModal: false,

  // designs modal visibility set karta hai
  setShowDesignsModal: (flag) => set({ showDesignsModal: flag }),

  // store ko reset karta hai initial state pe
  resetStore: () => {
    set({
      canvas: null,
      designId: null,
      isEditing: true,
      name: "teamlance Design",  // note: yaha "teamlance" typo hai "teamlans" ki jagah?
      showProperties: false,
      saveStatus: "Saved",
      isModified: false,
      lastModified: Date.now(),
    });
  },
}));

"use client";
import Box from "@/component/boxAnimation";
import Cylinder from "@/component/cyclinderAnimation";
import Sphere from "@/component/sphereAnimation";
import BoxMaterial from "@/component/RealWorldObj/box";
import StudioLightScene from "@/component/RealWorldObj/firstModel";
import { useState } from "react";

export default function Home() {
  const [selectedComponent, setSelectedComponent] = useState("Box");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectionChange = (event: any) => {
    setSelectedComponent(event.target.value);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="justify-center items-center text-center font-[family-name:var(--font-geist-mono)]">
        This is the Three.js Scene
      </div>

      <div className="text-center my-4">
        <label htmlFor="component-selector" className="mr-2 font-medium">
          Select Shape:
        </label>
        <select
          id="component-selector"
          value={selectedComponent}
          onChange={handleSelectionChange}
          className="p-2 border rounded-md cursor-pointer"
        >
          <option value="Box">Box</option>
          <option value="Sphere">Sphere</option>
          <option value="Cylinder">Cylinder</option>
          {/* <option value="BoxTexture">BoxMaterial</option>
          <option value="Buddha">Buddha</option> */}
        </select>
      </div>

      {/* Conditionally render the selected component */}
      <div className="flex-1 overflow-hidden">
        {selectedComponent === "Box" && <Box />}
        {selectedComponent === "Sphere" && <Sphere />}
        {selectedComponent === "Cylinder" && <Cylinder />}
        {/* {selectedComponent === "BoxTexture" && <BoxMaterial />}
        {selectedComponent === "Buddha" && <StudioLightScene />} */}
      </div>
    </div>
  );
}

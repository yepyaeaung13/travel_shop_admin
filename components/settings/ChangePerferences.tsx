import React from "react";
import SettingsThemeButton from "./SettingsThemeButton";
import SettingsLanguageButton from "./SettingsLanguageButton";

const ChangePerferences = () => {
  return (
    <div className="bg-card w-full rounded-[20px]">
      <h2 className="border-b p-5 text-xl font-medium">Preferences</h2>
      <div className="flex h-full w-full flex-col gap-2 px-4 py-5 md:flex-row md:gap-5 md:px-5">
        <SettingsThemeButton />
        <SettingsLanguageButton />
      </div>
    </div>
  );
};

export default ChangePerferences;

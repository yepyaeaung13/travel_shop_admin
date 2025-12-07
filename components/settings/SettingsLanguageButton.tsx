"use client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";

const SettingsLanguageButton = () => {
  const [language, setLanguage] = useState("en");
  const changeLanguage = (value: string) => {
    if (language === "en") {
      setLanguage("my");
    } else {
      setLanguage("en");
    }
  };
  
  return (
    <div className="flex w-full flex-col space-y-2.5">
      <Label className="text-lg">Language</Label>
      <Select
        defaultValue={language ?? "en"}
        onValueChange={(value) => changeLanguage(value)}
      >
        <SelectTrigger className="w-full rounded-[20px] border border-[#A1A1A1] px-4 py-6">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="my">Myanmar</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SettingsLanguageButton;

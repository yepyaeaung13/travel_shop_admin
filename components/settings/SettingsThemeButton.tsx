"use client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import React from "react";

const SettingsThemeButton = () => {
  const { setTheme, theme } = useTheme();
  return (
    <div className="flex w-full flex-col space-y-2.5">
      <Label className="text-lg">Theme</Label>
      <Select defaultValue={theme ?? "light"} onValueChange={setTheme}>
        <SelectTrigger className="w-full rounded-[20px] border border-[#A1A1A1] px-4 py-6">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SettingsThemeButton;

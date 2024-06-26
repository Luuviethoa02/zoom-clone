"use client";
import { useTheme } from "./ThemeStream";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const SelectTheme = () => {
  const { setTheme } = useTheme();

  const handleThemeChange = (value: "dark" | "light") => {
    
    setTheme(value);
  };

  return (
    <Select onValueChange={handleThemeChange}>
      <SelectTrigger color="white" className="w-[100px]">
        <SelectValue
          className="text-white dark:text-[#333]"
          placeholder="Theme"
        />
      </SelectTrigger>
      <SelectContent className="text-white dark:text-[#333]">
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectTheme;

import { useState } from "react";
import MenuHeader from "../components/MenuHeader";
import MenuItem from "../components/MenuItem";
import CheckIcon from "../components/CheckIcon";

import "./AppearanceMenu.css";

interface AppearanceMenuProps {
  onBack: () => void;
}

export default function AppearanceMenu({ onBack }: AppearanceMenuProps) {
  const [currentTheme] = useState<"system" | "light" | "dark" | "comfort">(
    "dark",
  );

  return (
    <>
      <MenuHeader title="Appearance" onBack={onBack} />

      <div className="appearance-menu">
        <MenuItem
          label="System"
          rightSlot={currentTheme === "system" ? <CheckIcon /> : undefined}
        />

        <MenuItem
          label="Light"
          rightSlot={currentTheme === "light" ? <CheckIcon /> : undefined}
        />

        <MenuItem
          label="Dark"
          rightSlot={currentTheme === "dark" ? <CheckIcon /> : undefined}
        />

        <MenuItem
          label="Kiwi Comfort"
          rightSlot={currentTheme === "comfort" ? <CheckIcon /> : undefined}
        />
      </div>
    </>
  );
}

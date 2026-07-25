import { useState } from "react";
import MenuHeader from "../components/MenuHeader";
import MenuItem from "../components/MenuItem";
import CheckIcon from "../components/CheckIcon";

import "./LanguageMenu.css";

interface LanguageMenuProps {
  onBack: () => void;
}

type Language = "english" | "hindi";

export default function LanguageMenu({ onBack }: LanguageMenuProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("english");

  return (
    <>
      <MenuHeader title="Language" onBack={onBack} />

      <div className="language-menu">
        <MenuItem
          label="English"
          onClick={() => setCurrentLanguage("english")}
          rightSlot={currentLanguage === "english" ? <CheckIcon /> : undefined}
        />

        <MenuItem
          label="Hindi"
          onClick={() => setCurrentLanguage("hindi")}
          rightSlot={currentLanguage === "hindi" ? <CheckIcon /> : undefined}
        />
      </div>
    </>
  );
}

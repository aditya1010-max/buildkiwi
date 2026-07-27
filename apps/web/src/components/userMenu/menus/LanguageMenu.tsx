import { useLanguage } from "../../../hooks/useLanguage";
import MenuHeader from "../components/MenuHeader";
import MenuItem from "../components/MenuItem";
import CheckIcon from "../components/CheckIcon";

import "./LanguageMenu.css";

interface LanguageMenuProps {
  onBack: () => void;
}

export default function LanguageMenu({ onBack }: LanguageMenuProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <>
      <MenuHeader title={t("language") || "Language"} onBack={onBack} />

      <div className="language-menu">
        <MenuItem
          label={t("english") || "English"}
          onClick={() => setLanguage("en")}
          rightSlot={language === "en" ? <CheckIcon /> : undefined}
        />

        <MenuItem
          label={t("hindi") || "Hindi"}
          onClick={() => setLanguage("hi")}
          rightSlot={language === "hi" ? <CheckIcon /> : undefined}
        />

        <MenuItem
          label={t("system") || "System Default"}
          onClick={() => setLanguage("system")}
          rightSlot={language === "system" ? <CheckIcon /> : undefined}
        />
      </div>
    </>
  );
}

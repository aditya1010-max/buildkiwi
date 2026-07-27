import MenuHeader from "../components/MenuHeader";
import MenuItem from "../components/MenuItem";
import CheckIcon from "../components/CheckIcon";
import { useTheme } from "../../../hooks/useTheme";
import { useLanguage } from "../../../hooks/useLanguage";

import "./AppearanceMenu.css";

interface AppearanceMenuProps {
  onBack: () => void;
}

export default function AppearanceMenu({ onBack }: AppearanceMenuProps) {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <>
      <MenuHeader title={t("appearance")} onBack={onBack} />

      <div className="appearance-menu">
        <MenuItem
          label={t("system")}
          onClick={() => setTheme("system")}
          rightSlot={theme === "system" ? <CheckIcon /> : undefined}
        />

        <MenuItem
          label={t("light")}
          onClick={() => setTheme("light")}
          rightSlot={theme === "light" ? <CheckIcon /> : undefined}
        />

        <MenuItem
          label={t("dark")}
          onClick={() => setTheme("dark")}
          rightSlot={theme === "dark" ? <CheckIcon /> : undefined}
        />

        <MenuItem label={t("kiwiComfort")} disabled />
      </div>
    </>
  );
}

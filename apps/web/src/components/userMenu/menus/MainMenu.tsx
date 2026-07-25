// import MenuDivider from "../components/MenuDivider";
import MenuItem from "../components/MenuItem";
import ChevronRight from "../components/ChevronRight";

interface MainMenuProps {
  onAppearance: () => void;
  onLanguage: () => void;
  onHelp: () => void;
  onLogout: () => void;
}

export default function MainMenu({
  onAppearance,
  onLanguage,
  onHelp,
  onLogout,
}: MainMenuProps) {
  return (
    <>
      <MenuItem
        label="Appearance"
        rightSlot={<ChevronRight />}
        onClick={onAppearance}
      />

      <MenuItem
        label="Language"
        rightSlot={<ChevronRight />}
        onClick={onLanguage}
      />
      <MenuItem label="Notifications" />
      <MenuItem label="Account" />
      <MenuItem label="Privacy" />
      <MenuItem label="Help" rightSlot={<ChevronRight />} onClick={onHelp} />

      <MenuItem label="Send Feedback" />
      <MenuItem label="Logout" danger onClick={onLogout} />
    </>
  );
}

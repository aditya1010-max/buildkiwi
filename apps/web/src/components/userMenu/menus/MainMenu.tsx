import MenuItem from "../components/MenuItem";
import ChevronRight from "../components/ChevronRight";
import { useLanguage } from "../../../hooks/useLanguage";
import { features } from "../../../config/features";

interface MainMenuProps {
  onAppearance: () => void;
  onLanguage: () => void;
  onNotifications: () => void;
  onPrivacy: () => void;
  onHelp: () => void;
  onLogout: () => void;
  onAccount: () => void;
  onFeedback: () => void;
}

export default function MainMenu({
  onAppearance,
  onLanguage,
  onNotifications,
  onPrivacy,
  onHelp,
  onLogout,
  onAccount,
  onFeedback,
}: MainMenuProps) {
  const { t } = useLanguage();

  return (
    <>
      <MenuItem
        label={t("appearance")}
        rightSlot={<ChevronRight />}
        onClick={onAppearance}
      />

      <MenuItem
        label={t("notifications")}
        rightSlot={<ChevronRight />}
        onClick={onNotifications}
      />

      <MenuItem
        label={t("language")}
        rightSlot={<ChevronRight />}
        onClick={onLanguage}
      />

      {features.accountMenu && (
        <MenuItem
          label={t("account")}
          rightSlot={<ChevronRight />}
          onClick={onAccount}
        />
      )}

      <MenuItem
        label={t("privacy")}
        rightSlot={<ChevronRight />}
        onClick={onPrivacy}
      />

      <MenuItem
        label={t("help")}
        rightSlot={<ChevronRight />}
        onClick={onHelp}
      />

      <MenuItem label={t("sendFeedback")} onClick={onFeedback} />

      <MenuItem label={t("logout")} danger onClick={onLogout} />
    </>
  );
}

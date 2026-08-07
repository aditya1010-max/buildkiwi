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
  onAccount?: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onFeedback: () => void;
  user: {
    username: string;
  } | null;
}

export default function MainMenu({
  onAppearance,
  onLanguage,
  onNotifications,
  onPrivacy,
  onHelp,
  onLogout,
  onAccount,
  onLogin,
  onRegister,
  onFeedback,
  user,
}: MainMenuProps) {
  const { t } = useLanguage();

  return (
    <>
      {!user && (
        <>
          <MenuItem
            label="Sign In"
            rightSlot={<ChevronRight />}
            onClick={onLogin}
          />

          <MenuItem
            label="Create Account"
            rightSlot={<ChevronRight />}
            onClick={onRegister}
          />
        </>
      )}

      <MenuItem
        label={t("appearance")}
        rightSlot={<ChevronRight />}
        onClick={onAppearance}
      />

      {user && (
        <MenuItem
          label={t("notifications")}
          rightSlot={<ChevronRight />}
          onClick={onNotifications}
        />
      )}

      <MenuItem
        label={t("language")}
        rightSlot={<ChevronRight />}
        onClick={onLanguage}
      />

      {user && features.accountMenu && (
        <MenuItem
          label={t("account")}
          rightSlot={<ChevronRight />}
          onClick={onAccount}
        />
      )}

      {user && (
        <MenuItem
          label={t("privacy")}
          rightSlot={<ChevronRight />}
          onClick={onPrivacy}
        />
      )}

      <MenuItem
        label={t("help")}
        rightSlot={<ChevronRight />}
        onClick={onHelp}
      />

      <MenuItem label={t("sendFeedback")} onClick={onFeedback} />

      {user && <MenuItem label={t("logout")} danger onClick={onLogout} />}
    </>
  );
}

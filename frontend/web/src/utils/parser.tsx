import PushOnRepo from "../components/HooksForms/Github";
import DiscordReaction from "../components/HooksForms/Discord";
import EveryMinutes from "../components/HooksForms/Area";

const getForm = (hook: string, props?: any) => {
  switch (hook) {
    case "discord":
      return <DiscordReaction {...props} />;
    case "github":
      return <PushOnRepo {...props} />;
    case "area":
      return <EveryMinutes {...props} />;
    default:
      return "";
  }
};

export { getForm };

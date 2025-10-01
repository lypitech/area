import Catalog from "./catalog";
import Events from "./events";
import Page from "./page";
import News from "./news";
import Search from "./search";
import Pen from "./pen";
import Return from "./return";
import Dashboard from "./dashboard";
import Login from "./login";
import Home from "./home";
import Logout from "./logout";
import Admin from "./admin";
import Lock from "./lock";
import At from "./at";
import Menu from "./menu";
import Mail from "./mail";
import Cross from "./cross";
import YourSpace from "./yourSpace";
import Settings from "./settings";
import Plus from "./plus";
import App from "./app";

type IconName = string;

type Props = {
  iconName?: IconName;
  iconClass?: string;
};

const iconComponents: { [name in IconName]: React.FC<{ className: string }> } =
  {
    catalog: Catalog,
    events: Events,
    page: Page,
    news: News,
    search: Search,
    pen: Pen,
    return: Return,
    dashboard: Dashboard,
    login: Login,
    home: Home,
    logout: Logout,
    admin: Admin,
    lock: Lock,
    at: At,
    mail: Mail,
    menu: Menu,
    cross: Cross,
    yourSpace: YourSpace,
    settings: Settings,
    plus: Plus,
    app: App,
    default: Home,
  };

const Icon = ({ iconName, iconClass }: Props) => {
  const IconComponent = iconName ? iconComponents[iconName] : Catalog;

  return (
    <IconComponent
      className={`place-self-center flex-shrink-0 ${iconClass} `}
    />
  );
};

export default Icon;

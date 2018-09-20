import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import Logout from "./components/Logout";
import DashboardHome from "./components/Home/Home";
import Consumer from "./components/Consumer/Consumer";
import Settings from "./components/Settings/Settings";
import Producer from "./components/Producer/Producer";
import Hardware from "./components/Hardware/Hardware";
import Finance from "./components/Finance/Finance";
import homeIcon from './static/home_icon.png';
import consumerIcon from './static/consumer_icon.png';
import hardwareIcon from './static/hardware_icon.png';
import settingsIcon from './static/settings_icon.png';
import producerIcon from './static/finance_icon.png';
import financeIcon from './static/marketer_icon.png';

export const publicRoutes = {
  SignUp: {
    path: "/",
    component: SignUp,
    title: "Sign up"
  },
  SignIn: {
    path: "/sign-in",
    component: SignIn,
    title: "Sign In"
  }
};

export const privateRoutes = {
  DashboardHome: {
    path: "/home",
    component: DashboardHome,
    title: "Home",
    icon: homeIcon
  },
  Finances: {
    path: "/finances",
    component: Finance,
    title: 'Finances',
    icon: financeIcon,
  },
  Consumer: {
    path: "/consumer",
    component: Consumer,
    title: "Consumer",
    icon: consumerIcon
  },
  Producer: {
    path: "/producer",
    component: Producer,
    title: "Producer",
    icon: producerIcon
  },
  Hardware: {
    path: "/hardware",
    component: Hardware,
    title: "Hardware",
    icon: hardwareIcon
  },
  Settings: {
    path: "/settings",
    component: Settings,
    title: "Settings",
    icon: settingsIcon
  },
  Logout: {
    path: "/logout",
    component: Logout,
    title: "Logout"
  }
};

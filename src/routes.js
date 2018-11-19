import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import Forgot from "./components/SignIn/Forgot";
import DashboardHome from "./components/Home/Home";
import Consumer from "./components/Consumer/Consumer";
import Settings from "./components/Settings/Settings";
import Producer from "./components/Producer/Producer";
import Hardware from "./components/Hardware/Hardware";
import Finance from "./components/Finance/Finance";
import Billing from "./components/Billing/Billing"

import homeIconOff from "./static/home_icon_off.png";
import consumerIconOff from "./static/consumer_icon_off.png";
import hardwareIconOff from "./static/hardware_icon_off.png";
import settingsIconOff from "./static/settings_icon_off.png";
import producerIconOff from "./static/finance_icon_off.png";
import financeIconOff from "./static/marketer_icon_off.png";

import homeIconOn from "./static/home_icon_on.png";
import consumerIconOn from "./static/consumer_icon_on.png";
import hardwareIconOn from "./static/hardware_icon_on.png";
import settingsIconOn from "./static/settings_icon_on.png";
import producerIconOn from "./static/finance_icon_on.png";
import financeIconOn from "./static/marketer_icon_on.png";

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
  },
  Forgot: {
    path: '/organization-reminder',
    component: Forgot,
    title: "Recover Organization"
  }
};

export const privateRoutes = {
  DashboardHome: {
    path: "/home",
    component: DashboardHome,
    title: "Home",
    iconOff: homeIconOff,
    iconOn: homeIconOn
  },
  Billing: {
    path: "/billing",
    component: Billing,
    title: "Billing",
    iconOff: financeIconOff,
    iconOn: financeIconOn
  },
  Finances: {
    path: "/finances",
    component: Finance,
    title: "Finances",
    iconOff: financeIconOff,
    iconOn: financeIconOn
  },
  Consumer: {
    path: "/consumer",
    component: Consumer,
    title: "Consumer",
    iconOff: consumerIconOff,
    iconOn: consumerIconOn
  },
  Producer: {
    path: "/producer",
    component: Producer,
    title: "Producer",
    iconOff: producerIconOff,
    iconOn: producerIconOn
  },
  Hardware: {
    path: "/hardware",
    component: Hardware,
    title: "Hardware",
    iconOff: hardwareIconOff,
    iconOn: hardwareIconOn
  },
  Settings: {
    path: "/settings",
    component: Settings,
    title: "Settings",
    iconOff: settingsIconOff,
    iconOn: settingsIconOn
  },
  
};

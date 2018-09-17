import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Logout from './components/Logout';
import DashboardHome from './components/Home/Home';
import Consumer from './components/Consumer/Consumer';
import Settings from './components/Settings/Settings';
import Producer from './components/Producer/Producer';
import Finance from './components/Finance/Finance';

export const publicRoutes = {
  SignUp: {
    path: '/',
    component: SignUp
  },
  SignIn: {
    path: '/sign-in',
    component: SignIn
  },
  Logout: {
    path: '/logout',
    component: Logout
  }
};

export const privateRoutes = {
  DashboardHome: {
    path: '/dashboard',
    component: DashboardHome,
  },
  Finances: {
    path: '/dashboard/finances',
    component: Finance,
  },
  Consumer: {
    path: '/dashboard/consumer',
    component: Consumer
  },
  Producer: {
    path: '/dashboard/Map',
    component: Producer
  },
  Settings: {
    path: '/dashboard/settings',
    component: Settings
  }
}

import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Logout from './components/Logout';
import DashboardHome from './components/Home/Home';
import Consumer from './components/Consumer/Consumer';
import Settings from './components/Settings/Settings';
import Map from './components/Map/Map';

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
  Consumer: {
    path: '/dashboard/consumer',
    component: Consumer
  },
  Settings: {
    path: '/dashboard/settings',
    component: Settings
  }
}

import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Logout from './components/Logout';
import DashboardHome from './components/Home/Home';
import Consumer from './components/Consumer/Consumer';
import Settings from './components/Settings/Settings';
import Producer from './components/Producer/Producer';
// Hardware
import React from 'react';
import Finance from './components/Finance/Finance';

export const publicRoutes = {
  SignUp: {
    path: '/',
    component: SignUp,
    title: 'Sign up'
  },
  SignIn: {
    path: '/sign-in',
    component: SignIn,
    title: 'Sign In'
  },
  Logout: {
    path: '/logout',
    component: Logout,
    title: 'Logout'
  }
};

export const privateRoutes = {
  DashboardHome: {
    path: '/home',
    component: DashboardHome,
    title: 'Home',
    icon: 'home',
  },
  Finances: {
    path: '/dashboard/finances',
    component: Finance,
    title: 'Finances',
    icon: 'home',
  },
  Consumer: {
    path: '/consumer',
    component: Consumer,
    title: 'Consumer',
    icon: 'users'
  },
  Producer: {
    path: '/producer',
    component: Producer,
    title: 'Producer',
    icon: 'map'
  },
  Hardware: {
    path: '/hardware',
    component: () => <div/>,
    title: 'Hardware',
    icon: 'digital-tachograph'
  },
  Settings: {
    path: '/settings',
    component: Settings,
    title: 'Settings',
    icon: 'cog'
  }
}

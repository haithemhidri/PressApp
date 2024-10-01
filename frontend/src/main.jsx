import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store';
import { Provider } from 'react-redux';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import TargetWebsitesComponent from './components/TargetWebsitesComponent.jsx'; 
import HelpComponent from './components/HelpComponent.jsx';
import WebsiteGroupsComponent from './components/WebsiteGroupsComponent';
import SearchConfigurationComponent from './components/SearchConfigurationComponent.jsx'
import SearchResultComponent from './components/searchResultComponent.jsx';



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<SearchResultComponent />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='' element={<PrivateRoute />}>
        <Route path='/profile' element={<ProfileScreen />} />
      </Route>
      <Route path='/target-websites' element={<TargetWebsitesComponent />} />
      <Route path="help" element={<HelpComponent />} />
      <Route path='/website-groups' element={<WebsiteGroupsComponent />} />
      <Route path='/search-configuration' element={<SearchConfigurationComponent />} />
      <Route path='/history' element={<SearchResultComponent />} />

    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);

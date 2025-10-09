import { Router, Route } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import Header from '@/components/layout/Header';
import Home from '@/pages/Home';
import Properties from '@/pages/Properties';
import PropertyDetails from '@/pages/PropertyDetails';
import Agents from '@/pages/Agents';
import Developers from '@/pages/Developers';
import DeveloperDetails from '@/pages/DeveloperDetails';
import Archive from '@/pages/Archive';
import Careers from '@/pages/Careers';
import CareerDetails from '@/pages/CareerDetails';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import Favorites from '@/pages/Favorites';
import Notifications from '@/pages/Notifications';
import Settings from '@/pages/Settings';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Footer from '@/components/layout/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import '@/i18n/config';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Route path="/" component={Home} />
            <Route path="/properties" component={Properties} />
            <Route path="/properties/:id" component={PropertyDetails} />
            <Route path="/agents" component={Agents} />
            <Route path="/developers" component={Developers} />
            <Route path="/developers/:id" component={DeveloperDetails} />
            <Route path="/archive" component={Archive} />
            <Route path="/careers" component={Careers} />
            <Route path="/careers/:id" component={CareerDetails} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/profile">
              <ProtectedRoute><Profile /></ProtectedRoute>
            </Route>
            <Route path="/favorites">
              <ProtectedRoute><Favorites /></ProtectedRoute>
            </Route>
            <Route path="/notifications">
              <ProtectedRoute><Notifications /></ProtectedRoute>
            </Route>
            <Route path="/settings">
              <ProtectedRoute><Settings /></ProtectedRoute>
            </Route>
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
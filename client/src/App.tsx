import { Router, Route } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { queryClient } from '@/lib/queryClient';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingFallback from '@/components/ui/LoadingFallback';
import '@/i18n/config';

// Lazy load all page components
const Home = lazy(() => import('@/pages/Home'));
const Properties = lazy(() => import('@/pages/Properties'));
const PropertyDetails = lazy(() => import('@/pages/PropertyDetails'));
const Agents = lazy(() => import('@/pages/Agents'));
const Developers = lazy(() => import('@/pages/Developers'));
const DeveloperDetails = lazy(() => import('@/pages/DeveloperDetails'));
const Archive = lazy(() => import('@/pages/Archive'));
const Careers = lazy(() => import('@/pages/Careers'));
const CareerDetails = lazy(() => import('@/pages/CareerDetails'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Profile = lazy(() => import('@/pages/Profile'));
const Favorites = lazy(() => import('@/pages/Favorites'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const Settings = lazy(() => import('@/pages/Settings'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Suspense fallback={<LoadingFallback />}>
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
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
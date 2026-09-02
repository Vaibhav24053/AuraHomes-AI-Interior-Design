import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter, Redirect } from 'wouter';

// Layout
import { SiteNav } from '@/components/layout/SiteNav';
import { Footer } from '@/components/layout/Footer';

// Pages
import Home from '@/pages/home';
import DesignFlow from '@/pages/design';
import BudgetPage from '@/pages/budget';
import CommunityPage from '@/pages/community';

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location}
        className="min-h-screen"
        data-testid="route-outlet"
        initial={{ opacity: 0.12, y: 8 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.08, y: -5 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <RoutedErrorBoundary>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/design" component={DesignFlow} />
            
            {/* Redirects from old routes */}
            <Route path="/quiz">
              <Redirect to="/design" />
            </Route>
            <Route path="/transform">
              <Redirect to="/design" />
            </Route>
            
            <Route path="/budget" component={BudgetPage} />
            <Route path="/community" component={CommunityPage} />
            <Route component={NotFound} />
          </Switch>
          
          {/* Footer shows on all pages except the design flow tool which needs full height focus */}
          {location !== '/design' && <Footer />}
        </RoutedErrorBoundary>
      </motion.div>
    </AnimatePresence>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <SiteNav />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Discover from "@/pages/Discover";
import CreateProfile from "@/pages/CreateProfile";
import ViewProfile from "@/pages/ViewProfile";
import EditProfile from "@/pages/EditProfile";
import MyListings from "@/pages/MyListings";
import AddEditListing from "@/pages/AddEditListing";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      {/* Protected app routes */}
      <Route path="/app">
        <Redirect to="/app/dashboard" />
      </Route>
      <Route path="/app/dashboard">
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      </Route>
      <Route path="/app/discover">
        <ProtectedRoute><Discover /></ProtectedRoute>
      </Route>
      <Route path="/app/profile/create">
        <ProtectedRoute><CreateProfile /></ProtectedRoute>
      </Route>
      <Route path="/app/profile/edit">
        <ProtectedRoute><EditProfile /></ProtectedRoute>
      </Route>
      <Route path="/app/profile/:id">
        <ProtectedRoute><ViewProfile /></ProtectedRoute>
      </Route>
      <Route path="/app/listings">
        <ProtectedRoute><MyListings /></ProtectedRoute>
      </Route>
      <Route path="/app/listings/add">
        <ProtectedRoute><AddEditListing /></ProtectedRoute>
      </Route>
      <Route path="/app/listings/edit/:id">
        <ProtectedRoute><AddEditListing /></ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

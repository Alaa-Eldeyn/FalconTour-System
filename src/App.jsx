import { Route, Routes } from "react-router-dom";
import {
  ForgetPassword,
  Login,
  Notfound,
  Resetpassword,
  SharedLayout,
} from "./components";
import {
  AddSuperAdmin,
  Airlines,
  Airports,
  BillSummary,
  Booking,
  Branches,
  Categories,
  Clients,
  ClientsReports,
  Currencies,
  DailyBillReports,
  DailyClientsReports,
  Employees,
  Payments,
  Profile,
  RangeBillReports,
  RangeClientsReports,
  Reports,
  ServiceBooking,
  Services,
  Settings,
  TripBooking,
  Trips,
} from "./components/dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget_password" element={<ForgetPassword />} />
        <Route path="/reset_password" element={<Resetpassword />} />
        <Route path="/dashboard" element={<SharedLayout />}>
          <Route index element={<Reports />} />
          <Route path="profile" element={<Profile />} />
          <Route path="booking" element={<Booking />} />
          <Route path="booking/trip" element={<TripBooking />} />
          <Route path="booking/service" element={<ServiceBooking />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients_report" element={<ClientsReports />} />
          <Route
            path="clients_report/daily_clients_reports"
            element={<DailyClientsReports />}
          />
          <Route
            path="clients_report/range_clients_reports"
            element={<RangeClientsReports />}
          />
          <Route path="bill_summary" element={<BillSummary />} />
          <Route
            path="bill_summary/daily_bill_reports"
            element={<DailyBillReports />}
          />
          <Route
            path="bill_summary/range_bill_reports"
            element={<RangeBillReports />}
          />
          <Route path="employees" element={<Employees />} />
          <Route path="branches" element={<Branches />} />
          <Route path="trips" element={<Trips />} />
          <Route path="categories" element={<Categories />} />
          <Route path="airlines" element={<Airlines />} />
          <Route path="airports" element={<Airports />} />
          <Route path="currencies" element={<Currencies />} />
          <Route path="payments" element={<Payments />} />
          <Route path="services" element={<Services />} />
          <Route path="settings" element={<Settings />} />
          <Route path="add_super_admin" element={<AddSuperAdmin />} />
        </Route>
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
}

export default App;

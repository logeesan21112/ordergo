import React from "react";
import Layout from "../../layout/Layout.jsx";
import AllDeliveriesComponent from "./AllDeliveriesComponent.jsx";
import TodayDeliveriesComponent from "./TodayDeliveriesComponent.jsx";
import DeliveryFilterComponent from "./DeliveryFilterComponent.jsx";
import ApiService from "../../service/ApiService";

const DeliveryPage = () => {
  const role = ApiService.getRole();
  const isPrivileged = role === "ADMIN" || role === "MANAGER";

  return (
    <Layout>
      <AllDeliveriesComponent />
      <DeliveryFilterComponent />
      {isPrivileged && <TodayDeliveriesComponent />}
    </Layout>
  );
};

export default DeliveryPage;
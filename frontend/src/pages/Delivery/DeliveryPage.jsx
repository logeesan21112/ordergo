import React from "react";
import Layout from "../../layout/Layout.jsx";
import AllDeliveriesComponent from "./AllDeliveriesComponent.jsx";
import TodayDeliveriesComponent from "./TodayDeliveriesComponent.jsx";
import DeliveryFilterComponent from "./DeliveryFilterComponent.jsx";
import ApiService from "../../service/ApiService";

const DeliveryPage = () => {
  const isAdmin = ApiService.isAdmin();

  return (
    <Layout>
      <AllDeliveriesComponent />
      <DeliveryFilterComponent />
      {isAdmin && <TodayDeliveriesComponent />}
    </Layout>
  );
};

export default DeliveryPage;

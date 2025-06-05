import React from 'react';
import TableSection from '../table/table';

const FoodOrders = ({ isActive }) => (
  <TableSection
    id="foods"
    title="Food Orders"
    subtitle="View food order details"
    icon="fa-utensils"
    columns={['Food Name', 'Price', 'Quantity', 'Payment Status']}
    isActive={isActive}
  />
);

export default FoodOrders;
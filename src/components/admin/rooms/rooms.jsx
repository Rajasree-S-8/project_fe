import React from 'react';
import TableSection from '../table/table';

const Rooms = ({ isActive }) => (
  <TableSection
    id="rooms"
    title="Rooms"
    subtitle="View room assignment details"
    icon="fa-bed"
    columns={['Room Number', 'Customer Name', 'Check-in Date', 'Check-out Date', 'Price']}
    isActive={isActive}
  />
);

export default Rooms;
import React from 'react';
import TableSection from '../table/table';

const RatingsReviews = ({ isActive }) => (
  <TableSection
    id="ratings-reviews"
    title="Ratings & Reviews"
    subtitle="View customer ratings and reviews"
    icon="fa-star"
    columns={['Customer Name', 'Rating', 'Description']}
    isActive={isActive}
  />
);

export default RatingsReviews;
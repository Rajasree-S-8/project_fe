import React from 'react';

const TableSection = ({ id, title, subtitle, icon, columns, isActive }) => (
  <div id={id} className={`mt-5 ${!isActive && 'd-none'}`}>
    <h1 className="h3 fw-bold mb-1">{title}</h1>
    <p className="text-muted mb-4">{subtitle}</p>
    <div className="card shadow-sm">
      <div className="card-header bg-light d-flex align-items-center">
        <i className={`fas ${icon} me-2`} />
        <span className="fw-semibold">{title} Data</span>
      </div>
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-12 col-md-6 d-flex align-items-center mb-3 mb-md-0">
            <label htmlFor={`${id}-entries`} className="form-label me-2 text-muted">
              Entries per page
            </label>
            <select id={`${id}-entries`} className="form-select form-select-sm w-auto">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
          <div className="col-12 col-md-6">
            <input type="search" className="form-control form-control-sm" placeholder="Search..." />
          </div>
        </div>
        <div className="table-container table-responsive">
          <table className="dataTable table table-bordered" id={`${id}-table`}>
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} scope="col" className="sorting" tabIndex={0}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default TableSection;
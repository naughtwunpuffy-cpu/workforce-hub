import { useState, useEffect } from 'react';
import { api } from '../api/client';
import DataTable from '../components/DataTable';
import Commentary from '../components/Commentary';
import ProgressRing from '../components/ProgressRing';

export default function LabourOverview() {
  const [overview, setOverview] = useState(null);
  const [departments, setDepartments] = useState(null);
  const [planned, setPlanned] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/labour/overview'),
      api.get('/labour/departments'),
      api.get('/labour/planned-vs-actual')
    ]).then(([o, d, p]) => {
      setOverview(o);
      setDepartments(d);
      setPlanned(p);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const totalRow = overview?.data?.find(r => r.category === 'Total Combined');
  const fillRate = totalRow ? Math.round((totalRow.actual / totalRow.budget) * 100 * 10) / 10 : 0;

  return (
    <div>
      <h2 className="page-title">Labour Overview</h2>

      {/* Top metrics */}
      <div className="summary-row">
        <div className="summary-card">
          <div className="summary-value">{totalRow?.actual?.toLocaleString() || '--'}</div>
          <div className="summary-label">Total Headcount</div>
        </div>
        <div className="summary-card">
          <ProgressRing value={fillRate} size={64} stroke={5} />
          <div className="summary-label" style={{ marginTop: 4 }}>Fill Rate</div>
        </div>
        <div className="summary-card">
          <div className="summary-value" style={{ color: 'var(--red)' }}>{Math.abs(totalRow?.variance || 0)}</div>
          <div className="summary-label">Under Budget</div>
        </div>
      </div>

      {/* Budget vs Actual table */}
      <div className="card">
        <div className="card-title">Budget vs Actual</div>
        {overview?.data && (
          <DataTable
            columns={[
              { key: 'category', label: 'Category' },
              { key: 'budget', label: 'Budget', numeric: true, render: v => v?.toLocaleString() },
              { key: 'actual', label: 'Actual', numeric: true, render: v => v?.toLocaleString() },
              { key: 'variance', label: 'Variance', numeric: true, variance: true, render: v => v?.toLocaleString() },
              { key: 'variance_pct', label: 'Var %', numeric: true, variance: true, render: v => `${v}%` },
            ]}
            data={overview.data}
            totalRow
          />
        )}
        <Commentary text={overview?.commentary} />
      </div>

      {/* Own Employees by Department */}
      <div className="section-title">Own Employees by Department</div>
      <div className="card">
        {departments?.ownEmployees && (
          <DataTable
            columns={[
              { key: 'department', label: 'Department' },
              { key: 'budget', label: 'Budget', numeric: true, render: v => v?.toLocaleString() },
              { key: 'actual', label: 'Actual', numeric: true, render: v => v?.toLocaleString() },
              { key: 'variance', label: 'Variance', numeric: true, variance: true, render: v => v?.toLocaleString() },
            ]}
            data={departments.ownEmployees}
          />
        )}
      </div>

      {/* Contractors */}
      <div className="section-title">Contractors</div>
      <div className="card">
        {departments?.contractors && (
          <DataTable
            columns={[
              { key: 'department', label: 'Category' },
              { key: 'budget', label: 'Budget', numeric: true, render: v => v?.toLocaleString() },
              { key: 'actual', label: 'Actual', numeric: true, render: v => v?.toLocaleString() },
              { key: 'variance', label: 'Variance', numeric: true, variance: true, render: v => v?.toLocaleString() },
            ]}
            data={departments.contractors}
          />
        )}
        <Commentary text={departments?.commentary} />
      </div>

      {/* Planned vs Actual */}
      <div className="section-title">Actual vs Planned Headcount</div>
      <div className="card">
        {planned?.data && (
          <DataTable
            columns={[
              { key: 'category', label: 'Category' },
              { key: 'planned', label: 'Planned', numeric: true, render: v => v?.toLocaleString() },
              { key: 'actual', label: 'Actual', numeric: true, render: v => v?.toLocaleString() },
              { key: 'variance', label: 'Var', numeric: true, variance: true, render: v => v?.toLocaleString() },
              { key: 'variance_pct', label: '%', numeric: true, variance: true, render: v => `${v}%` },
              { key: 'prior_month', label: 'Prior', numeric: true, render: v => v?.toLocaleString() },
              { key: 'mom_change', label: 'MoM', numeric: true, variance: true, render: v => v?.toLocaleString() },
            ]}
            data={planned.data}
            totalRow
          />
        )}
        <Commentary text={planned?.commentary} />
      </div>
    </div>
  );
}

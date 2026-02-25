import { useState, useEffect } from 'react';
import { api } from '../api/client';
import DataTable from '../components/DataTable';
import Commentary from '../components/Commentary';

export default function EmployeeRelations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/employee-relations').then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const totals = data?.data?.reduce((acc, r) => ({
    opened: acc.opened + r.opened,
    resolved: acc.resolved + r.resolved,
    pending: acc.pending + r.pending,
    prior_month: acc.prior_month + r.prior_month,
  }), { opened: 0, resolved: 0, pending: 0, prior_month: 0 });

  const tableData = data?.data ? [...data.data, { er_category: 'Total', ...totals, _isTotal: true }] : [];

  return (
    <div>
      <h2 className="page-title">Employee Relations</h2>

      <div className="kpi-grid">
        <div className="kpi-tile green">
          <div className="kpi-value">{data?.resolutionRate}%</div>
          <div className="kpi-label">Resolution Rate</div>
        </div>
        <div className="kpi-tile navy">
          <div className="kpi-value">{totals?.pending || 0}</div>
          <div className="kpi-label">Pending Cases</div>
        </div>
        <div className="kpi-tile navy">
          <div className="kpi-value">{totals?.opened || 0}</div>
          <div className="kpi-label">Opened This Month</div>
        </div>
        <div className="kpi-tile green">
          <div className="kpi-value">{totals?.resolved || 0}</div>
          <div className="kpi-label">Resolved</div>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={[
            { key: 'er_category', label: 'ER Category' },
            { key: 'opened', label: 'Opened', numeric: true },
            { key: 'resolved', label: 'Resolved', numeric: true },
            { key: 'pending', label: 'Pending', numeric: true },
            { key: 'prior_month', label: 'Prior Month', numeric: true },
          ]}
          data={tableData}
          totalRow
        />
        <Commentary text={data?.commentary} />
      </div>
    </div>
  );
}

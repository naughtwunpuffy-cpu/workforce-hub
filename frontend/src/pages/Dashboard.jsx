import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import ProgressRing from '../components/ProgressRing';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/kpis/summary').then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!data) return <p>Failed to load dashboard data.</p>;

  const fillPct = data.fillRate;
  const kpiMap = {};
  data.kpis.forEach(k => { kpiMap[k.kpi_name] = k; });

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      <p className="page-subtitle">Period: {data.period}</p>

      {/* Top summary */}
      <div className="summary-row">
        <div className="summary-card">
          <div className="summary-value">{data.totalHeadcount?.toLocaleString()}</div>
          <div className="summary-label">Total Headcount</div>
        </div>
        <div className="summary-card">
          <ProgressRing value={fillPct} size={64} stroke={5} color={fillPct >= 95 ? 'var(--green)' : fillPct >= 90 ? 'var(--amber)' : 'var(--red)'} />
          <div className="summary-label" style={{ marginTop: 4 }}>Fill Rate</div>
        </div>
        <div className="summary-card">
          <div className="summary-value" style={{ color: 'var(--red)' }}>{data.criticalVacancies}</div>
          <div className="summary-label">Critical Vacancies</div>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid">
        <KPITile kpi={kpiMap['Absenteeism Rate']} label="Absenteeism" invertColor />
        <KPITile kpi={kpiMap['Labour Turnover']} label="Labour Turnover" invertColor />
        <KPITile kpi={kpiMap['Training Compliance']} label="Training" />
        <KPITile kpi={kpiMap['Critical Fill Rate']} label="Critical Fill" />
        <KPITile kpi={kpiMap['Overtime %']} label="Overtime" invertColor />
        <KPITile kpi={kpiMap['ER Resolution Rate']} label="ER Resolution" />
        <KPITile kpi={kpiMap['Vacancy Rate']} label="Vacancy Rate" invertColor />
        <div className="kpi-tile navy">
          <div className="kpi-value">{data.pendingERCases}</div>
          <div className="kpi-label">Pending ER Cases</div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="card">
        <div className="card-title">Quick Navigation</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
          {[
            { to: '/labour', label: 'Labour Overview' },
            { to: '/recruitment', label: 'Recruitment' },
            { to: '/employee-relations', label: 'Employee Relations' },
            { to: '/critical-skills', label: 'Critical Skills' },
            { to: '/shafts', label: 'Shaft Focus' },
            { to: '/upload', label: 'Upload Data' },
          ].map(link => (
            <Link key={link.to} to={link.to} style={{
              display: 'block', padding: '12px', background: 'var(--gray-50)',
              borderRadius: 'var(--radius-sm)', textDecoration: 'none',
              color: 'var(--navy)', fontSize: 13, fontWeight: 500,
              border: '1px solid var(--gray-100)'
            }}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function KPITile({ kpi, label, invertColor }) {
  if (!kpi) return <div className="kpi-tile navy"><div className="kpi-value">--</div><div className="kpi-label">{label}</div></div>;

  const val = kpi.actual_value;
  const target = kpi.target_value;
  const isGood = invertColor ? val <= target : val >= target;

  return (
    <div className={`kpi-tile ${isGood ? 'green' : 'navy'}`}>
      <div className="kpi-value">{val}{kpi.unit === '%' ? '%' : ''}</div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-target">Target: {target}{kpi.unit === '%' ? '%' : ''}</div>
    </div>
  );
}

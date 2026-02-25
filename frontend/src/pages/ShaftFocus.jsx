import { useState, useEffect } from 'react';
import { api } from '../api/client';
import DataTable from '../components/DataTable';
import Commentary from '../components/Commentary';

export default function ShaftFocus() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/shafts').then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <h2 className="page-title">Key Shafts to Focus On</h2>

      <div className="card">
        <DataTable
          columns={[
            { key: 'shaft_name', label: 'Shaft/Site' },
            { key: 'headcount', label: 'HC', numeric: true, render: v => v?.toLocaleString() },
            { key: 'vacancies', label: 'Vac', numeric: true },
            { key: 'attrition_pct', label: 'Attr%', numeric: true, render: v => `${v}%` },
            { key: 'er_cases', label: 'ER', numeric: true },
          ]}
          data={data?.data || []}
        />
      </div>

      {/* Shaft cards */}
      {data?.data?.map(shaft => (
        <div key={shaft.shaft_name} className="card" onClick={() => setSelected(selected === shaft.id ? null : shaft.id)}
          style={{ cursor: 'pointer', borderLeft: `4px solid ${shaft.attrition_pct >= 7 ? 'var(--red)' : shaft.attrition_pct >= 6 ? 'var(--amber)' : 'var(--green)'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="card-title">{shaft.shaft_name}</div>
              <div className="card-subtitle">{shaft.key_issue}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--navy)' }}>{shaft.headcount.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>headcount</div>
            </div>
          </div>
          {selected === shaft.id && (
            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <Stat label="Vacancies" value={shaft.vacancies} color={shaft.vacancies > 100 ? 'var(--red)' : 'var(--navy)'} />
              <Stat label="Attrition" value={`${shaft.attrition_pct}%`} color={shaft.attrition_pct >= 7 ? 'var(--red)' : 'var(--navy)'} />
              <Stat label="ER Cases" value={shaft.er_cases} color={shaft.er_cases > 15 ? 'var(--red)' : 'var(--navy)'} />
            </div>
          )}
        </div>
      ))}

      <Commentary title="Focus Areas & Action Plans" text={data?.commentary} />
    </div>
  );
}

function Stat({ label, value, color = 'var(--navy)' }) {
  return (
    <div style={{ textAlign: 'center', padding: 8, background: 'var(--gray-50)', borderRadius: 8 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--gray-500)' }}>{label}</div>
    </div>
  );
}

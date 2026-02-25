import { useState, useEffect } from 'react';
import { api } from '../api/client';
import DataTable from '../components/DataTable';
import Commentary from '../components/Commentary';
import ProgressRing from '../components/ProgressRing';

export default function CriticalSkills() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/critical-skills').then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <h2 className="page-title">Critical Skills Overview</h2>

      <div className="kpi-grid">
        <div className="kpi-tile green">
          <div className="kpi-value">{data?.overallFillRate}%</div>
          <div className="kpi-label">Overall Fill Rate</div>
        </div>
        <div className="kpi-tile navy">
          <div className="kpi-value">{data?.totalVacancy}</div>
          <div className="kpi-label">Total Vacancies</div>
        </div>
      </div>

      <div className="card">
        {data?.data && (
          <DataTable
            columns={[
              { key: 'skill_name', label: 'Critical Skill' },
              { key: 'required', label: 'Req', numeric: true },
              { key: 'in_post', label: 'In Post', numeric: true },
              { key: 'vacancy', label: 'Vacant', numeric: true },
              { key: 'fill_rate', label: 'Fill %', numeric: true, render: v => `${v}%` },
              { key: 'risk_level', label: 'Risk', render: v => (
                <span className={`badge badge-${v?.toLowerCase()}`}>{v}</span>
              )},
            ]}
            data={data.data}
          />
        )}
        <Commentary text={data?.commentary} />
      </div>

      {/* Visual breakdown */}
      <div className="card">
        <div className="card-title">Fill Rate by Skill</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginTop: 12 }}>
          {data?.data?.map(skill => (
            <div key={skill.skill_name} style={{ textAlign: 'center' }}>
              <ProgressRing
                value={skill.fill_rate}
                size={72}
                stroke={5}
                color={skill.fill_rate >= 90 ? 'var(--green)' : skill.fill_rate >= 85 ? 'var(--amber)' : 'var(--red)'}
              />
              <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 4, maxWidth: 80 }}>{skill.skill_name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

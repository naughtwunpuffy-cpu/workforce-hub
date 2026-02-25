import { useState, useEffect } from 'react';
import { api } from '../api/client';
import Commentary from '../components/Commentary';

export default function KPIs() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/kpis').then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <h2 className="page-title">HR Key Performance Indicators</h2>

      <div className="kpi-grid">
        {data?.data?.map(kpi => {
          const isInverse = ['Absenteeism Rate', 'Labour Turnover', 'Vacancy Rate', 'Overtime %', 'Time to Fill'].includes(kpi.kpi_name);
          const isGood = isInverse ? kpi.actual_value <= kpi.target_value : kpi.actual_value >= kpi.target_value;
          const isClose = isInverse
            ? kpi.actual_value <= kpi.target_value * 1.2
            : kpi.actual_value >= kpi.target_value * 0.8;

          let tileClass = 'green';
          if (!isGood) tileClass = isClose ? 'navy' : 'red';

          return (
            <div key={kpi.kpi_name} className={`kpi-tile ${tileClass}`}>
              <div className="kpi-value">
                {kpi.actual_value}{kpi.unit === '%' ? '%' : ''}
              </div>
              <div className="kpi-label">{kpi.kpi_name}</div>
              <div className="kpi-target">
                Target: {kpi.target_value}{kpi.unit === '%' ? '%' : kpi.unit === 'days' ? ' days' : ''}
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Highlights */}
      <div className="section-title">Key Commentary & Highlights</div>

      <div className="card" style={{ borderLeft: '4px solid var(--navy)' }}>
        <div className="card-title">Labour Cost Highlights</div>
        <p style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6, marginTop: 8 }}>
          {data?.highlights?.labourCost || 'No commentary available.'}
        </p>
      </div>

      <div className="card" style={{ borderLeft: '4px solid var(--green)' }}>
        <div className="card-title">Recruitment Pipeline</div>
        <p style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6, marginTop: 8 }}>
          {data?.highlights?.recruitmentPipeline || 'No commentary available.'}
        </p>
      </div>

      <div className="card" style={{ borderLeft: '4px solid var(--red)' }}>
        <div className="card-title">Key Risks & Actions Required</div>
        <div style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6, marginTop: 8 }}>
          {data?.highlights?.risks?.split('\n').map((line, i) => (
            <p key={i} style={{ marginBottom: 6 }}>{line}</p>
          )) || 'No risks listed.'}
        </div>
      </div>
    </div>
  );
}

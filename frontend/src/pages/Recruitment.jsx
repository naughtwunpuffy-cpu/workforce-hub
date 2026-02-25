import { useState, useEffect } from 'react';
import { api } from '../api/client';
import DataTable from '../components/DataTable';
import Commentary from '../components/Commentary';

export default function Recruitment() {
  const [data, setData] = useState(null);
  const [promoData, setPromoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/recruitment'),
      api.get('/recruitment/promotions-transfers')
    ]).then(([r, p]) => {
      setData(r);
      setPromoData(p);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const valCols = [
    { key: 'metric', label: 'Metric' },
    { key: 'current_fy_value', label: 'Current FY', numeric: true, render: v => typeof v === 'number' && v < 100 && v % 1 !== 0 ? `${v}%` : v?.toLocaleString() },
    { key: 'prior_fy_value', label: 'Prior FY', numeric: true, render: v => typeof v === 'number' && v < 100 && v % 1 !== 0 ? `${v}%` : v?.toLocaleString() },
    { key: 'variance', label: 'Variance', numeric: true, variance: true, render: v => typeof v === 'number' && Math.abs(v) < 10 && v % 1 !== 0 ? `${v}%` : v?.toLocaleString() },
  ];

  const promoCols = [
    { key: 'category', label: 'Category' },
    { key: 'current_fy', label: 'Current FY', numeric: true },
    { key: 'prior_fy', label: 'Prior FY', numeric: true },
    { key: 'variance', label: 'Variance', numeric: true, variance: true },
  ];

  return (
    <div>
      <h2 className="page-title">Employee Movements</h2>

      {/* New Recruits */}
      <div className="section-title">New Recruits</div>
      <div className="card">
        {data?.recruitment && <DataTable columns={valCols} data={data.recruitment} />}
      </div>

      {/* Terminations */}
      <div className="section-title">Terminations</div>
      <div className="card">
        {data?.terminations && <DataTable columns={valCols} data={data.terminations} />}
        <Commentary text={data?.commentary} />
      </div>

      {/* Promotions */}
      <div className="section-title">Promotions</div>
      <div className="card">
        {promoData?.promotions && <DataTable columns={promoCols} data={promoData.promotions} />}
      </div>

      {/* Transfers */}
      <div className="section-title">Internal Transfers</div>
      <div className="card">
        {promoData?.transfers && <DataTable columns={promoCols} data={promoData.transfers} />}
        <Commentary text={promoData?.commentary} />
      </div>
    </div>
  );
}

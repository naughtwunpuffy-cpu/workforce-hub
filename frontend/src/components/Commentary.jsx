export default function Commentary({ title = 'Key Commentary', text }) {
  if (!text) return null;
  return (
    <div className="commentary">
      <div className="commentary-title">{title}</div>
      {text.split('\n').map((line, i) => <p key={i} style={{ marginBottom: i < text.split('\n').length - 1 ? 6 : 0 }}>{line}</p>)}
    </div>
  );
}

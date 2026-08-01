const DashboardStatCard = ({ title, value, icon: Icon, color = "blue", description }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex items-center gap-5 hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border ${colorMap[color] || colorMap.blue}`}>
        <Icon />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
        <h4 className="text-2xl font-black text-slate-900 mt-0.5">{value}</h4>
        {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
      </div>
    </div>
  );
};

export default DashboardStatCard;

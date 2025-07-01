export function StatCards() {
  const stats = [
    { title: "Expected MO", value: "120", color: "bg-blue-50 text-blue-800", valueColor: "text-blue-800" },
    { title: "Total MO", value: "100", color: "bg-green-50 text-green-800", valueColor: "text-green-800" },
    { title: "Approval Pending", value: "20", color: "bg-red-50 text-red-800", valueColor: "text-red-600" },
    { title: "Inactive", value: "40", color: "bg-gray-50 text-gray-800", valueColor: "text-gray-800" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.color} p-4 rounded-md`}>
          <div className="text-sm">{stat.title}</div>
          <div className={`text-3xl font-bold mt-1 ${stat.valueColor}`}>{stat.value}</div>
        </div>
      ))}
    </div>
  )
}

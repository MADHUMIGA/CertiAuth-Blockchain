const Explorer = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Blockchain Explorer
      </h2>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-700 text-sm">
            <tr>
              <th className="p-4">Block</th>
              <th className="p-4">Transaction Hash</th>
              <th className="p-4">Certificate Hash</th>
              <th className="p-4">Timestamp</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            <tr className="border-t">
              <td className="p-4">--</td>
              <td className="p-4 font-mono text-indigo-600">--</td>
              <td className="p-4 font-mono text-slate-600">--</td>
              <td className="p-4 text-slate-500">--</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Explorer;
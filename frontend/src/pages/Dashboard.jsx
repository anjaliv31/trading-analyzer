import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [tradesFile, setTradesFile] = useState(null);
  const [newsFile, setNewsFile] = useState(null);
  const [analysis, setAnalysis] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success("Logged out successfully!");
    navigate('/login');
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!tradesFile || !newsFile) {
      toast.error("❗ Please select both files");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Unauthorized. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append('trades', tradesFile);
    formData.append('news', newsFile);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });

      if (res.data && res.data.analysis) {
        setAnalysis(res.data.analysis);
        toast.success('✅ Analysis received!');
      } else {
        toast.warn('⚠️ No analysis data returned.');
        setAnalysis([]);
      }
    } catch (err) {
      console.error(err);
      toast.error('❌ Upload or analysis failed');
      setAnalysis([]);
    }
  };

  const chartData = {
    labels: analysis.map(item => item.stock),
    datasets: [
      {
        label: 'Confidence %',
        data: analysis.map(item => Number(item.confidence.replace('%', ''))),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Profit ($)',
        data: analysis.map(item => Number(item.profit.replace('$', ''))),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Trading Analysis Overview' },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-md relative">
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">📈 Trading Pattern Analyzer</h2>

        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setTradesFile(e.target.files[0])}
            className="w-full p-2 border rounded"
          />
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setNewsFile(e.target.files[0])}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Upload and Analyze
          </button>
        </form>

        <div className="mt-6">
          <h3 className="text-xl font-medium mb-3">📊 Analysis Results</h3>
          {analysis && analysis.length > 0 ? (
            <>
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Stock</th>
                    <th className="border border-gray-300 px-4 py-2">Signal</th>
                    <th className="border border-gray-300 px-4 py-2">Confidence</th>
                    <th className="border border-gray-300 px-4 py-2">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.map((item, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">{item.stock}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.signal}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.confidence}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.profit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-8">
                <Bar options={options} data={chartData} />
              </div>
            </>
          ) : (
            <p className="text-gray-600 mt-4">Upload files to view analysis results.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

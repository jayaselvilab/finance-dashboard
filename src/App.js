import { fetchRecords, createRecord } from './api';


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  // 1. STATE MANAGEMENT
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({ title: '', amount: '', type: 'Income' });

  // 2. FETCH DATA FROM RENDER
  const fetchData = async () => {
    try {
      const res = await axios.get('https://finance-dashboard-qp4r.onrender.com/api/records');
      setRecords(res.data);
    } catch (err) { 
      console.error("Fetch Error:", err); 
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  // 3. HANDLE FORM SUBMISSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = { ...formData, amount: Number(formData.amount) };
      await axios.post('https://finance-dashboard-qp4r.onrender.com/api/records', dataToSave);
      
      setFormData({ title: '', amount: '', type: 'Income' });
      fetchData(); // Refresh list and chart
    } catch (err) { 
      alert("Error saving record. Check if Render backend is active."); 
    }
  };

  // 4. CALCULATE SUMMARY (With Lowercase Safety)
  const income = records
    .filter(r => r.type && r.type.toLowerCase() === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = records
    .filter(r => r.type && r.type.toLowerCase() === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = income - expense;

  // 5. CHART CONFIGURATION
  const chartData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ['#2ecc71', '#e74c3c'],
        borderColor: ['#27ae60', '#c0392b'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>Advanced Finance Dashboard</h1>

      {/* SUMMARY CARDS */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
        <div style={cardStyle}>Income: <br/><b style={{color: '#2ecc71'}}>₹{income}</b></div>
        <div style={cardStyle}>Expense: <br/><b style={{color: '#e74c3c'}}>₹{expense}</b></div>
        <div style={cardStyle}>Balance: <br/><b>₹{netBalance}</b></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        
        {/* INPUT FORM */}
        <div style={boxStyle}>
          <h3>Add Transaction</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={inputStyle} required />
            <input type="number" placeholder="Amount" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} style={inputStyle} required />
            <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} style={inputStyle}>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
            <button type="submit" style={btnStyle}>Save Record</button>
          </form>
        </div>

        {/* VISUAL CHART */}
        <div style={{ ...boxStyle, width: '300px' }}>
          <h3>Visual Analytics</h3>
          {income > 0 || expense > 0 ? (
            <Pie data={chartData} />
          ) : (
            <p style={{ textAlign: 'center', color: '#7f8c8d' }}>Add data to see chart</p>
          )}
        </div>
      </div>

      {/* HISTORY TABLE */}
      <div style={{ marginTop: '40px', maxWidth: '800px', margin: '40px auto' }}>
        <h3>History</h3>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: '#2c3e50', color: '#fff' }}>
              <th style={p10}>Title</th>
              <th style={p10}>Type</th>
              <th style={p10}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => {
              const recordType = r.type ? r.type.toLowerCase() : '';
              return (
                <tr key={r._id} style={{ borderBottom: '1px solid #ddd', background: '#fff' }}>
                  <td style={p10}>{r.title || 'Untitled'}</td>
                  <td style={{ 
                    ...p10, 
                    color: recordType === 'income' ? '#2ecc71' : '#e74c3c', 
                    fontWeight: 'bold' 
                  }}>
                    {r.type ? r.type.toUpperCase() : 'N/A'}
                  </td>
                  <td style={p10}>₹{r.amount || 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// STYLES
const cardStyle = { background: '#fff', padding: '20px', borderRadius: '10px', width: '150px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' };
const boxStyle = { background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', minWidth: '300px' };
const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd' };
const btnStyle = { padding: '12px', background: '#2c3e50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', borderRadius: '10px', overflow: 'hidden' };
const p10 = { padding: '12px', textAlign: 'left' };

export default App;
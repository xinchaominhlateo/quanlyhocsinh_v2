import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const COLORS = ['#0088FE', '#FF8042'];

    useEffect(() => {
        axios.get('/dashboard-stats')
            .then(res => setStats(res.data.data));
    }, []);

    if (!stats) return <p>Đang tải dữ liệu...</p>;

    return (
        <div className="container-fluid p-4">
            <h2 className="fw-bold text-primary mb-4">🏠 TỔNG QUAN HỆ THỐNG</h2>
            
            {/* Hàng thẻ thống kê nhanh */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card bg-primary text-white shadow p-3">
                        <h5>Tổng Học Sinh</h5>
                        <h2>{stats.tong_hoc_sinh}</h2>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card bg-success text-white shadow p-3">
                        <h5>Học Phí Đã Thu</h5>
                        <h2>{Number(stats.doanh_thu).toLocaleString()} đ</h2>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card bg-info text-white shadow p-3">
                        <h5>Tổng Lớp Học</h5>
                        <h2>{stats.tong_lop}</h2>
                    </div>
                </div>
            </div>

            {/* Hàng biểu đồ */}
            <div className="row">
                <div className="col-md-6">
                    <div className="card shadow p-3">
                        <h5 className="text-center">Tỉ lệ Giới tính</h5>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={stats.ti_le_gioi_tinh} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                        {stats.ti_le_gioi_tinh.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
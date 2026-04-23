import { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Users, School, GraduationCap } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const ThongKe = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('/thongke/dashboard')
      .then(res => setStats(res.data.data))
      .catch(err => console.log(err));
  }, []);

  if (!stats) return <div className="text-center mt-5">Đang tải dữ liệu thống kê...</div>;

  // Chuẩn bị dữ liệu cho biểu đồ
  const chartData = {
    labels: stats.academic_stats.map(item => item.xep_loai || 'Chưa xếp loại'),
    datasets: [
      {
        label: 'Số lượng học sinh',
        data: stats.academic_stats.map(item => item.so_luong),
        backgroundColor: [
          '#28a745', // Giỏi - Xanh lá
          '#007bff', // Khá - Xanh dương
          '#ffc107', // Trung bình - Vàng
          '#dc3545', // Yếu - Đỏ
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container-fluid mb-5">
      <h2 className="text-primary fw-bold mb-4">📊 THỐNG KÊ TỔNG QUAN</h2>

      {/* Thẻ đếm số lượng */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-primary text-white p-3">
            <div className="d-flex align-items-center">
              <Users size={40} className="me-3" />
              <div>
                <h5 className="mb-0">Học Sinh</h5>
                <h2 className="fw-bold mb-0">{stats.counts.hoc_sinh}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-success text-white p-3">
            <div className="d-flex align-items-center">
              <GraduationCap size={40} className="me-3" />
              <div>
                <h5 className="mb-0">Giáo Viên</h5>
                <h2 className="fw-bold mb-0">{stats.counts.giao_vien}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-info text-white p-3">
            <div className="d-flex align-items-center">
              <School size={40} className="me-3" />
              <div>
                <h5 className="mb-0">Lớp Học</h5>
                <h2 className="fw-bold mb-0">{stats.counts.lop_hoc}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ xếp loại */}
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card shadow-sm p-4 border-0">
            <h5 className="text-center fw-bold mb-4">Tỷ Lệ Học Lực Toàn Trường</h5>
            <div style={{ height: '350px' }}>
              <Pie data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThongKe;
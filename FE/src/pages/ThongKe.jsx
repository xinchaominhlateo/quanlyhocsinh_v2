import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, GraduationCap, Library, BookOpen } from 'lucide-react';

const ThongKe = () => {
  const [soLieu, setSoLieu] = useState({
    tong_hoc_sinh: 0,
    tong_giao_vien: 0,
    tong_lop_hoc: 0,
    tong_mon_hoc: 0
  });

  const [dangTai, setDangTai] = useState(true);

  useEffect(() => {
    axios.get('/thong-ke/tong-quan')
      .then(res => {
        setSoLieu(res.data.data);
        setDangTai(false);
      })
      .catch(err => {
        console.error("Lỗi lấy dữ liệu thống kê:", err);
        setDangTai(false);
      });
  }, []);

  if (dangTai) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container-fluid mb-5">
      <div className="d-flex align-items-center mb-4">
        <h2 className="text-primary fw-bold m-0">📊 BÁO CÁO THỐNG KÊ TỔNG QUAN</h2>
      </div>

      <div className="row g-4">
        {/* Card Học Sinh */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 bg-primary text-white h-100 rounded-4 p-3 hover-scale">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="card-title text-uppercase fw-bold opacity-75 mb-1">Tổng Học Sinh</h6>
                <h2 className="display-5 fw-bold m-0">{soLieu.tong_hoc_sinh}</h2>
              </div>
              <div className="bg-white text-primary rounded-circle p-3 shadow-sm">
                <Users size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Card Giáo Viên */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 bg-success text-white h-100 rounded-4 p-3 hover-scale">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="card-title text-uppercase fw-bold opacity-75 mb-1">Tổng Giáo Viên</h6>
                <h2 className="display-5 fw-bold m-0">{soLieu.tong_giao_vien}</h2>
              </div>
              <div className="bg-white text-success rounded-circle p-3 shadow-sm">
                <GraduationCap size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Card Lớp Học */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 bg-warning text-dark h-100 rounded-4 p-3 hover-scale">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="card-title text-uppercase fw-bold opacity-75 mb-1">Tổng Số Lớp</h6>
                <h2 className="display-5 fw-bold m-0">{soLieu.tong_lop_hoc}</h2>
              </div>
              <div className="bg-white text-warning rounded-circle p-3 shadow-sm">
                <Library size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Card Môn Học */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 bg-danger text-white h-100 rounded-4 p-3 hover-scale">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="card-title text-uppercase fw-bold opacity-75 mb-1">Môn Giảng Dạy</h6>
                <h2 className="display-5 fw-bold m-0">{soLieu.tong_mon_hoc}</h2>
              </div>
              <div className="bg-white text-danger rounded-circle p-3 shadow-sm">
                <BookOpen size={32} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hover-scale { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hover-scale:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
      `}</style>
    </div>
  );
};

export default ThongKe;
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const XinNghiPhep = () => {
  const [danhSachDon, setDanhSachDon] = useState([]);
  const userRole = localStorage.getItem('userRole') || 'student';
  const [form, setForm] = useState({ ngay_bat_dau: '', ngay_ket_thuc: '', ly_do: '' });

  useEffect(() => { layDuLieu(); }, []);

  const layDuLieu = () => {
    axios.get('/donnghiphep').then(res => setDanhSachDon(res.data.data)).catch(console.error);
  };

  // HỌC SINH NỘP ĐƠN
  const handleNopDon = (e) => {
    e.preventDefault();
    axios.post('/donnghiphep', form).then(() => {
      Swal.fire('Thành công', 'Đã gửi đơn xin nghỉ phép!', 'success');
      setForm({ ngay_bat_dau: '', ngay_ket_thuc: '', ly_do: '' });
      layDuLieu();
    }).catch(err => {
      Swal.fire('Lỗi', err.response?.data?.message || 'Có lỗi xảy ra', 'error');
    });
  };

  // GIÁO VIÊN DUYỆT ĐƠN
  const handleDuyet = (id, trangThaiMoi) => {
    axios.put(`/donnghiphep/${id}`, { trang_thai: trangThaiMoi }).then(() => {
      Swal.fire('Đã lưu', `Đơn đã chuyển sang: ${trangThaiMoi}`, 'success');
      layDuLieu();
    });
  };

  // HỌC SINH HỦY ĐƠN (Chỉ khi đang chờ duyệt)
  const handleHuyDon = (id) => {
    Swal.fire({ title: 'Hủy đơn này?', icon: 'warning', showCancelButton: true }).then(res => {
      if(res.isConfirmed) {
        axios.delete(`/donnghiphep/${id}`).then(() => {
          Swal.fire('Đã hủy', '', 'success');
          layDuLieu();
        });
      }
    });
  };

  return (
    <div className="container-fluid mb-5">
      <h2 className="text-primary fw-bold mb-4">✉️ QUẢN LÝ NGHỈ PHÉP</h2>

      {/* CHỈ HỌC SINH MỚI THẤY FORM NÀY */}
      {userRole === 'student' && (
        <div className="card shadow-sm mb-4 border-info">
          <div className="card-header bg-info text-white fw-bold">📝 Viết Đơn Xin Nghỉ Phép</div>
          <div className="card-body">
            <form onSubmit={handleNopDon} className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-bold">Từ ngày</label>
                <input type="date" className="form-control" value={form.ngay_bat_dau} onChange={e => setForm({...form, ngay_bat_dau: e.target.value})} required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Đến ngày</label>
                <input type="date" className="form-control" value={form.ngay_ket_thuc} onChange={e => setForm({...form, ngay_ket_thuc: e.target.value})} required />
              </div>
              <div className="col-md-12">
                <label className="form-label fw-bold">Lý do xin nghỉ</label>
                <textarea className="form-control" rows="2" placeholder="Ví dụ: Bị ốm, Việc gia đình..." value={form.ly_do} onChange={e => setForm({...form, ly_do: e.target.value})} required></textarea>
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-primary fw-bold px-4 shadow">🚀 Gửi Đơn Cho Giáo Viên</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BẢNG LỊCH SỬ DÀNH CHO CẢ 2 BÊN */}
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white fw-bold">
          {userRole === 'student' ? 'Lịch Sử Xin Nghỉ Của Tôi' : 'Danh Sách Đơn Cần Duyệt'}
        </div>
        <table className="table table-hover mb-0 text-center align-middle">
          <thead className="table-secondary">
            <tr>
              {userRole !== 'student' && <th>Học Sinh</th>}
              {userRole !== 'student' && <th>Lớp</th>}
              <th>Từ ngày</th>
              <th>Đến ngày</th>
              <th className="text-start">Lý do</th>
              <th>Trạng thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {danhSachDon.length > 0 ? danhSachDon.map(don => (
              <tr key={don.id}>
                {userRole !== 'student' && <td className="fw-bold text-primary">{don.hoc_sinh?.ho_ten}</td>}
                {userRole !== 'student' && <td>{don.hoc_sinh?.lop_hoc?.ten_lop}</td>}
                <td>{don.ngay_bat_dau}</td>
                <td>{don.ngay_ket_thuc}</td>
                <td className="text-start text-muted">{don.ly_do}</td>
                <td>
                  <span className={`badge p-2 shadow-sm ${
                    don.trang_thai === 'Đã duyệt' ? 'bg-success' : 
                    don.trang_thai === 'Từ chối' ? 'bg-danger' : 'bg-warning text-dark'
                  }`}>
                    {don.trang_thai}
                  </span>
                </td>
                <td>
                  {/* Nếu là HỌC SINH và đơn đang chờ duyệt -> Cho phép Xóa/Hủy */}
                  {userRole === 'student' && don.trang_thai === 'Chờ duyệt' && (
                    <button className="btn btn-sm btn-outline-danger fw-bold" onClick={() => handleHuyDon(don.id)}>Hủy đơn</button>
                  )}
                  
                  {/* Nếu là GIÁO VIÊN và đơn đang chờ duyệt -> Cho phép Duyệt/Từ chối */}
                  {userRole !== 'student' && don.trang_thai === 'Chờ duyệt' && (
                    <div className="d-flex justify-content-center gap-2">
                      <button className="btn btn-sm btn-success fw-bold shadow-sm" onClick={() => handleDuyet(don.id, 'Đã duyệt')}>✅ Duyệt</button>
                      <button className="btn btn-sm btn-danger fw-bold shadow-sm" onClick={() => handleDuyet(don.id, 'Từ chối')}>❌ Từ chối</button>
                    </div>
                  )}
                </td>
              </tr>
            )) : (
              <tr><td colSpan="7" className="text-muted py-3">Không có đơn xin nghỉ phép nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default XinNghiPhep;
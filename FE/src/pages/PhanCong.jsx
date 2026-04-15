import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const PhanCong = () => {
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [danhSachGV, setDanhSachGV] = useState([]);
  const [form, setForm] = useState({ lop_hoc_id: '', giao_vien_id: '' });

  useEffect(() => {
    layDuLieu();
  }, []);

  const layDuLieu = () => {
    // Gọi API lấy danh sách phân công (từ PhanCongController m vừa viết)
    axios.get('/phancong').then(res => setDanhSachLop(res.data.data));
    // Lấy thêm danh sách giáo viên để hiện lên cái dropdown chọn
    axios.get('/giaovien').then(res => setDanhSachGV(res.data.data));
  };

  const handlePhanCong = (e) => {
    e.preventDefault();
    axios.post('/phancong', form)
      .then((res) => {
        Swal.fire({ icon: 'success', title: 'Tuyệt vời', text: res.data.message, timer: 1500 });
        layDuLieu(); // Load lại bảng
      })
      .catch(err => Swal.fire('Lỗi', 'Không phân công được!', 'error'));
  };

  const handleHuyPhanCong = (lop_id, gv_id) => {
    Swal.fire({
      title: 'Bỏ phân công?',
      text: "Bạn có chắc muốn xóa giáo viên này khỏi lớp?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đúng, Xóa luôn!',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/phancong/${lop_id}/${gv_id}`)
          .then((res) => {
            Swal.fire('Đã xóa!', res.data.message, 'success');
            layDuLieu();
          });
      }
    });
  };

  return (
    <div className="container-fluid">
      <h2 className="text-primary fw-bold mb-4">🗓️ PHÂN CÔNG GIẢNG DẠY</h2>
      
      {/* KHU VỰC FORM CHỌN GIÁO VIÊN VÀ LỚP */}
      <div className="card shadow-sm mb-4 border-info">
        <div className="card-body">
          <form onSubmit={handlePhanCong} className="row align-items-end">
            <div className="col-md-4 mb-3">
              <label className="fw-bold">Chọn Lớp Học</label>
              <select className="form-select" value={form.lop_hoc_id} onChange={e => setForm({...form, lop_hoc_id: e.target.value})} required>
                <option value="">-- Chọn lớp --</option>
                {danhSachLop.map(lop => (
                  <option key={lop.id} value={lop.id}>{lop.ten_lop}</option>
                ))}
              </select>
            </div>
            
            <div className="col-md-5 mb-3">
              <label className="fw-bold">Chọn Giáo Viên</label>
              <select className="form-select" value={form.giao_vien_id} onChange={e => setForm({...form, giao_vien_id: e.target.value})} required>
                <option value="">-- Chọn giáo viên --</option>
                {danhSachGV.map(gv => (
                  <option key={gv.id} value={gv.id}>
                    {gv.ho_ten} (Môn: {gv.mon_hoc?.ten_mon})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3 mb-3">
              <button type="submit" className="btn btn-info text-white w-100 fw-bold">
                ➕ Phân Công
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* KHU VỰC BẢNG HIỂN THỊ */}
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white fw-bold">
          Danh Sách Lớp & Giáo Viên Phụ Trách
        </div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <tbody>
              {danhSachLop.map(lop => (
                <tr key={lop.id}>
                  <td className="fw-bold text-danger align-middle w-25" style={{ fontSize: '1.1rem' }}>
                    🏫 {lop.ten_lop}
                  </td>
                  <td>
                    {/* Chỗ này sẽ in ra danh sách các giáo viên dạy lớp này dưới dạng các cục Tag */}
                    <div className="d-flex flex-wrap gap-2">
                      {lop.giao_viens && lop.giao_viens.length > 0 ? (
                        lop.giao_viens.map(gv => (
                          <span key={gv.id} className="badge bg-light text-dark border p-2 d-flex align-items-center">
                            👨‍🏫 {gv.ho_ten} <small className="text-primary ms-1">({gv.mon_hoc?.ten_mon})</small>
                            <button 
                              className="btn-close ms-2" 
                              style={{ fontSize: '0.5rem' }} 
                              onClick={() => handleHuyPhanCong(lop.id, gv.id)}
                            ></button>
                          </span>
                        ))
                      ) : (
                        <span className="text-muted fst-italic">Chưa có giáo viên nào...</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default PhanCong;
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const GiaoVien = () => {
  const [danhSachGV, setDanhSachGV] = useState([]);
  const [danhSachMon, setDanhSachMon] = useState([]);
  const [idDangSua, setIdDangSua] = useState(null); // Biến để biết đang sửa giáo viên nào
  const [form, setForm] = useState({ ho_ten: '', email: '', sdt: '', mon_hoc_id: '' });

  useEffect(() => { layDuLieu(); }, []);

  const layDuLieu = () => {
    axios.get('/giaovien').then(res => setDanhSachGV(res.data.data));
    axios.get('/monhoc').then(res => setDanhSachMon(res.data.data));
  };

  // Hàm đổ dữ liệu vào Form khi bấm nút Sửa
  const handleChonSua = (gv) => {
    setIdDangSua(gv.id);
    setForm({
      ho_ten: gv.ho_ten,
      email: gv.email,
      sdt: gv.sdt,
      mon_hoc_id: gv.mon_hoc_id
    });
  };

  const resetForm = () => {
    setForm({ ho_ten: '', email: '', sdt: '', mon_hoc_id: '' });
    setIdDangSua(null);
  };

  const handleLuu = (e) => {
    e.preventDefault();
    if (idDangSua) {
      // Nếu có idDangSua thì gọi API UPDATE (PUT)
      axios.put(`/giaovien/${idDangSua}`, form).then(() => {
        Swal.fire('Thành công', 'Đã cập nhật thông tin giáo viên!', 'success');
        layDuLieu();
        resetForm();
      });
    } else {
      // Nếu không có thì gọi API THÊM MỚI (POST)
      axios.post('/giaovien', form).then(() => {
        Swal.fire('Thành công', 'Đã thêm giáo viên mới!', 'success');
        layDuLieu();
        resetForm();
      });
    }
  };

  const handleXoa = (id) => {
    Swal.fire({
      title: 'Xác nhận xóa?', text: "Dữ liệu giáo viên sẽ mất vĩnh viễn!", icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Xóa ngay'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/giaovien/${id}`).then(() => {
          Swal.fire('Đã xóa!', 'Giáo viên đã được xóa.', 'success');
          layDuLieu();
        });
      }
    });
  };

  return (
    <div className="container-fluid">
      <h2 className="text-primary fw-bold mb-4">👨‍🏫 QUẢN LÝ GIÁO VIÊN</h2>
      
      {/* Form này sẽ tự đổi màu và tiêu đề khi m bấm Sửa */}
      <div className={`card shadow-sm mb-4 border-${idDangSua ? 'warning' : 'info'}`}>
        <div className={`card-header text-white fw-bold bg-${idDangSua ? 'warning' : 'info'}`}>
          {idDangSua ? '✏️ Đang sửa thông tin giáo viên' : '📝 Thêm giáo viên mới'}
        </div>
        <div className="card-body">
          <form onSubmit={handleLuu} className="row">
            <div className="col-md-3 mb-3">
              <label className="form-label fw-bold">Họ tên</label>
              <input type="text" className="form-control" value={form.ho_ten} onChange={e => setForm({...form, ho_ten: e.target.value})} required />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label fw-bold">Email</label>
              <input type="email" className="form-control" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="col-md-2 mb-3">
              <label className="form-label fw-bold">SĐT</label>
              <input type="text" className="form-control" value={form.sdt} onChange={e => setForm({...form, sdt: e.target.value})} required />
            </div>
            <div className="col-md-2 mb-3">
              <label className="form-label fw-bold">Môn dạy</label>
              <select className="form-select" value={form.mon_hoc_id} onChange={e => setForm({...form, mon_hoc_id: e.target.value})} required>
                <option value="">-- Chọn Môn --</option>
                {danhSachMon.map(m => <option key={m.id} value={m.id}>{m.ten_mon}</option>)}
              </select>
            </div>
            <div className="col-md-2 d-flex align-items-end mb-3">
              <button type="submit" className={`btn w-100 fw-bold ${idDangSua ? 'btn-warning' : 'btn-info text-white'}`}>
                {idDangSua ? 'Cập Nhật' : 'Lưu Dữ Liệu'}
              </button>
              {idDangSua && <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>Hủy</button>}
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <table className="table table-hover mb-0">
          <thead className="table-dark">
            <tr>
              <th>Họ Tên</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Chuyên Môn</th>
              <th className="text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {danhSachGV.map(gv => (
              <tr key={gv.id} className="align-middle">
                <td>{gv.ho_ten}</td>
                <td>{gv.email}</td>
                <td>{gv.sdt}</td>
                <td><span className="badge bg-warning text-dark">{gv.mon_hoc?.ten_mon}</span></td>
                <td className="text-center">
                  <button className="btn btn-sm btn-warning me-2 fw-bold" onClick={() => handleChonSua(gv)}>Sửa</button>
                  <button className="btn btn-sm btn-danger fw-bold" onClick={() => handleXoa(gv.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GiaoVien;
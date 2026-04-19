import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const TaiKhoan = () => {
  const [danhSachUser, setDanhSachUser] = useState([]);
  const [hienThiForm, setHienThiForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  
  // ✅ 1. LẤY THÔNG TIN USER ĐANG ĐĂNG NHẬP
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => { layDanhSach(); }, []);

  const layDanhSach = () => {
    axios.get('/users').then(res => setDanhSachUser(res.data.data));
  };

  const handleLuu = (e) => {
    e.preventDefault();
    axios.post('/users', form)
      .then(() => {
        Swal.fire('Thành công', 'Đã thêm quản trị viên mới!', 'success');
        layDanhSach();
        setHienThiForm(false);
        setForm({ name: '', email: '', password: '', role: 'admin' });
      })
      .catch(err => {
        Swal.fire('Lỗi', err.response?.data?.message || 'Không thể tạo tài khoản', 'error');
      });
  };

  const handleXoa = (id) => {
    Swal.fire({
      title: 'Xóa tài khoản này?',
      text: "Hành động này không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xác nhận xóa ',
      cancelButtonText: 'Hủy'
    }).then(res => {
      if(res.isConfirmed) {
        axios.delete(`/users/${id}`)
          .then(res => {
            Swal.fire('Đã xóa!', res.data.message, 'success');
            layDanhSach();
          })
          .catch(err => {
            // ✅ HIỆN LỖI TỪ BACKEND (Ví dụ: M định tự sát hả Tèo?)
            Swal.fire('Thất bại', err.response?.data?.message || 'Có lỗi xảy ra', 'error');
          });
      }
    });
  };

  return (
    <div className="container-fluid mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">🔐 QUẢN TRỊ VIÊN</h2>
        <button className="btn btn-success fw-bold" onClick={() => setHienThiForm(!hienThiForm)}>
          {hienThiForm ? "❌ Đóng" : "+ Thêm Admin"}
        </button>
      </div>

      {hienThiForm && (
        <div className="card shadow-sm mb-4 border-success">
          <div className="card-body">
            <form onSubmit={handleLuu} className="row align-items-end">
              <div className="col-md-3 mb-3">
                <label className="fw-bold">Tên hiển thị</label>
                <input type="text" className="form-control border-success" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="col-md-3 mb-3">
                <label className="fw-bold">Email (Tên đăng nhập)</label>
                <input type="email" className="form-control border-success" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div className="col-md-3 mb-3">
                <label className="fw-bold">Mật khẩu</label>
                <input type="password" title="Ít nhất 6 ký tự" className="form-control border-success" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
              </div>
              <div className="col-md-3 mb-3">
                <button type="submit" className="btn btn-success w-100 fw-bold shadow-sm">💾 TẠO TÀI KHOẢN</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-sm border-0">
        <table className="table table-hover table-bordered mb-0">
          <thead className="table-dark text-center">
            <tr>
              <th style={{ width: '80px' }}>ID</th>
              <th>Tên Quản Trị</th>
              <th>Email</th>
              <th>Quyền</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {danhSachUser.map(u => (
              <tr key={u.id} className="align-middle">
                <td>{u.id}</td>
                <td className="fw-bold text-primary text-start px-4">
                  {u.name} {u.id === currentUser.id && <span className="badge bg-warning text-dark ms-2">Tài khoản của bạn</span>}
                </td>
                <td>{u.email}</td>
                <td><span className="badge bg-info">{u.role}</span></td>
                <td>
                  {/* ✅ CHỖ SỬA QUAN TRỌNG: KIỂM TRA ID ĐỂ ẨN NÚT XÓA */}
                  {u.id !== currentUser.id ? (
                    <button className="btn btn-sm btn-outline-danger px-3 fw-bold" onClick={() => handleXoa(u.id)}>
                      Xóa
                    </button>
                  ) : (
                    <span className="text-muted small italic">Không thể xóa chính mình</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaiKhoan;
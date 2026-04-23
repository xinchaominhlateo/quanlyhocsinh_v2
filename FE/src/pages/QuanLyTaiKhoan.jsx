import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ShieldCheck, Plus, Trash2, KeyRound } from 'lucide-react';

const QuanLyTaiKhoan = () => {
  const [danhSach, setDanhSach] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', role: 'teacher', password: '' });

  // 1. Lấy danh sách tài khoản
  const fetchUsers = () => {
    axios.get('/users')
      .then(res => setDanhSach(res.data.data))
      .catch(err => console.error("Lỗi lấy danh sách:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Xử lý Thêm Tài Khoản Mới
  const handleThemTaiKhoan = (e) => {
    e.preventDefault();
    axios.post('/users', form)
      .then(res => {
        Swal.fire('Thành công', res.data.message, 'success');
        setForm({ name: '', email: '', role: 'teacher', password: '' });
        fetchUsers(); // Cập nhật lại bảng
      })
      .catch(err => {
        const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra!';
        Swal.fire('Lỗi', errorMsg, 'error');
      });
  };

  // 3. Reset Mật Khẩu
  const handleResetPassword = (id, name) => {
    Swal.fire({
      title: `Reset mật khẩu của ${name}?`,
      text: "Mật khẩu sẽ được đặt lại thành: 123456",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`/users/reset-password/${id}`)
          .then(res => Swal.fire('Thành công', res.data.message, 'success'))
          .catch(() => Swal.fire('Lỗi', 'Không thể reset mật khẩu', 'error'));
      }
    });
  };

  // 4. Xóa Tài Khoản
  const handleXoa = (id, name) => {
    Swal.fire({
      title: `Xóa tài khoản ${name}?`,
      text: "Hành động này không thể hoàn tác!",
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Xóa ngay',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/users/${id}`)
          .then(res => {
            Swal.fire('Đã xóa!', res.data.message, 'success');
            fetchUsers();
          })
          .catch(err => Swal.fire('Lỗi', err.response?.data?.message || 'Không thể xóa', 'error'));
      }
    });
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin': return <span className="badge bg-danger">Admin</span>;
      case 'bgh': return <span className="badge bg-warning text-dark">BGH</span>;
      case 'giaovu': return <span className="badge bg-info text-dark">Giáo Vụ</span>;
      case 'teacher': return <span className="badge bg-success">Giáo Viên</span>;
      default: return <span className="badge bg-secondary">{role}</span>;
    }
  };

  return (
    <div className="container-fluid mb-5">
      <div className="d-flex align-items-center gap-2 mb-4">
        <ShieldCheck size={32} className="text-primary" />
        <h2 className="text-primary fw-bold m-0">QUẢN LÝ TÀI KHOẢN HỆ THỐNG</h2>
      </div>

      <div className="row">
        {/* Form thêm tài khoản */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-dark text-white fw-bold">
              <Plus size={18} className="me-2" /> Thêm Tài Khoản Mới
            </div>
            <div className="card-body">
              <form onSubmit={handleThemTaiKhoan}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Họ và Tên</label>
                  <input type="text" className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Email đăng nhập</label>
                  <input type="email" className="form-control" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Quyền hạn (Role)</label>
                  <select className="form-select" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                    <option value="teacher">Giáo Viên</option>
                    <option value="giaovu">Giáo Vụ</option>
                    <option value="bgh">Ban Giám Hiệu</option>
                    <option value="admin">Quản Trị Viên (Admin)</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold">Mật khẩu khởi tạo</label>
                  <input type="password" className="form-control" placeholder="Tối thiểu 6 ký tự" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
                </div>
                <button type="submit" className="btn btn-primary w-100 fw-bold">Tạo Tài Khoản</button>
              </form>
            </div>
          </div>
        </div>

        {/* Bảng danh sách */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle m-0 text-center">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th className="text-start">Tên người dùng</th>
                      <th className="text-start">Email</th>
                      <th>Quyền hạn</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {danhSach.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td className="text-start fw-bold">{user.name}</td>
                        <td className="text-start">{user.email}</td>
                        <td>{getRoleBadge(user.role)}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-warning me-2" 
                            title="Reset mật khẩu về 123456"
                            onClick={() => handleResetPassword(user.id, user.name)}
                          >
                            <KeyRound size={16} />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            title="Xóa tài khoản"
                            onClick={() => handleXoa(user.id, user.name)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {danhSach.length === 0 && (
                      <tr><td colSpan="5" className="py-4 text-muted">Chưa có dữ liệu.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuanLyTaiKhoan;
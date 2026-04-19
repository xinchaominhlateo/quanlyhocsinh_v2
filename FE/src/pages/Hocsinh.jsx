import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Hocsinh = () => {
  const [danhSachHS, setDanhSachHS] = useState([]);
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [idDangSua, setIdDangSua] = useState(null);
  const [tuKhoa, setTuKhoa] = useState('');
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });

  const [form, setForm] = useState({
    ho_ten: '', gioi_tinh: 'Nam', ngay_sinh: '', sdt: '', email: '', dia_chi: '', lop_hoc_id: ''
  });

  useEffect(() => { 
    layDuLieu(1); 
    axios.get('/lophoc').then(res => setDanhSachLop(res.data.data));
  }, []);

  const layDuLieu = (page = 1) => {
    axios.get(`/hocsinh?page=${page}&search=${tuKhoa}`).then(res => {
      setDanhSachHS(res.data.data || res.data); 
      setPagination({
        current_page: res.data.current_page || 1,
        last_page: res.data.last_page || 1
      });
    });
  };

  // --- HÀM XÓA ĐÃ QUAY TRỞ LẠI ---
  const handleXoa = (id) => {
    Swal.fire({
      title: 'Bạn xác nhận xóa học sinh này ?',
      text: "Mọi dữ liệu của học sinh này sẽ bị xóa",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Xác nhận xóa',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/hocsinh/${id}`).then(() => {
          Swal.fire('Thành công', 'Đã xóa thông tin học sinh', 'success');
          layDuLieu(pagination.current_page);
        }).catch(err => {
          Swal.fire('Lỗi', 'Có lỗi xảy ra, không thể xóa thông tin học sinh này.', 'error');
        });
      }
    });
  };

  const handleLuu = (e) => {
    e.preventDefault();
    const action = idDangSua ? axios.put(`/hocsinh/${idDangSua}`, form) : axios.post('/hocsinh', form);
    
    action.then(() => {
      Swal.fire('Thành công', 'Đã lưu học sinh!', 'success');
      // Thêm mới thì về trang 1, sửa thì ở lại trang hiện tại
      layDuLieu(idDangSua ? pagination.current_page : 1);
      resetForm();
    }).catch(err => {
      const message = err.response?.data?.message || 'Có lỗi xảy ra!';
      Swal.fire('Thất bại', message, 'error');
    });
  };

  const resetForm = () => {
    setForm({ ho_ten: '', gioi_tinh: 'Nam', ngay_sinh: '', sdt: '', email: '', dia_chi: '', lop_hoc_id: '' });
    setIdDangSua(null);
  };

  const handleChonSua = (hs) => {
    setIdDangSua(hs.id);
    setForm({
      ho_ten: hs.ho_ten,
      gioi_tinh: hs.gioi_tinh,
      ngay_sinh: hs.ngay_sinh,
      sdt: hs.sdt,
      email: hs.email,
      dia_chi: hs.dia_chi,
      lop_hoc_id: hs.lop_hoc_id
    });
  };

  return (
    <div className="container-fluid mb-5">
      <h2 className="text-primary fw-bold mb-4">🎓 QUẢN LÝ HỌC SINH</h2>
      
      {/* FORM NHẬP LIỆU */}
      <div className={`card shadow-sm mb-4 border-${idDangSua ? 'warning' : 'primary'}`}>
        <div className="card-header bg-primary text-white fw-bold">
          {idDangSua ? '✏️ Đang sửa thông tin học sinh' : '➕ Thêm học sinh mới'}
        </div>
        <div className="card-body">
          <form onSubmit={handleLuu} className="row">
            <div className="col-md-3 mb-3">
              <label className="fw-bold">Họ Tên</label>
              <input type="text" className="form-control" value={form.ho_ten} onChange={e => setForm({...form, ho_ten: e.target.value})} required />
            </div>
            <div className="col-md-2 mb-3">
              <label className="fw-bold">Giới Tính</label>
              <select className="form-select" value={form.gioi_tinh} onChange={e => setForm({...form, gioi_tinh: e.target.value})}>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div className="col-md-2 mb-3">
              <label className="fw-bold">Ngày Sinh</label>
              <input type="date" className="form-control" value={form.ngay_sinh} onChange={e => setForm({...form, ngay_sinh: e.target.value})} required />
            </div>
            <div className="col-md-2 mb-3">
              <label className="fw-bold">Lớp</label>
              <select className="form-select" value={form.lop_hoc_id} onChange={e => setForm({...form, lop_hoc_id: e.target.value})} required>
                <option value="">-- Chọn lớp --</option>
                {danhSachLop.map(l => <option key={l.id} value={l.id}>{l.ten_lop}</option>)}
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <label className="fw-bold">Số Điện Thoại</label>
              <input type="text" className="form-control" value={form.sdt} onChange={e => setForm({...form, sdt: e.target.value})} required />
            </div>
            <div className="col-md-4 mb-3">
              <label className="fw-bold">Email (@gmail.com)</label>
              <input type="email" className="form-control" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="col-md-5 mb-3">
              <label className="fw-bold">Địa Chỉ</label>
              <input type="text" className="form-control" value={form.dia_chi} onChange={e => setForm({...form, dia_chi: e.target.value})} required />
            </div>
            <div className="col-md-3 mb-3 d-flex align-items-end gap-2">
              <button type="submit" className={`btn fw-bold w-100 ${idDangSua ? 'btn-warning' : 'btn-primary'}`}>
                {idDangSua ? '💾 Cập Nhật' : '💾 Lưu Lại'}
              </button>
              {idDangSua && <button type="button" className="btn btn-secondary" onClick={resetForm}>Hủy</button>}
            </div>
          </form>
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0 text-center">
            <thead className="table-dark">
              <tr>
                <th>Mã HS</th>
                <th className="text-start">Họ Tên</th>
                <th>Giới Tính</th>
                <th>Lớp</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {danhSachHS.length > 0 ? danhSachHS.map(hs => (
                <tr key={hs.id} className="align-middle">
                  <td className="fw-bold">{hs.ma_hoc_sinh}</td>
                  <td className="text-start text-primary fw-bold">{hs.ho_ten}</td>
                  <td>{hs.gioi_tinh === 'Nam' ? '👦 Nam' : '👧 Nữ'}</td>
                  <td className="fw-bold text-danger">{hs.lop_hoc?.ten_lop}</td>
                  <td>
                    {/* --- ĐÃ GẮN LẠI ĐỦ 2 NÚT CHO TÈO RỒI ĐÂY --- */}
                    <button className="btn btn-sm btn-outline-warning me-2 fw-bold" onClick={() => handleChonSua(hs)}>Sửa</button>
                    <button className="btn btn-sm btn-outline-danger fw-bold" onClick={() => handleXoa(hs.id)}>Xóa</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5">Đang tải hoặc không có học sinh nào...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NÚT PHÂN TRANG */}
      <nav className="mt-4 d-flex justify-content-center">
        <ul className="pagination shadow-sm">
          <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => layDuLieu(pagination.current_page - 1)}>Trước</button>
          </li>
          {[...Array(pagination.last_page)].map((_, i) => (
            <li key={i} className={`page-item ${pagination.current_page === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => layDuLieu(i + 1)}>{i + 1}</button>
            </li>
          ))}
          <li className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => layDuLieu(pagination.current_page + 1)}>Sau</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Hocsinh;
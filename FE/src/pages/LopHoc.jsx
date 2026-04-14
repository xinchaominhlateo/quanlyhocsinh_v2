import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const LopHoc = () => {
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [hienThiForm, setHienThiForm] = useState(false);
  const [idDangSua, setIdDangSua] = useState(null);
  const [tuKhoa, setTuKhoa] = useState('');

  const [formDuLieu, setFormDuLieu] = useState({
    ma_lop: '', ten_lop: '', khoi: '10'
  });

  useEffect(() => { layDanhSach() }, []);

  const layDanhSach = () => {
    axios.get('http://localhost:8000/api/lophoc')
      .then(res => setDanhSachLop(res.data.data))
      .catch(err => console.error(err));
  };

  const handleChange = (e) => setFormDuLieu({ ...formDuLieu, [e.target.name]: e.target.value });

  const handleLuu = (e) => {
    e.preventDefault();
    const API_URL = idDangSua ? `http://localhost:8000/api/lophoc/${idDangSua}` : 'http://localhost:8000/api/lophoc';
    const method = idDangSua ? axios.put : axios.post;

    method(API_URL, formDuLieu)
      .then(() => {
        Swal.fire({ icon: 'success', title: 'Thành công!', timer: 1500, showConfirmButton: false });
        layDanhSach();
        resetForm();
      }).catch(err => Swal.fire('Lỗi', 'Có lỗi xảy ra, xem console!', 'error'));
  };

  const handleChonSua = (lop) => {
    setIdDangSua(lop.id);
    setFormDuLieu({ ma_lop: lop.ma_lop, ten_lop: lop.ten_lop, khoi: lop.khoi });
    setHienThiForm(true);
  };

  const resetForm = () => {
    setFormDuLieu({ ma_lop: '', ten_lop: '', khoi: '10' });
    setIdDangSua(null);
    setHienThiForm(false);
  };

  const handleXoa = (id) => {
    Swal.fire({
      title: 'Xóa lớp học?', text: "Học sinh trong lớp có thể bị mồ côi đó!", icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#dc3545', confirmButtonText: 'Xóa!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8000/api/lophoc/${id}`)
          .then(() => { layDanhSach(); Swal.fire('Đã xóa!', '', 'success') });
      }
    });
  };

  const danhSachHienThi = danhSachLop.filter((lop) => 
    lop.ten_lop.toLowerCase().includes(tuKhoa.toLowerCase()) || 
    lop.ma_lop.toLowerCase().includes(tuKhoa.toLowerCase())
  );

  return (
    <div className="container-fluid mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">🏫 QUẢN LÝ LỚP HỌC</h2>
        <button className={`btn fw-bold shadow-sm ${hienThiForm ? 'btn-secondary' : 'btn-success'}`} onClick={() => hienThiForm ? resetForm() : setHienThiForm(true)}>
          {hienThiForm ? "❌ Đóng Form" : "+ Thêm Lớp Mới"}
        </button>
      </div>

      {hienThiForm && (
        <div className={`card shadow-sm mb-4 border-${idDangSua ? 'warning' : 'success'}`}>
          <div className={`card-header text-white fw-bold bg-${idDangSua ? 'warning' : 'success'}`}>
            {idDangSua ? '✏️ Sửa Lớp' : '📝 Thêm Lớp Mới'}
          </div>
          <div className="card-body">
            <form onSubmit={handleLuu} className="row">
              <div className="col-md-4 mb-3">
                <label className="fw-bold">Mã Lớp (VD: L10A1)</label>
                <input type="text" className="form-control" name="ma_lop" value={formDuLieu.ma_lop} onChange={handleChange} required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="fw-bold">Tên Lớp (VD: 10A1)</label>
                <input type="text" className="form-control" name="ten_lop" value={formDuLieu.ten_lop} onChange={handleChange} required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="fw-bold">Khối</label>
                <select className="form-select" name="khoi" value={formDuLieu.khoi} onChange={handleChange}>
                  <option value="10">Khối 10</option>
                  <option value="11">Khối 11</option>
                  <option value="12">Khối 12</option>
                </select>
              </div>
              <div className="col-12">
                <button type="submit" className={`btn fw-bold px-4 btn-${idDangSua ? 'warning' : 'primary'}`}>💾 Lưu Lớp Học</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <input type="text" className="form-control border-primary mb-3" placeholder="🔍 Tìm theo mã hoặc tên lớp..." value={tuKhoa} onChange={(e) => setTuKhoa(e.target.value)} />
      
      <div className="card shadow-sm">
        <table className="table table-hover table-bordered mb-0">
          <thead className="table-dark">
            <tr>
              <th className="text-center">ID</th>
              <th>Mã Lớp</th>
              <th>Tên Lớp</th>
              <th className="text-center">Khối</th>
              <th className="text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {danhSachHienThi.map((lop) => (
              <tr key={lop.id} className="align-middle">
                <td className="text-center">{lop.id}</td>
                <td className="fw-bold text-danger">{lop.ma_lop}</td>
                <td className="fw-bold text-primary">{lop.ten_lop}</td>
                <td className="text-center"><span className="badge bg-info text-dark">Khối {lop.khoi}</span></td>
                <td className="text-center">
                  <button className="btn btn-sm btn-warning me-2 fw-bold" onClick={() => handleChonSua(lop)}>Sửa</button>
                  <button className="btn btn-sm btn-danger fw-bold" onClick={() => handleXoa(lop.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LopHoc;
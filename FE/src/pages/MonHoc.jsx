import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const MonHoc = () => {
  const [danhSachMon, setDanhSachMon] = useState([]);
  const [hienThiForm, setHienThiForm] = useState(false);
  const [idDangSua, setIdDangSua] = useState(null);
  const [tuKhoa, setTuKhoa] = useState('');

  const [formDuLieu, setFormDuLieu] = useState({ ma_mon: '', ten_mon: '', khoi: '10' });

  useEffect(() => { layDanhSach() }, []);

  const layDanhSach = () => {
    axios.get('/monhoc')
      .then(res => setDanhSachMon(res.data.data))
      .catch(err => console.error(err));
  };

  const handleChange = (e) => setFormDuLieu({ ...formDuLieu, [e.target.name]: e.target.value });

  const handleLuu = (e) => {
    e.preventDefault();
    const API_URL = idDangSua ? `/monhoc/${idDangSua}` : '/monhoc';
    const method = idDangSua ? axios.put : axios.post;

    method(API_URL, formDuLieu)
      .then(() => {
        Swal.fire({ icon: 'success', title: 'Thành công!', timer: 1500, showConfirmButton: false });
        layDanhSach(); resetForm();
      }).catch(err => Swal.fire('Lỗi', 'Có lỗi xảy ra!', 'error'));
  };

  const handleChonSua = (mon) => {
    setIdDangSua(mon.id);
    setFormDuLieu({ ma_mon: mon.ma_mon, ten_mon: mon.ten_mon, khoi: mon.khoi });
    setHienThiForm(true);
  };

  const resetForm = () => {
    setFormDuLieu({ ma_mon: '', ten_mon: '', khoi: '10' });
    setIdDangSua(null); setHienThiForm(false);
  };

  const handleXoa = (id) => {
    Swal.fire({
      title: 'Xóa môn này?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc3545', confirmButtonText: 'Xóa!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/monhoc/${id}`).then(() => { layDanhSach(); Swal.fire('Đã xóa!', '', 'success') });
      }
    });
  };

  const danhSachHienThi = danhSachMon.filter((mon) => 
    mon.ten_mon.toLowerCase().includes(tuKhoa.toLowerCase()) || mon.ma_mon.toLowerCase().includes(tuKhoa.toLowerCase())
  );

  return (
    <div className="container-fluid mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">📖 QUẢN LÝ MÔN HỌC</h2>
        <button className={`btn fw-bold shadow-sm ${hienThiForm ? 'btn-secondary' : 'btn-success'}`} onClick={() => hienThiForm ? resetForm() : setHienThiForm(true)}>
          {hienThiForm ? "❌ Đóng Form" : "+ Thêm Môn Mới"}
        </button>
      </div>

      {hienThiForm && (
        <div className={`card shadow-sm mb-4 border-${idDangSua ? 'warning' : 'success'}`}>
          <div className={`card-header text-white fw-bold bg-${idDangSua ? 'warning' : 'success'}`}>
            {idDangSua ? '✏️ Sửa Môn Học' : '📝 Thêm Môn Học'}
          </div>
          <div className="card-body">
            <form onSubmit={handleLuu} className="row">
              <div className="col-md-4 mb-3">
                <label className="fw-bold">Mã Môn (VD: TOAN10)</label>
                <input type="text" className="form-control" name="ma_mon" value={formDuLieu.ma_mon} onChange={handleChange} required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="fw-bold">Tên Môn (VD: Toán Học)</label>
                <input type="text" className="form-control" name="ten_mon" value={formDuLieu.ten_mon} onChange={handleChange} required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="fw-bold">Dành cho Khối</label>
                <select className="form-select" name="khoi" value={formDuLieu.khoi} onChange={handleChange}>
                  <option value="10">Khối 10</option>
                  <option value="11">Khối 11</option>
                  <option value="12">Khối 12</option>
                </select>
              </div>
              <div className="col-12">
                <button type="submit" className={`btn fw-bold px-4 btn-${idDangSua ? 'warning' : 'primary'}`}>💾 Lưu Môn Học</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <input type="text" className="form-control border-primary mb-3" placeholder="🔍 Tìm theo mã hoặc tên môn..." value={tuKhoa} onChange={(e) => setTuKhoa(e.target.value)} />
      
      <div className="card shadow-sm">
        <table className="table table-hover table-bordered mb-0">
          <thead className="table-dark">
            <tr>
              <th className="text-center">ID</th>
              <th>Mã Môn</th>
              <th>Tên Môn</th>
              <th className="text-center">Khối</th>
              <th className="text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {danhSachHienThi.map((mon) => (
              <tr key={mon.id} className="align-middle">
                <td className="text-center">{mon.id}</td>
                <td className="fw-bold text-danger">{mon.ma_mon}</td>
                <td className="fw-bold text-primary">{mon.ten_mon}</td>
                <td className="text-center"><span className="badge bg-success text-white">Khối {mon.khoi}</span></td>
                <td className="text-center">
                  <button className="btn btn-sm btn-warning me-2 fw-bold" onClick={() => handleChonSua(mon)}>Sửa</button>
                  <button className="btn btn-sm btn-danger fw-bold" onClick={() => handleXoa(mon.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonHoc;
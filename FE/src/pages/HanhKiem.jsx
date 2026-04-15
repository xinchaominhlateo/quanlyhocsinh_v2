import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const HanhKiem = () => {
  const [danhSachHK, setDanhSachHK] = useState([]);
  const [danhSachHS, setDanhSachHS] = useState([]);
  const [hienThiForm, setHienThiForm] = useState(false);
  const [form, setForm] = useState({ hoc_sinh_id: '', hoc_ki: '1', loai: 'Tốt', nhan_xet: '' });

  useEffect(() => {
    layDuLieu();
  }, []);

  const layDuLieu = () => {
    axios.get('/hanhkiem').then(res => setDanhSachHK(res.data.data));
    axios.get('/hocsinh').then(res => setDanhSachHS(res.data.data));
  };

  const handleLuu = (e) => {
    e.preventDefault();
    axios.post('/hanhkiem', form).then(() => {
      Swal.fire('Thành công', 'Đã lưu hạnh kiểm', 'success');
      layDuLieu(); setHienThiForm(false);
    });
  };

  const handleXoa = (id) => {
    axios.delete(`/hanhkiem/${id}`).then(() => layDuLieu());
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between mb-4">
        <h2 className="text-primary fw-bold">🎖️ QUẢN LÝ HẠNH KIỂM</h2>
        <button className="btn btn-success fw-bold" onClick={() => setHienThiForm(!hienThiForm)}>+ Đánh giá mới</button>
      </div>

      {hienThiForm && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <form onSubmit={handleLuu} className="row">
              <div className="col-md-3 mb-3">
                <label>Học Sinh</label>
                <select className="form-select" onChange={e => setForm({...form, hoc_sinh_id: e.target.value})} required>
                  <option value="">-- Chọn --</option>
                  {danhSachHS.map(hs => <option key={hs.id} value={hs.id}>{hs.ho_ten}</option>)}
                </select>
              </div>
              <div className="col-md-3 mb-3">
                <label>Học Kỳ</label>
                <select className="form-select" onChange={e => setForm({...form, hoc_ki: e.target.value})}>
                  <option value="1">Học kỳ 1</option>
                  <option value="2">Học kỳ 2</option>
                </select>
              </div>
              <div className="col-md-3 mb-3">
                <label>Xếp Loại</label>
                <select className="form-select" onChange={e => setForm({...form, loai: e.target.value})}>
                  <option value="Tốt">Tốt</option>
                  <option value="Khá">Khá</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Yếu">Yêu</option>
                </select>
              </div>
              <div className="col-md-3 mb-3 d-flex align-items-end">
                <button type="submit" className="btn btn-primary w-100 fw-bold">💾 LƯU</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <table className="table table-hover">
          <thead className="table-dark text-center">
            <tr>
              <th>Học Sinh</th>
              <th>Học Kỳ</th>
              <th>Xếp Loại</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {danhSachHK.map(hk => (
              <tr key={hk.id}>
                <td className="text-start fw-bold text-primary">{hk.hoc_sinh?.ho_ten}</td>
                <td>HK {hk.hoc_ki}</td>
                <td><span className={`badge ${hk.loai === 'Tốt' ? 'bg-success' : 'bg-warning text-dark'}`}>{hk.loai}</span></td>
                <td><button className="btn btn-sm btn-danger" onClick={() => handleXoa(hk.id)}>Xóa</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HanhKiem;
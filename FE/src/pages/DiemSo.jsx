import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const DiemSo = () => {
  const [danhSachDiem, setDanhSachDiem] = useState([]);
  const [danhSachHocSinh, setDanhSachHocSinh] = useState([]);
  const [danhSachMon, setDanhSachMon] = useState([]);
  
  const [hienThiForm, setHienThiForm] = useState(false);
  const [idDangSua, setIdDangSua] = useState(null);
  const [tuKhoa, setTuKhoa] = useState('');

  const [formDuLieu, setFormDuLieu] = useState({
    hoc_sinh_id: '', mon_hoc_id: '', hoc_ki: '1', diem_tx: '', diem_gk: '', diem_ck: '', diem_tb: '', nhan_xet: ''
  });

  useEffect(() => {
    layDuLieuTongHop();
  }, []);

  const layDuLieuTongHop = () => {
    // Gọi 3 API cùng lúc để lấy dữ liệu cho Dropdown và Bảng
    axios.get('http://localhost:8000/api/diemso').then(res => setDanhSachDiem(res.data.data));
    axios.get('http://localhost:8000/api/hocsinh').then(res => setDanhSachHocSinh(res.data.data));
    axios.get('http://localhost:8000/api/monhoc').then(res => setDanhSachMon(res.data.data));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newData = { ...formDuLieu, [name]: value };

    // TỰ ĐỘNG TÍNH ĐIỂM TRUNG BÌNH
    if (['diem_tx', 'diem_gk', 'diem_ck'].includes(name)) {
      const tx = parseFloat(newData.diem_tx) || 0;
      const gk = parseFloat(newData.diem_gk) || 0;
      const ck = parseFloat(newData.diem_ck) || 0;
      // Công thức: (TX + GK*2 + CK*3) / 6
      if (newData.diem_tx !== '' && newData.diem_gk !== '' && newData.diem_ck !== '') {
        newData.diem_tb = ((tx + (gk * 2) + (ck * 3)) / 6).toFixed(1);
      }
    }
    setFormDuLieu(newData);
  };

  const handleLuu = (e) => {
    e.preventDefault();
    const API_URL = idDangSua ? `http://localhost:8000/api/diemso/${idDangSua}` : 'http://localhost:8000/api/diemso';
    const method = idDangSua ? axios.put : axios.post;

    method(API_URL, formDuLieu)
      .then(() => {
        Swal.fire({ icon: 'success', title: 'Thành công!', timer: 1500, showConfirmButton: false });
        layDuLieuTongHop(); resetForm();
      }).catch(err => Swal.fire('Lỗi', 'Có lỗi xảy ra!', 'error'));
  };

  const handleChonSua = (diem) => {
    setIdDangSua(diem.id);
    setFormDuLieu({
      hoc_sinh_id: diem.hoc_sinh_id, mon_hoc_id: diem.mon_hoc_id, hoc_ki: diem.hoc_ki,
      diem_tx: diem.diem_tx, diem_gk: diem.diem_gk, diem_ck: diem.diem_ck, diem_tb: diem.diem_tb, nhan_xet: diem.nhan_xet || ''
    });
    setHienThiForm(true);
  };

  const resetForm = () => {
    setFormDuLieu({ hoc_sinh_id: '', mon_hoc_id: '', hoc_ki: '1', diem_tx: '', diem_gk: '', diem_ck: '', diem_tb: '', nhan_xet: '' });
    setIdDangSua(null); setHienThiForm(false);
  };

  const handleXoa = (id) => {
    Swal.fire({ title: 'Xóa điểm này?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc3545', confirmButtonText: 'Xóa!' })
      .then((result) => {
        if (result.isConfirmed) {
          axios.delete(`http://localhost:8000/api/diemso/${id}`).then(() => { layDuLieuTongHop(); Swal.fire('Đã xóa!', '', 'success') });
        }
      });
  };

  // Lọc thông minh theo Tên học sinh hoặc Tên môn
  const danhSachHienThi = danhSachDiem.filter((d) => {
    const tenHS = d.hoc_sinh ? d.hoc_sinh.ho_ten.toLowerCase() : '';
    const tenMon = d.mon_hoc ? d.mon_hoc.ten_mon.toLowerCase() : '';
    return tenHS.includes(tuKhoa.toLowerCase()) || tenMon.includes(tuKhoa.toLowerCase());
  });

  return (
    <div className="container-fluid mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">💯 QUẢN LÝ ĐIỂM SỐ</h2>
        <button className={`btn fw-bold shadow-sm ${hienThiForm ? 'btn-secondary' : 'btn-success'}`} onClick={() => hienThiForm ? resetForm() : setHienThiForm(true)}>
          {hienThiForm ? "❌ Đóng Form" : "+ Nhập Điểm Mới"}
        </button>
      </div>

      {hienThiForm && (
        <div className={`card shadow-sm mb-4 border-${idDangSua ? 'warning' : 'success'}`}>
          <div className="card-body">
            <form onSubmit={handleLuu} className="row bg-light p-3 rounded">
              <div className="col-md-4 mb-3">
                <label className="fw-bold text-danger">Chọn Học Sinh</label>
                <select className="form-select border-danger" name="hoc_sinh_id" value={formDuLieu.hoc_sinh_id} onChange={handleChange} required>
                  <option value="">-- Chọn Học Sinh --</option>
                  {danhSachHocSinh.map(hs => <option key={hs.id} value={hs.id}>{hs.ho_ten} (Lớp: {hs.lop_hoc ? hs.lop_hoc.ten_lop : 'Chưa xếp'})</option>)}
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="fw-bold text-primary">Chọn Môn Học</label>
                <select className="form-select border-primary" name="mon_hoc_id" value={formDuLieu.mon_hoc_id} onChange={handleChange} required>
                  <option value="">-- Chọn Môn --</option>
                  {danhSachMon.map(m => <option key={m.id} value={m.id}>{m.ten_mon} (Khối {m.khoi})</option>)}
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="fw-bold">Học Kỳ</label>
                <select className="form-select" name="hoc_ki" value={formDuLieu.hoc_ki} onChange={handleChange} required>
                  <option value="1">Học kỳ 1</option>
                  <option value="2">Học kỳ 2</option>
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label className="fw-bold">Điểm Thường Xuyên</label>
                <input type="number" step="0.1" min="0" max="10" className="form-control" name="diem_tx" value={formDuLieu.diem_tx} onChange={handleChange} required />
              </div>
              <div className="col-md-3 mb-3">
                <label className="fw-bold">Điểm Giữa Kì</label>
                <input type="number" step="0.1" min="0" max="10" className="form-control" name="diem_gk" value={formDuLieu.diem_gk} onChange={handleChange} required />
              </div>
              <div className="col-md-3 mb-3">
                <label className="fw-bold">Điểm Cuối Kì</label>
                <input type="number" step="0.1" min="0" max="10" className="form-control" name="diem_ck" value={formDuLieu.diem_ck} onChange={handleChange} required />
              </div>
              <div className="col-md-3 mb-3">
                <label className="fw-bold text-success">ĐIỂM TRUNG BÌNH</label>
                <input type="text" className="form-control bg-success text-white fw-bold" name="diem_tb" value={formDuLieu.diem_tb} readOnly placeholder="Tự động tính..." />
              </div>

              <div className="col-md-12 mb-3">
                <label className="fw-bold">Nhận Xét Của Giáo Viên</label>
                <input type="text" className="form-control" name="nhan_xet" value={formDuLieu.nhan_xet} onChange={handleChange} placeholder="VD: Em cần cố gắng hơn..." />
              </div>

              <div className="col-12 text-end">
                <button type="submit" className={`btn fw-bold px-5 btn-${idDangSua ? 'warning' : 'primary'}`}>💾 LƯU BẢNG ĐIỂM</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <input type="text" className="form-control border-primary mb-3" placeholder="🔍 Gõ tên học sinh hoặc tên môn để tìm nhanh..." value={tuKhoa} onChange={(e) => setTuKhoa(e.target.value)} />
      
      <div className="card shadow-sm">
        <table className="table table-hover table-bordered mb-0">
          <thead className="table-dark text-center align-middle">
            <tr>
              <th>Học Sinh</th>
              <th>Môn</th>
              <th>Học Kỳ</th>
              <th>Đ.Thường Xuyên</th>
              <th>Đ.Giữa Kì</th>
              <th>Đ.Cuối Kì</th>
              <th className="bg-success">TỔNG KẾT (TB)</th>
              <th>Nhận Xét</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody className="align-middle">
            {danhSachHienThi.map((d) => (
              <tr key={d.id}>
                <td className="fw-bold text-primary">{d.hoc_sinh ? d.hoc_sinh.ho_ten : 'N/A'}</td>
                <td className="fw-bold">{d.mon_hoc ? d.mon_hoc.ten_mon : 'N/A'}</td>
                <td className="text-center">HK {d.hoc_ki}</td>
                <td className="text-center">{d.diem_tx}</td>
                <td className="text-center">{d.diem_gk}</td>
                <td className="text-center">{d.diem_ck}</td>
                <td className="text-center fw-bold fs-5 text-danger">{d.diem_tb}</td>
                <td className="fst-italic">{d.nhan_xet}</td>
                <td className="text-center">
                  <button className="btn btn-sm btn-warning me-1" onClick={() => handleChonSua(d)}>Sửa</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleXoa(d.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiemSo;
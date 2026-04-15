import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useReactToPrint } from 'react-to-print';
import { MauInHocPhi } from '../components/MauInHocPhi';

const HocPhi = () => {
  const [danhSachHP, setDanhSachHP] = useState([]);
  const [danhSachHS, setDanhSachHS] = useState([]);
  const [form, setForm] = useState({ hoc_sinh_id: '', hoc_ki: '', so_tien: '', trang_thai: 'Chưa đóng' });

  // 👇 1. KHAI BÁO BIẾN CHO CHỨC NĂNG IN
  const componentRef = useRef();
  const [duLieuIn, setDuLieuIn] = useState(null);

  useEffect(() => { layDuLieu(); }, []);

  const layDuLieu = () => {
    axios.get('/hocphi').then(res => setDanhSachHP(res.data.data));
    axios.get('/hocsinh').then(res => setDanhSachHS(res.data.data));
  };

  const handleLuu = (e) => {
    e.preventDefault();
    axios.post('/hocphi', form).then(() => {
      Swal.fire('Thành công', 'Đã thêm phiếu thu!', 'success');
      layDuLieu();
    });
  };

  const handleXacNhanDong = (id) => {
    axios.put(`/hocphi/${id}`, { trang_thai: 'Đã đóng', ngay_dong: new Date().toISOString().split('T')[0] })
      .then(() => { layDuLieu(); Swal.fire('Xong!', 'Đã cập nhật trạng thái đóng tiền', 'success'); });
  };

  // 👇 2. LOGIC XỬ LÝ LỆNH IN
const handlePrint = useReactToPrint({
  contentRef: componentRef, // Dùng contentRef thay vì content
});

const bamNutIn = (hp) => {
  setDuLieuIn(hp);
  // Đợi 300ms để React kịp đổ dữ liệu vào cái mẫu in rồi mới lệnh cho máy in chạy
  setTimeout(() => {
    handlePrint();
  }, 300);
};c

  return (
    <div className="container-fluid">
      <h2 className="text-primary fw-bold mb-4">💰 QUẢN LÝ HỌC PHÍ</h2>
      
      <div className="card shadow-sm mb-4 border-primary">
        <div className="card-body">
          <form onSubmit={handleLuu} className="row">
            <div className="col-md-4 mb-3">
              <label>Học Sinh</label>
              <select className="form-select" onChange={e => setForm({...form, hoc_sinh_id: e.target.value})} required>
                <option value="">-- Chọn học sinh --</option>
                {danhSachHS.map(hs => <option key={hs.id} value={hs.id}>{hs.ho_ten}</option>)}
              </select>
            </div>
            <div className="col-md-3 mb-3">
<label>Học Kỳ</label>
  {/* Đổi từ thẻ <input> sang thẻ <select> để xổ danh sách */}
  <select 
    className="form-select" 
    value={form.hoc_ki}
    onChange={e => setForm({...form, hoc_ki: e.target.value})} 
    required
  >
    <option value="">-- Chọn học kỳ --</option>
    <option value="Học kỳ 1">Học kỳ 1</option>
    <option value="Học kỳ 2">Học kỳ 2</option>
    <option value="Học kỳ Hè">Học kỳ Hè</option>
  </select>            </div>
            <div className="col-md-3 mb-3">
              <label>Số Tiền (VNĐ)</label>
              <input type="number" className="form-control" onChange={e => setForm({...form, so_tien: e.target.value})} required />
            </div>
            <div className="col-md-2 d-flex align-items-end mb-3">
              <button type="submit" className="btn btn-primary w-100">Tạo Phiếu</button>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <table className="table table-hover mb-0">
          <thead className="table-dark text-center">
            <tr>
              <th>Học Sinh</th>
              <th>Học Kỳ</th>
              <th>Số Tiền</th>
              <th>Trạng Thái</th>
              <th>Ngày Đóng</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {danhSachHP.map(hp => (
              <tr key={hp.id}>
                <td className="text-start">{hp.hoc_sinh?.ho_ten}</td>
                <td>{hp.hoc_ki}</td>
                <td className="fw-bold text-danger">{Number(hp.so_tien).toLocaleString()} đ</td>
                <td>
                  <span className={`badge ${hp.trang_thai === 'Đã đóng' ? 'bg-success' : 'bg-danger'}`}>{hp.trang_thai}</span>
                </td>
                <td>{hp.ngay_dong || '---'}</td>
                <td>
                  {hp.trang_thai === 'Chưa đóng' && (
                    <button className="btn btn-sm btn-outline-success me-2" onClick={() => handleXacNhanDong(hp.id)}>Thu Tiền</button>
                  )}
                  
                  {/* 👇 3. NÚT IN CHỈ HIỆN KHI ĐÃ ĐÓNG TIỀN 👇 */}
                  {hp.trang_thai === 'Đã đóng' && (
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => bamNutIn(hp)}>
                      🖨️ In Biên Lai
                    </button>
                  )}

                  <button className="btn btn-sm btn-link text-danger" onClick={() => {
                    axios.delete(`/hocphi/${hp.id}`).then(() => layDuLieu());
                  }}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

{/* Thay display: none bằng cách ẩn chuyên nghiệp hơn */}
<div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
  <MauInHocPhi ref={componentRef} data={duLieuIn} />
</div>
    </div>
  );
};

export default HocPhi;
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useReactToPrint } from 'react-to-print';
import { MauInHocPhi } from '../components/MauInHocPhi';

const HocPhi = () => {
  const [danhSachHP, setDanhSachHP] = useState([]);
  const [danhSachHS, setDanhSachHS] = useState([]);
  const [form, setForm] = useState({ hoc_sinh_id: '', hoc_ki: '', so_tien: '', trang_thai: 'Chưa đóng' });
  
  // 👇 THÊM BIẾN ĐỂ THEO DÕI ĐANG SỬA PHIẾU NÀO
  const [idDangSua, setIdDangSua] = useState(null);

  const componentRef = useRef();
  const [duLieuIn, setDuLieuIn] = useState(null);

  useEffect(() => { layDuLieu(); }, []);

  const layDuLieu = () => {
    axios.get('/hocphi').then(res => setDanhSachHP(res.data.data));
    axios.get('/hocsinh').then(res => setDanhSachHS(res.data.data));
  };

  // 👇 HÀM KHI BẤM NÚT SỬA
  const handleChonSua = (hp) => {
    setIdDangSua(hp.id);
    setForm({
      hoc_sinh_id: hp.hoc_sinh_id,
      hoc_ki: hp.hoc_ki,
      so_tien: hp.so_tien,
      trang_thai: hp.trang_thai
    });
  };

  const handleLuu = (e) => {
    e.preventDefault();
    // ✅ SỬA LOGIC LƯU: NẾU CÓ ID THÌ PUT (SỬA), KHÔNG THÌ POST (THÊM)
    const request = idDangSua 
      ? axios.put(`/hocphi/${idDangSua}`, form) 
      : axios.post('/hocphi', form);

    request.then(() => {
      Swal.fire('Thành công', idDangSua ? 'Đã cập nhật phiếu thu!' : 'Đã thêm phiếu thu!', 'success');
      layDuLieu();
      // Reset form và thoát chế độ sửa
      setForm({ hoc_sinh_id: '', hoc_ki: '', so_tien: '', trang_thai: 'Chưa đóng' });
      setIdDangSua(null);
    });
  };

  const handleXacNhanDong = (id) => {
    axios.put(`/hocphi/${id}`, { trang_thai: 'Đã đóng', ngay_dong: new Date().toISOString().split('T')[0] })
      .then(() => { layDuLieu(); Swal.fire('Xong!', 'Đã cập nhật trạng thái đóng tiền', 'success'); });
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef, 
  });

  const bamNutIn = (hp) => {
    setDuLieuIn(hp);
    setTimeout(() => {
      handlePrint();
    }, 300);
  };

  return (
    <div className="container-fluid">
      <h2 className="text-primary fw-bold mb-4">💰 QUẢN LÝ HỌC PHÍ</h2>
      
      {/* CARD NHẬP LIỆU: Đổi màu viền khi đang sửa cho dễ nhận biết */}
      <div className={`card shadow-sm mb-4 border-${idDangSua ? 'warning' : 'primary'}`}>
        <div className="card-body">
          <form onSubmit={handleLuu} className="row">
            <div className="col-md-4 mb-3">
              <label className="fw-bold">Học Sinh</label>
              <select 
                className="form-select border-primary" 
                value={form.hoc_sinh_id}
                onChange={e => setForm({...form, hoc_sinh_id: e.target.value})} 
                required
                disabled={idDangSua} // Khóa học sinh khi sửa để tránh nhầm lẫn
              >
                <option value="">-- Chọn học sinh --</option>
                {danhSachHS.map(hs => (
                  <option key={hs.id} value={hs.id}>
                    {hs.ma_hoc_sinh} - {hs.ho_ten}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-md-3 mb-3">
              <label className="fw-bold">Học Kỳ</label>
              <select 
                className="form-select" 
                value={form.hoc_ki}
                onChange={e => setForm({...form, hoc_ki: e.target.value})} 
                required
              >
                <option value="">-- Chọn học kỳ --</option>
                <option value="Học kỳ 1">Học kỳ 1</option>
                <option value="Học kỳ 2">Học kỳ 2</option>
              </select>
            </div>

            <div className="col-md-3 mb-3">
              <label className="fw-bold">Số Tiền (VNĐ)</label>
              {/* ✅ THÊM VALUE ĐỂ KHI SỬA NÓ HIỆN LÊN Ô NHẬP */}
              <input 
                type="number" 
                className="form-control" 
                value={form.so_tien} 
                onChange={e => setForm({...form, so_tien: e.target.value})} 
                required 
              />
            </div>

            <div className="col-md-2 d-flex align-items-end mb-3 gap-2">
              <button type="submit" className={`btn ${idDangSua ? 'btn-warning' : 'btn-primary'} w-100 fw-bold`}>
                {idDangSua ? 'Cập Nhật' : 'Tạo Phiếu'}
              </button>
              {idDangSua && (
                <button type="button" className="btn btn-secondary" onClick={() => { setIdDangSua(null); setForm({ hoc_sinh_id: '', hoc_ki: '', so_tien: '', trang_thai: 'Chưa đóng' }); }}>Hủy</button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover table-bordered mb-0">
            <thead className="table-dark text-center">
              <tr>
                <th className="text-info">Mã HS</th>
                <th className="text-start">Học Sinh</th>
                <th>Học Kỳ</th>
                <th>Số Tiền</th>
                <th>Trạng Thái</th>
                <th>Ngày Đóng</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {danhSachHP.map(hp => (
                <tr key={hp.id} className="align-middle">
                  <td className="fw-bold text-danger">{hp.hoc_sinh?.ma_hoc_sinh}</td>
                  <td className="text-start fw-bold text-primary">{hp.hoc_sinh?.ho_ten}</td>
                  <td>{hp.hoc_ki}</td>
                  <td className="fw-bold text-danger">
                    {Number(hp.so_tien).toLocaleString('vi-VN')} đ
                  </td>
                  <td>
                    <span className={`badge px-3 py-2 ${hp.trang_thai === 'Đã đóng' ? 'bg-success' : 'bg-danger'}`}>
                      {hp.trang_thai}
                    </span>
                  </td>
                  <td>{hp.ngay_dong || '---'}</td>
                  <td>
                    {hp.trang_thai === 'Chưa đóng' && (
                      <button className="btn btn-sm btn-outline-success me-2 fw-bold" onClick={() => handleXacNhanDong(hp.id)}>Thu Tiền</button>
                    )}
                    
                    {hp.trang_thai === 'Đã đóng' && (
                      <button className="btn btn-sm btn-outline-primary me-2 fw-bold" onClick={() => bamNutIn(hp)}>
                        🖨️ In
                      </button>
                    )}

                    {/* ✅ NÚT SỬA ĐƯỢC CHÈN VÀO ĐÂY */}
                    <button className="btn btn-sm btn-outline-warning me-2 fw-bold" onClick={() => handleChonSua(hp)}>Sửa</button>

                    <button className="btn btn-sm btn-link text-danger p-0 fw-bold" style={{ textDecoration: 'none' }} onClick={() => {
                      Swal.fire({
                        title: 'Xóa phiếu này?', icon: 'warning', showCancelButton: true
                      }).then(res => {
                        if(res.isConfirmed) axios.delete(`/hocphi/${hp.id}`).then(() => layDuLieu());
                      })
                    }}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        <MauInHocPhi ref={componentRef} data={duLieuIn} />
      </div>
    </div>
  );
};

export default HocPhi;
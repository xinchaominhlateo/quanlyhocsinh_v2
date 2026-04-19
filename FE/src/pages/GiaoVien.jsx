import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const GiaoVien = () => {
  const [danhSachGV, setDanhSachGV] = useState([]);
  const [danhSachMon, setDanhSachMon] = useState([]);
  const [idDangSua, setIdDangSua] = useState(null);
  const [tuKhoa, setTuKhoa] = useState('');

  // 1. THÊM GIOI_TINH VÀO STATE MẶC ĐỊNH
  const [form, setForm] = useState({ 
    ho_ten: '', 
    gioi_tinh: 'Nam', // Mặc định chọn Nam
    email: '', 
    sdt: '', 
    mon_hoc_id: '' 
  });

  useEffect(() => { layDuLieu(); }, []);

  const layDuLieu = () => {
    axios.get('/giaovien').then(res => setDanhSachGV(res.data.data));
    axios.get('/monhoc').then(res => setDanhSachMon(res.data.data));
  };

  const handleChonSua = (gv) => {
    setIdDangSua(gv.id);
    setForm({
      ho_ten: gv.ho_ten,
      gioi_tinh: gv.gioi_tinh || 'Nam', // Lấy giới tính cũ để hiển thị
      email: gv.email,
      sdt: gv.sdt,
      mon_hoc_id: gv.mon_hoc_id
    });
  };

  const resetForm = () => {
    setForm({ ho_ten: '', gioi_tinh: 'Nam', email: '', sdt: '', mon_hoc_id: '' });
    setIdDangSua(null);
  };

  const handleLuu = (e) => {
    e.preventDefault();

    if (!form.ho_ten.trim()) {
      Swal.fire('Nhắc nhở', 'Vui lòng nhập Họ tên giáo viên!', 'warning');
      return;
    }
    if (!form.email.trim()) {
      Swal.fire('Nhắc nhở', 'Vui lòng nhập Email!', 'warning');
      return;
    }
    if (!form.sdt || form.sdt.length < 10) {
      Swal.fire('Nhắc nhở', 'Số điện thoại phải từ 10 số trở lên!', 'warning');
      return;
    }
    if (!form.mon_hoc_id) {
      Swal.fire('Nhắc nhở', 'Vui lòng chọn Môn dạy!', 'warning');
      return;
    }

    if (idDangSua) {
      axios.put(`/giaovien/${idDangSua}`, form).then(() => {
        Swal.fire('Thành công', 'Đã cập nhật thông tin!', 'success');
        layDuLieu();
        resetForm();
      }).catch(err => {
        Swal.fire('Lỗi', err.response?.data?.message || 'Không thể cập nhật', 'error');
      });
    } else {
      axios.post('/giaovien', form).then(() => {
        Swal.fire('Thành công', 'Đã thêm giáo viên mới!', 'success');
        layDuLieu();
        resetForm();
      }).catch(err => {
        Swal.fire('Lỗi', 'Email đã tồn tại hoặc dữ liệu sai!', 'error');
      });
    }
  };

  const handleXoa = (id) => {
    Swal.fire({
      title: 'Xác nhận xóa?', text: "Dữ liệu giáo viên sẽ mất vĩnh viễn!", icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Xác nhận xóa', cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/giaovien/${id}`).then(() => {
          Swal.fire('Đã xóa!', 'Giáo viên đã được xóa.', 'success');
          layDuLieu();
        });
      }
    });
  };

  const gvDaLoc = danhSachGV.filter(gv => 
    gv.ho_ten.toLowerCase().includes(tuKhoa.toLowerCase()) || 
    gv.ma_giao_vien?.toLowerCase().includes(tuKhoa.toLowerCase())
  );

  return (
    <div className="container-fluid mb-5">
      <h2 className="text-primary fw-bold mb-4">👨‍🏫 QUẢN LÝ GIÁO VIÊN</h2>
      
      <div className={`card shadow-sm mb-4 border-${idDangSua ? 'warning' : 'info'}`}>
        <div className={`card-header text-white fw-bold bg-${idDangSua ? 'warning' : 'info'}`}>
          {idDangSua ? '✏️ Đang sửa thông tin giáo viên' : '📝 Thêm giáo viên mới'}
        </div>
        <div className="card-body">
          <form onSubmit={handleLuu} className="row">
            
            {/* Hàng 1 */}
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Họ tên</label>
              <input type="text" className="form-control" value={form.ho_ten} onChange={e => setForm({...form, ho_ten: e.target.value})} placeholder="Nhập họ và tên..." />
            </div>
            
            {/* 2. KHU VỰC CHỌN GIỚI TÍNH */}
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Giới Tính</label>
              <select className="form-select" value={form.gioi_tinh} onChange={e => setForm({...form, gioi_tinh: e.target.value})}>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold text-danger">Số Điện Thoại</label>
              <input 
                type="text" 
                className="form-control border-danger" 
                value={form.sdt} 
                maxLength={11}
                placeholder="Chỉ nhập số..."
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                onChange={e => setForm({...form, sdt: e.target.value})} 
              />
            </div>

            {/* Hàng 2 */}
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Email</label>
              <input type="email" className="form-control" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@vi-du.com" />
            </div>
            
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Môn dạy chuyên môn</label>
              <select className="form-select" value={form.mon_hoc_id} onChange={e => setForm({...form, mon_hoc_id: e.target.value})}>
                <option value="">-- Chọn Môn --</option>
                {danhSachMon.map(m => <option key={m.id} value={m.id}>{m.ten_mon}</option>)}
              </select>
            </div>

            <div className="col-md-4 d-flex align-items-end justify-content-end mb-3 gap-2">
              <button type="submit" className={`btn fw-bold px-4 w-100 ${idDangSua ? 'btn-warning' : 'btn-info text-white'}`}>
                {idDangSua ? '💾 Cập Nhật' : '💾 Lưu Giáo Viên'}
              </button>
              {idDangSua && <button type="button" className="btn btn-secondary px-4" onClick={resetForm}>Hủy</button>}
            </div>
          </form>
        </div>
      </div>

      <div className="mb-3">
        <input 
          type="text" 
          className="form-control border-primary" 
          placeholder="🔍 Tìm theo Mã GV hoặc Tên giáo viên..." 
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
        />
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-dark text-center">
              <tr>
                <th className="text-info text-center">Mã GV</th>
                <th className="text-start">Họ Tên</th>
                <th>Giới Tính</th>
                <th>Email</th>
                <th className="text-center">SĐT</th>
                <th className="text-center">Chuyên Môn</th>
                <th className="text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {gvDaLoc.length > 0 ? (
                gvDaLoc.map(gv => (
                  <tr key={gv.id} className="align-middle text-center">
                    <td className="fw-bold">{gv.ma_giao_vien}</td>
                    <td className="fw-bold text-primary text-start">{gv.ho_ten}</td>
                    
                    {/* 3. HIỂN THỊ ICON GIỚI TÍNH CỰC NGẦU */}
                    <td>
                      {gv.gioi_tinh === 'Nam' ? (
                        <span className="text-primary">👨‍🏫 Nam</span>
                      ) : gv.gioi_tinh === 'Nữ' ? (
                        <span className="text-danger">👩‍🏫 Nữ</span>
                      ) : (
                        <span className="text-muted">Chưa rõ</span>
                      )}
                    </td>

                    <td>{gv.email}</td>
                    <td>{gv.sdt}</td>
                    <td>
                      <span className="badge bg-warning text-dark p-2">{gv.mon_hoc?.ten_mon || 'N/A'}</span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-warning me-2 fw-bold" onClick={() => handleChonSua(gv)}>Sửa</button>
                      <button className="btn btn-sm btn-outline-danger fw-bold" onClick={() => handleXoa(gv.id)}>Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="text-center py-4 text-muted">Không tìm thấy giáo viên nào!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GiaoVien;
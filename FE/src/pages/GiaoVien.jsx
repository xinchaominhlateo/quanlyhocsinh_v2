import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const GiaoVien = () => {
  const [danhSachGV, setDanhSachGV] = useState([]);
  const [danhSachMon, setDanhSachMon] = useState([]);
  const [idDangSua, setIdDangSua] = useState(null);
  const [tuKhoa, setTuKhoa] = useState(''); // Thêm tìm kiếm cho xịn

  const [form, setForm] = useState({ 
    ho_ten: '', 
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
      email: gv.email,
      sdt: gv.sdt,
      mon_hoc_id: gv.mon_hoc_id
    });
  };

  const resetForm = () => {
    setForm({ ho_ten: '', email: '', sdt: '', mon_hoc_id: '' });
    setIdDangSua(null);
  };

  const handleLuu = (e) => {
    e.preventDefault();

    // 🛑 KIỂM TRA DỮ LIỆU (VALIDATION)
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
      showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Xóa ngay', cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/giaovien/${id}`).then(() => {
          Swal.fire('Đã xóa!', 'Giáo viên đã được xóa.', 'success');
          layDuLieu();
        });
      }
    });
  };

  // Hàm lọc danh sách giáo viên khi tìm kiếm
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
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Họ tên</label>
              <input type="text" className="form-control" value={form.ho_ten} onChange={e => setForm({...form, ho_ten: e.target.value})} placeholder="Nhập họ và tên..." />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Email</label>
              <input type="email" className="form-control" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@vi-du.com" />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold text-danger">Số Điện Thoại</label>
              <input 
                type="text" 
                className="form-control border-danger" 
                value={form.sdt} 
                maxLength={11}
                placeholder="Chỉ nhập số..."
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} // CHẶN NHẬP CHỮ TẠI ĐÂY
                onChange={e => setForm({...form, sdt: e.target.value})} 
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Môn dạy chuyên môn</label>
              <select className="form-select" value={form.mon_hoc_id} onChange={e => setForm({...form, mon_hoc_id: e.target.value})}>
                <option value="">-- Chọn Môn --</option>
                {danhSachMon.map(m => <option key={m.id} value={m.id}>{m.ten_mon}</option>)}
              </select>
            </div>
            <div className="col-md-8 d-flex align-items-end justify-content-end mb-3 gap-2">
              <button type="submit" className={`btn fw-bold px-4 ${idDangSua ? 'btn-warning' : 'btn-info text-white'}`}>
                {idDangSua ? '💾 Cập Nhật' : '💾 Lưu Giáo Viên'}
              </button>
              {idDangSua && <button type="button" className="btn btn-secondary px-4" onClick={resetForm}>Hủy</button>}
            </div>
          </form>
        </div>
      </div>

      {/* Thanh tìm kiếm nhanh */}
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
            <thead className="table-dark">
              <tr>
                <th className="text-info text-center">Mã GV</th>
                <th>Họ Tên</th>
                <th>Email</th>
                <th className="text-center">SĐT</th>
                <th className="text-center">Chuyên Môn</th>
                <th className="text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {gvDaLoc.length > 0 ? (
                gvDaLoc.map(gv => (
                  <tr key={gv.id} className="align-middle">
                    <td className="text-center fw-bold">{gv.ma_giao_vien}</td>
                    <td className="fw-bold text-primary">{gv.ho_ten}</td>
                    <td>{gv.email}</td>
                    <td className="text-center">{gv.sdt}</td>
                    <td className="text-center">
                      <span className="badge bg-warning text-dark p-2">{gv.mon_hoc?.ten_mon || 'N/A'}</span>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-warning me-2 fw-bold" onClick={() => handleChonSua(gv)}>Sửa</button>
                      <button className="btn btn-sm btn-outline-danger fw-bold" onClick={() => handleXoa(gv.id)}>Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center py-4 text-muted">Không tìm thấy giáo viên nào!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GiaoVien;
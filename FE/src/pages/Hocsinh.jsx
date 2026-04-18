import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

const HocSinh = () => {
  const [danhSachHocSinh, setDanhSachHocSinh] = useState([])
  const [hienThiForm, setHienThiForm] = useState(false)
  const [idDangSua, setIdDangSua] = useState(null)
  const [tuKhoa, setTuKhoa] = useState('')

  const [danhSachLop, setDanhSachLop] = useState([]);

  const [trangHienTai, setTrangHienTai] = useState(1)
  const [soLuongMotTrang] = useState(10)

  // 1. Cập nhật formDuLieu ban đầu (Thêm sdt và email)
  const [formDuLieu, setFormDuLieu] = useState({
    ho_ten: '', ngay_sinh: '', gioi_tinh: 'Nam', dia_chi: '', lop_hoc_id: '', sdt: '', email: '' 
  })

  useEffect(() => { 
    layDanhSach();
    axios.get('/lophoc')
      .then(res => setDanhSachLop(res.data.data))
      .catch(err => console.error("Chưa lấy được Lớp:", err));
  }, []);

  const layDanhSach = () => {
    axios.get('/hocsinh')
      .then(response => setDanhSachHocSinh(response.data.data))
      .catch(error => console.error(error))
  }

  const handleChange = (e) => setFormDuLieu({ ...formDuLieu, [e.target.name]: e.target.value })

  const handleLuu = (e) => {
    e.preventDefault();
    
    // 🛑 KIỂM TRA DỮ LIỆU TRƯỚC KHI GỬI
    if (!formDuLieu.ho_ten.trim()) {
      Swal.fire({ icon: 'warning', title: 'Thiếu thông tin!', text: 'Vui lòng nhập Họ Tên.' });
      return; 
    }
    
    // Kiểm tra SĐT (Chỉ nhập số, từ 10-11 số)
    if (!formDuLieu.sdt || formDuLieu.sdt.length < 10) {
      Swal.fire({ icon: 'warning', title: 'Lỗi SĐT', text: 'Số điện thoại phải có từ 10 đến 11 số!' });
      return;
    }

    // Kiểm tra Gmail (Phải kết thúc bằng @gmail.com)
    if (!formDuLieu.email.toLowerCase().endsWith('@gmail.com')) {
      Swal.fire({ icon: 'warning', title: 'Lỗi Gmail', text: 'Email bắt buộc phải có đuôi @gmail.com!' });
      return;
    }

    if (!formDuLieu.lop_hoc_id) {
      Swal.fire({ icon: 'warning', title: 'Thiếu thông tin!', text: 'Vui lòng chọn Lớp Học.' });
      return;
    }

    if (!formDuLieu.dia_chi.trim()) {
      Swal.fire({ icon: 'warning', title: 'Thiếu thông tin!', text: 'Vui lòng nhập Địa Chỉ.' });
      return;
    }

    if (idDangSua) {
      axios.put(`/hocsinh/${idDangSua}`, formDuLieu)
        .then(() => {
          Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Đã cập nhật thông tin.', timer: 1500, showConfirmButton: false })
          layDanhSach(); resetForm();
        })
        .catch(error => {
          const thongBaoLoi = error.response?.data?.message || 'Gmail đã tồn tại hoặc lỗi hệ thống!';
          Swal.fire({ icon: 'error', title: 'Sửa thất bại!', text: thongBaoLoi });
        })
    } else {
      axios.post('/hocsinh', formDuLieu)
        .then(() => {
          Swal.fire({ icon: 'success', title: 'Tuyệt vời!', text: 'Đã thêm học sinh mới.', timer: 1500, showConfirmButton: false })
          layDanhSach(); resetForm();
        })
        .catch(error => {
          const thongBaoLoi = error.response?.data?.message || 'Kiểm tra lại SĐT hoặc Gmail bị trùng!';
          Swal.fire({ icon: 'error', title: 'Thêm thất bại!', text: thongBaoLoi });
        })
    }
  }

  const handleChonSua = (hs) => {
    setIdDangSua(hs.id)
    setFormDuLieu({ 
      ho_ten: hs.ho_ten, 
      ngay_sinh: hs.ngay_sinh, 
      gioi_tinh: hs.gioi_tinh, 
      dia_chi: hs.dia_chi,
      sdt: hs.sdt || '', 
      email: hs.email || '',
      lop_hoc_id: hs.lop_hoc_id || '' 
    })
    setHienThiForm(true)
  }

  const resetForm = () => {
    setFormDuLieu({ ho_ten: '', ngay_sinh: '', gioi_tinh: 'Nam', dia_chi: '', lop_hoc_id: '', sdt: '', email: '' }) 
    setIdDangSua(null)
    setHienThiForm(false)
  }

  const handleXoa = (id) => {
    Swal.fire({
      title: 'Xóa thật nhé?', text: "Dữ liệu sẽ mất vĩnh viễn!", icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#dc3545', confirmButtonText: 'Xóa!', cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/hocsinh/${id}`)
          .then(() => {
            Swal.fire('Đã xóa!', 'Học sinh đã được xóa khỏi hệ thống.', 'success')
            layDanhSach()
          }).catch(error => console.error(error))
      }
    })
  }

  const handleXuatExcel = () => {
    let csv = '\uFEFF'; 
    csv += "ID,Mã HS,Họ Tên,SĐT,Email,Ngày Sinh,Giới Tính,Địa Chỉ,Lớp\n";
    danhSachDaLoc.forEach(hs => {
      const tenLop = hs.lop_hoc ? hs.lop_hoc.ten_lop : 'Chưa xếp lớp';
      csv += `${hs.id},"${hs.ma_hoc_sinh}","${hs.ho_ten}","${hs.sdt}","${hs.email}","${hs.ngay_sinh}","${hs.gioi_tinh}","${hs.dia_chi}","${tenLop}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Danh_Sach_Hoc_Sinh.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const danhSachDaLoc = danhSachHocSinh.filter((hs) => 
    hs.ho_ten?.toLowerCase().includes(tuKhoa.toLowerCase()) || 
    hs.ma_hoc_sinh?.toLowerCase().includes(tuKhoa.toLowerCase()) ||
    hs.sdt?.includes(tuKhoa)
  )
  const viTriCuoi = trangHienTai * soLuongMotTrang
  const viTriDau = viTriCuoi - soLuongMotTrang
  const danhSachHienThi = danhSachDaLoc.slice(viTriDau, viTriCuoi)
  const tongSoTrang = Math.ceil(danhSachDaLoc.length / soLuongMotTrang)
  
  const tongHocSinh = danhSachDaLoc.length
  const tongNam = danhSachDaLoc.filter(hs => hs.gioi_tinh === 'Nam').length
  const tongNu = tongHocSinh - tongNam

  return (
    <div className="container-fluid mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">📚 QUẢN LÝ HỌC SINH</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-info fw-bold text-white shadow-sm" onClick={handleXuatExcel}>📥 Xuất Excel</button>
          <button className={`btn fw-bold shadow-sm ${hienThiForm ? 'btn-secondary' : 'btn-success'}`} onClick={() => hienThiForm ? resetForm() : setHienThiForm(true)}>
            {hienThiForm ? "❌ Đóng Form" : "+ Thêm Học Sinh Mới"}
          </button>
        </div>
      </div>

      <div className="row text-center mb-4">
        <div className="col-md-4 mb-2">
          <div className="card shadow-sm border-primary"><div className="card-body"><h5 className="text-primary fw-bold">Tổng Học Sinh</h5><h3>{tongHocSinh}</h3></div></div>
        </div>
        <div className="col-md-4 mb-2">
          <div className="card shadow-sm border-info"><div className="card-body"><h5 className="text-info fw-bold">👦 Nam</h5><h3>{tongNam}</h3></div></div>
        </div>
        <div className="col-md-4 mb-2">
          <div className="card shadow-sm border-danger"><div className="card-body"><h5 className="text-danger fw-bold">👧 Nữ</h5><h3>{tongNu}</h3></div></div>
        </div>
      </div>

      {hienThiForm && (
        <div className={`card shadow-sm mb-4 border-${idDangSua ? 'warning' : 'success'}`}>
          <div className={`card-header text-white fw-bold bg-${idDangSua ? 'warning' : 'success'}`}>
            {idDangSua ? '✏️ Sửa Thông Tin Học Sinh' : '📝 Thêm Học Sinh Mới'}
          </div>
          <div className="card-body">
            <form onSubmit={handleLuu}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Họ Tên</label>
                  <input type="text" className="form-control" name="ho_ten" value={formDuLieu.ho_ten} onChange={handleChange} required />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold text-danger">Số Điện Thoại</label>
                  <input 
                    type="text" className="form-control border-danger" name="sdt" value={formDuLieu.sdt} 
                    onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} // CHỈ CHO NHẬP SỐ
                    onChange={handleChange} maxLength={11} placeholder="VD: 039xxxxxxx" required 
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold text-primary">Gmail</label>
                  <input type="email" className="form-control border-primary" name="email" value={formDuLieu.email} onChange={handleChange} placeholder="vi-du@gmail.com" required />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Ngày Sinh</label>
                  <input type="date" className="form-control" name="ngay_sinh" value={formDuLieu.ngay_sinh} onChange={handleChange} required />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Giới Tính</label>
                  <select className="form-select" name="gioi_tinh" value={formDuLieu.gioi_tinh} onChange={handleChange}>
                    <option value="Nam">Nam</option><option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Lớp Học</label>
                  <select className="form-select" name="lop_hoc_id" value={formDuLieu.lop_hoc_id} onChange={handleChange} required>
                    <option value="">-- Chọn Lớp --</option>
                    {danhSachLop.map(lop => <option key={lop.id} value={lop.id}>{lop.ten_lop}</option>)}
                  </select>
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-bold">Địa Chỉ</label>
                  <input type="text" className="form-control" name="dia_chi" value={formDuLieu.dia_chi} onChange={handleChange} required />
                </div>
              </div>
              <div className="text-end">
                <button type="submit" className={`btn fw-bold px-4 btn-${idDangSua ? 'warning' : 'primary'}`}>
                  {idDangSua ? '💾 Cập Nhật' : '💾 Lưu Dữ Liệu'}
                </button>
                <button type="button" className="btn btn-secondary ms-2 px-4" onClick={resetForm}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mb-3">
        <input type="text" className="form-control border-primary" placeholder="🔍 Tìm theo Mã HS, Tên hoặc Số điện thoại..." value={tuKhoa} onChange={(e) => { setTuKhoa(e.target.value); setTrangHienTai(1); }} />
      </div>
      
      <div className="card shadow-sm overflow-hidden">
        <table className="table table-hover table-bordered mb-0">
          <thead className="table-dark">
            <tr>
              <th className="text-center">Mã HS</th>
              <th>Họ Tên</th>
              <th className="text-center">SĐT</th>
              <th>Email</th>
              <th className="text-center">Lớp</th>
              <th className="text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {danhSachHienThi.length > 0 ? (
              danhSachHienThi.map((hs) => (
                <tr key={hs.id} className="align-middle">
                  <td className="text-center fw-bold">{hs.ma_hoc_sinh}</td> 
                  <td className="fw-bold text-primary">{hs.ho_ten}</td>
                  <td className="text-center">{hs.sdt}</td>
                  <td>{hs.email}</td>
                  <td className="text-center fw-bold text-danger">{hs.lop_hoc?.ten_lop || 'N/A'}</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleChonSua(hs)}>Sửa</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleXoa(hs.id)}>Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="text-center text-muted py-4">Không tìm thấy học sinh nào!</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {tongSoTrang > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${trangHienTai === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setTrangHienTai(trangHienTai - 1)}>«</button></li>
            {[...Array(tongSoTrang)].map((_, i) => (
              <li key={i} className={`page-item ${trangHienTai === i + 1 ? 'active' : ''}`}><button className="page-link" onClick={() => setTrangHienTai(i + 1)}>{i + 1}</button></li>
            ))}
            <li className={`page-item ${trangHienTai === tongSoTrang ? 'disabled' : ''}`}><button className="page-link" onClick={() => setTrangHienTai(trangHienTai + 1)}>»</button></li>
          </ul>
        </nav>
      )}
    </div>
  )
}

export default HocSinh
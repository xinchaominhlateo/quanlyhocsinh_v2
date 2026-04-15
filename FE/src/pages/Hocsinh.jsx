import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

const HocSinh = () => {
  const [danhSachHocSinh, setDanhSachHocSinh] = useState([])
  const [hienThiForm, setHienThiForm] = useState(false)
  const [idDangSua, setIdDangSua] = useState(null)
  const [tuKhoa, setTuKhoa] = useState('')

  // 1. CHỖ LẮP THỨ 1: Khai báo kho chứa danh sách Lớp Học
  const [danhSachLop, setDanhSachLop] = useState([]);

  const [trangHienTai, setTrangHienTai] = useState(1)
  const [soLuongMotTrang] = useState(10)

  // 2. CHỖ LẮP THỨ 2: Thêm lop_hoc_id vào formDuLieu
  const [formDuLieu, setFormDuLieu] = useState({
    ho_ten: '', ngay_sinh: '', gioi_tinh: 'Nam', dia_chi: '', lop_hoc_id: '' 
  })

  // 3. CHỖ LẮP THỨ 3: Gọi API lấy cả danh sách học sinh LẪN danh sách lớp
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
    
    // Đã tháo cái bẫy alert("Test...") ra rồi nhé!
    // console.log("Chuẩn bị gửi:", formDuLieu); // Ông thích thì cứ để, không thì xóa

    if (idDangSua) {
      // 📝 CODE DÀNH CHO CẬP NHẬT (PUT)
      axios.put(`/hocsinh/${idDangSua}`, formDuLieu)
        .then(() => {
          Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Đã cập nhật thông tin.', timer: 1500, showConfirmButton: false })
          layDanhSach()
          resetForm()
        })
        .catch(error => {
          console.error("Lỗi Sửa API:", error);
          const thongBaoLoi = error.response?.data?.message || 'Lỗi hệ thống hoặc sai đường dẫn API!';
          Swal.fire({ icon: 'error', title: 'Sửa thất bại!', text: thongBaoLoi });
        })
    } else {
      // ➕ CODE DÀNH CHO THÊM MỚI (POST)
      axios.post('/hocsinh', formDuLieu)
        .then(() => {
          Swal.fire({ icon: 'success', title: 'Tuyệt vời!', text: 'Đã thêm học sinh mới.', timer: 1500, showConfirmButton: false })
          layDanhSach()
          resetForm()
        })
        .catch(error => {
          console.error("Lỗi Thêm Mới API:", error);
          const thongBaoLoi = error.response?.data?.message || 'Có vẻ backend Laravel đang phàn nàn gì đó!';
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
      lop_hoc_id: hs.lop_hoc_id || '' // Lấy lớp cũ bỏ vào form
    })
    setHienThiForm(true)
  }

  const resetForm = () => {
    setFormDuLieu({ ho_ten: '', ngay_sinh: '', gioi_tinh: 'Nam', dia_chi: '', lop_hoc_id: '' })
    setIdDangSua(null)
    setHienThiForm(false)
  }

  const handleXoa = (id) => {
    Swal.fire({
      title: 'Xóa thật nhé?', text: "Bay màu luôn đó!", icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#dc3545', confirmButtonText: 'Xóa!', cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/hocsinh/${id}`)
          .then(() => {
            Swal.fire('Đã xóa!', 'Học sinh này đã ra đi.', 'success')
            layDanhSach()
          }).catch(error => console.error(error))
      }
    })
  }

  const handleXuatExcel = () => {
    let csv = '\uFEFF'; 
    csv += "ID,Họ Tên,Ngày Sinh,Giới Tính,Địa Chỉ,Lớp\n";
    danhSachDaLoc.forEach(hs => {
      const tenLop = hs.lop_hoc ? hs.lop_hoc.ten_lop : 'Chưa xếp lớp';
      csv += `${hs.id},"${hs.ho_ten}","${hs.ngay_sinh}","${hs.gioi_tinh}","${hs.dia_chi}","${tenLop}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Bao_Cao_Hoc_Sinh.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    Swal.fire({ icon: 'success', title: 'Đã tải xong!', text: 'File báo cáo Excel đã nằm trong máy của m.', timer: 2000, showConfirmButton: false });
  }

  const danhSachDaLoc = danhSachHocSinh.filter((hs) => hs.ho_ten?.toLowerCase().includes(tuKhoa.toLowerCase()))
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
          <button className="btn btn-info fw-bold text-white shadow-sm" onClick={handleXuatExcel}>
            📥 Xuất Excel
          </button>
          <button className={`btn fw-bold shadow-sm ${hienThiForm ? 'btn-secondary' : 'btn-success'}`} onClick={() => hienThiForm ? resetForm() : setHienThiForm(true)}>
            {hienThiForm ? "❌ Đóng Form" : "+ Thêm Học Sinh Mới"}
          </button>
        </div>
      </div>

      <div className="row text-center mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-primary">
            <div className="card-body">
              <h5 className="text-primary fw-bold">Tổng Học Sinh</h5>
              <h3>{tongHocSinh}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-info">
            <div className="card-body">
              <h5 className="text-info fw-bold">👦 Học Sinh Nam</h5>
              <h3>{tongNam}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-danger">
            <div className="card-body">
              <h5 className="text-danger fw-bold">👧 Học Sinh Nữ</h5>
              <h3>{tongNu}</h3>
            </div>
          </div>
        </div>
      </div>

      {hienThiForm && (
        <div className={`card shadow-sm mb-4 border-${idDangSua ? 'warning' : 'success'}`}>
          <div className={`card-header text-white fw-bold bg-${idDangSua ? 'warning' : 'success'}`}>
            {idDangSua ? '✏️ Cập Nhật Thông Tin' : '📝 Nhập Thông Tin Mới'}
          </div>
          <div className="card-body">
            <form >
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Họ Tên</label>
                  <input type="text" className="form-control" name="ho_ten" value={formDuLieu.ho_ten} onChange={handleChange} />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Ngày Sinh</label>
                  <input type="date" className="form-control" name="ngay_sinh" value={formDuLieu.ngay_sinh} onChange={handleChange} />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Giới Tính</label>
                  <select className="form-select" name="gioi_tinh" value={formDuLieu.gioi_tinh} onChange={handleChange}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                
                {/* 4. CHỖ LẮP THỨ 4: Khung chọn Lớp Học */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold text-danger">Thuộc Lớp Học</label>
                  <select className="form-select border-danger" name="lop_hoc_id" value={formDuLieu.lop_hoc_id} onChange={handleChange} >
                    <option value="">-- Chọn Lớp cho Học sinh --</option>
                    {danhSachLop.map(lop => (
                      <option key={lop.id} value={lop.id}>{lop.ten_lop} (Khối {lop.khoi})</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Địa Chỉ</label>
                  <input type="text" className="form-control" name="dia_chi" value={formDuLieu.dia_chi} onChange={handleChange}  />
                </div>
              </div>
              <button type="button" onClick={handleLuu} className={`btn fw-bold px-4 btn-${idDangSua ? 'warning' : 'primary'}`}>
                {idDangSua ? '💾 Cập Nhật' : '💾 Lưu Dữ Liệu'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="mb-3">
        <input 
          type="text" className="form-control border-primary" 
          placeholder="🔍 Gõ tên học sinh để tìm kiếm nhanh..." 
          value={tuKhoa}
          onChange={(e) => { setTuKhoa(e.target.value); setTrangHienTai(1); }} 
        />
      </div>
      
      <div className="card shadow-sm mb-3">
        <div className="card-body p-0">
          <table className="table table-hover table-striped table-bordered mb-0">
            <thead className="table-dark">
              <tr>
                <th className="text-center">ID</th>
                <th>Họ Tên</th>
                <th className="text-center">Ngày Sinh</th>
                <th className="text-center">Giới Tính</th>
                
                {/* Thêm tiêu đề cột Lớp */}
                <th className="text-center text-warning">Lớp</th> 
                
                <th>Địa Chỉ</th>
                <th className="text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {danhSachHienThi.length > 0 ? (
                danhSachHienThi.map((hs) => (
                  <tr key={hs.id} className="align-middle">
                    <td className="text-center">{hs.id}</td>
                    <td className="fw-bold text-primary">{hs.ho_ten}</td>
                    <td className="text-center">{hs.ngay_sinh}</td>
                    <td className="text-center">
                      <span className={`badge ${hs.gioi_tinh === 'Nam' ? 'bg-info' : 'bg-danger'}`}>{hs.gioi_tinh}</span>
                    </td>

                    {/* 5. CHỖ LẮP THỨ 5: Hiển thị tên lớp trong Bảng */}
                    <td className="text-center fw-bold text-danger">
                      {hs.lop_hoc ? hs.lop_hoc.ten_lop : 'Chưa xếp lớp'}
                    </td>

                    <td>{hs.dia_chi}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-warning me-2 fw-bold" onClick={() => handleChonSua(hs)}>Sửa</button>
                      <button className="btn btn-sm btn-danger fw-bold" onClick={() => handleXoa(hs.id)}>Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="text-center text-muted py-4">Không có dữ liệu! 😢</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {tongSoTrang > 1 && (
        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            <li className={`page-item ${trangHienTai === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setTrangHienTai(trangHienTai - 1)}>« Trước</button>
            </li>
            {[...Array(tongSoTrang)].map((_, i) => (
              <li key={i} className={`page-item ${trangHienTai === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setTrangHienTai(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${trangHienTai === tongSoTrang ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setTrangHienTai(trangHienTai + 1)}>Sau »</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}

export default HocSinh
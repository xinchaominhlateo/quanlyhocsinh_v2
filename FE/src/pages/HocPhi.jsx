import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Banknote, ListChecks, Receipt, CheckCircle, Trash2 } from 'lucide-react';

const HocPhi = () => {
  const [danhSachHP, setDanhSachHP] = useState([]);
  const [danhSachLop, setDanhSachLop] = useState([]);

  // ✅ CHỈ CÒN 2 HỌC KỲ VÀ 1 MỨC GIÁ CỐ ĐỊNH
  const danhSachKyHoc = ["Học kỳ 1", "Học kỳ 2"];
  const MUC_HOC_PHI_CHINH_KHOA = 4500000; 

  const [formLop, setFormLop] = useState({ 
    lop_hoc_id: '', 
    thang_nam: danhSachKyHoc[0], 
    so_tien: MUC_HOC_PHI_CHINH_KHOA 
  });

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    axios.get('/hocphi').then(res => setDanhSachHP(res.data?.data || [])).catch(err => console.log(err));
    axios.get('/lophoc').then(res => setDanhSachLop(res.data?.data || [])).catch(err => console.log(err));
  };

  const handleApDungChoLop = (e) => {
    e.preventDefault();
    axios.post('/hocphi/tao-theo-lop', formLop)
      .then(res => {
        Swal.fire('Thành công', res.data.message, 'success');
        loadData();
        setFormLop({ ...formLop, lop_hoc_id: '' });
      })
      .catch(err => Swal.fire('Lỗi', err.response?.data?.message || 'Không thể tạo học phí', 'error'));
  };

  const handleXacNhanThuTien = (id) => {
    Swal.fire({
      title: 'Xác nhận thu tiền?',
      text: "Bạn xác nhận học sinh này đã đóng đủ tiền?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      confirmButtonText: 'Đã thu tiền!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`/hocphi/${id}`, { trang_thai: 'Đã thanh toán' })
          .then(() => {
            Swal.fire('Thành công!', 'Đã gạch nợ cho học sinh.', 'success');
            loadData();
          });
      }
    });
  };

  const handleXoaPhieu = (id) => {
    Swal.fire({
      title: 'Xóa phiếu thu này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Xóa!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/hocphi/${id}`).then(() => {
          Swal.fire('Đã xóa!', '', 'success');
          loadData();
        });
      }
    });
  };

  const handleInBienLai = (hp) => {
    const noiDungIn = `
      <div class="text-start mt-3" style="font-size: 16px; line-height: 1.8; color: black; font-family: 'Times New Roman', serif;">
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="margin: 0; text-transform: uppercase;">Trường THPT</h2>
            <h3 style="margin: 5px 0; color: #0d6efd;">BIÊN LAI THU TIỀN HỌC PHÍ</h3>
        </div>
        <p><b>👨‍🎓 Học sinh:</b> <span style="text-transform: uppercase; color: #0d6efd; font-weight: bold;">${hp.hoc_sinh?.ho_ten}</span></p>
        <p><b>🏫 Lớp:</b> ${hp.hoc_sinh?.lop_hoc?.ten_lop || 'Chưa cập nhật'}</p>
        <p><b>📝 Nội dung:</b> ${hp.noi_dung}</p>
        <p><b>⏱️ Ngày lập:</b> ${new Date(hp.created_at).toLocaleString('vi-VN')}</p>
        <hr style="border-top: 1px dashed black;"/>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: bold; font-size: 18px;">TỔNG CỘNG:</span>
          <span style="font-weight: bold; color: red; font-size: 24px;">${new Intl.NumberFormat('vi-VN').format(hp.so_tien)} VNĐ</span>
        </div>
        <div style="text-align: center; margin-top: 15px;">
           <span style="background-color: ${hp.trang_thai === 'Đã thanh toán' ? '#198754' : '#ffc107'}; color: ${hp.trang_thai === 'Đã thanh toán' ? 'white' : 'black'}; padding: 5px 10px; border-radius: 5px; font-weight: bold;">
              Trạng thái: ${hp.trang_thai}
           </span>
        </div>
      </div>
    `;

    Swal.fire({
      title: 'Chi tiết biên lai',
      html: noiDungIn,
      width: 600,
      showCancelButton: true,
      confirmButtonText: '🖨️ In Biên Lai',
      cancelButtonText: 'Đóng',
    }).then((result) => {
      if (result.isConfirmed) {
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write('<html><head><title>In Biên Lai</title></head><body>' + noiDungIn + '</body></html>');
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { 
            printWindow.print(); 
            printWindow.close();
        }, 500);
      }
    });
  };

  return (
    <div className="container-fluid mb-5">
      <h2 className="text-primary fw-bold mb-4"><Banknote size={32} className="me-2"/>QUẢN LÝ HỌC PHÍ</h2>

      <div className="card shadow-sm mb-4 border-primary">
        <div className="card-header bg-primary text-white fw-bold">💰 Áp Học Phí Chính Khóa</div>
        <div className="card-body">
          <form onSubmit={handleApDungChoLop} className="row g-3">
            <div className="col-md-4">
              <label className="fw-bold mb-1 text-secondary">🏫 Chọn Lớp</label>
              <select className="form-select border-primary" value={formLop.lop_hoc_id} onChange={e => setFormLop({...formLop, lop_hoc_id: e.target.value})} required>
                <option value="">-- Chọn lớp học --</option>
                {danhSachLop.map(lop => <option key={lop.id} value={lop.id}>{lop.ten_lop}</option>)}
              </select>
            </div>
            
            <div className="col-md-3">
              <label className="fw-bold mb-1 text-secondary">🗓️ Chọn Học kỳ</label>
              <select className="form-select border-primary" value={formLop.thang_nam} onChange={e => setFormLop({...formLop, thang_nam: e.target.value})} required>
                {danhSachKyHoc.map((ky, index) => <option key={index} value={ky}>{ky}</option>)}
              </select>
            </div>

            <div className="col-md-3">
              <label className="fw-bold mb-1 text-secondary">💵 Số tiền </label>
              <input type="text" className="form-control bg-light fw-bold text-danger" value={new Intl.NumberFormat('vi-VN').format(MUC_HOC_PHI_CHINH_KHOA) + " VNĐ"} readOnly />
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100 fw-bold shadow">🚀 Áp Dụng</button>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white fw-bold py-3"><ListChecks size={20} className="me-2"/>DANH SÁCH PHIẾU THU</div>
        <div className="table-responsive">
          <table className="table table-hover mb-0 text-center align-middle">
            <thead className="table-secondary">
              <tr>
                <th className="text-start ps-3">Học Sinh</th>
                <th>Số Tiền</th>
                <th>Học Kỳ</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {danhSachHP.map(hp => (
                <tr key={hp.id}>
                  <td className="text-start ps-3">
                    <div className="fw-bold">{hp.hoc_sinh?.ho_ten}</div>
                    <small className="text-muted">Lớp: {hp.hoc_sinh?.lop_hoc?.ten_lop}</small>
                  </td>
                  <td className="fw-bold text-danger fs-6">{new Intl.NumberFormat('vi-VN').format(hp.so_tien)}đ</td>
                  <td><span className="badge bg-light text-dark border">{hp.hoc_ki}</span></td>
                  <td>
                    <span className={`badge ${hp.trang_thai === 'Đã thanh toán' ? 'bg-success' : 'bg-warning text-dark'} p-2`}>
                      {hp.trang_thai}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => handleInBienLai(hp)} title="Xem biên lai"><Receipt size={16}/></button>
                      {hp.trang_thai !== 'Đã thanh toán' && (
                        <button className="btn btn-sm btn-success" onClick={() => handleXacNhanThuTien(hp.id)} title="Xác nhận đã thu tiền"><CheckCircle size={16}/></button>
                      )}
                      {hp.trang_thai !== 'Đã thanh toán' && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleXoaPhieu(hp.id)} title="Xóa phiếu thu"><Trash2 size={16}/></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {danhSachHP.length === 0 && (
                  <tr><td colSpan="5" className="text-center text-muted py-4">Chưa có dữ liệu học phí.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HocPhi;
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Banknote, UserPlus, ListChecks, Receipt, CheckCircle, Trash2 } from 'lucide-react';

const HocPhi = () => {
  const [danhSachHP, setDanhSachHP] = useState([]);
  const [danhSachHS, setDanhSachHS] = useState([]);
  const [danhSachMon, setDanhSachMon] = useState([]);
  
  const [selectedHS, setSelectedHS] = useState('');
  const [selectedMons, setSelectedMons] = useState([]); 
  const [tongTien, setTongTien] = useState(0);

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    axios.get('/hocphi').then(res => setDanhSachHP(res.data?.data || [])).catch(err => console.log(err));
    axios.get('/hocsinh').then(res => setDanhSachHS(res.data?.data || [])).catch(err => console.log(err));
    axios.get('/monhoc').then(res => setDanhSachMon(res.data?.data || [])).catch(err => console.log(err));
  };

  useEffect(() => {
    const total = danhSachMon
      .filter(m => selectedMons.includes(m.id))
      .reduce((sum, m) => sum + (parseFloat(m.hoc_phi) || 0), 0);
    setTongTien(total);
  }, [selectedMons, danhSachMon]);

  const handleToggleMon = (id) => {
    setSelectedMons(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleTaoPhieu = (e) => {
    e.preventDefault();
    if (!selectedHS || selectedMons.length === 0) return Swal.fire('Nhắc nhở', 'Vui lòng chọn Học sinh và ít nhất 1 môn!', 'info');

    axios.post('/hocphi', { hoc_sinh_id: selectedHS, selected_mon_hoc: selectedMons })
      .then(res => {
        Swal.fire('Thành công', 'Đã tạo phiếu thu thành công!', 'success');
        loadData(); setSelectedHS(''); setSelectedMons([]);
      })
      .catch(err => {
        console.log(err);
        Swal.fire('Lỗi', 'Không thể tạo phiếu thu, hãy kiểm tra Console (F12)', 'error');
      });
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

  // 🚀 HÀM IN BIÊN LAI: KẾT HỢP POPUP ĐẸP VÀ IN KHÔNG BỊ TRẮNG MÀN HÌNH
  const handleInBienLai = (hp) => {
    // Nội dung HTML để hiển thị trên Popup và để In
    const noiDungIn = `
      <div class="text-start mt-3" style="font-size: 16px; line-height: 1.8; color: black; font-family: 'Times New Roman', serif;">
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="margin: 0; text-transform: uppercase;">Trường THPT Chuyên K49</h2>
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
        <div style="display: flex; justify-content: space-around; margin-top: 50px; text-align: center;">
            <div>
                <b>Người nộp tiền</b><br/><i>(Ký, họ tên)</i>
            </div>
            <div>
                <b>Người thu tiền</b><br/><i>(Ký, họ tên)</i>
            </div>
        </div>
      </div>
    `;

    // 1. Vẫn hiện Popup y như ý em muốn
    Swal.fire({
      title: 'Chi tiết biên lai',
      html: noiDungIn,
      width: 600,
      showCancelButton: true,
      confirmButtonText: '🖨️ In Biên Lai',
      cancelButtonText: 'Đóng',
    }).then((result) => {
      if (result.isConfirmed) {
        // 2. Khi bấm In, hệ thống sẽ âm thầm tạo khung in riêng biệt (Khắc phục lỗi màn hình trắng)
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write('<html><head><title>In Biên Lai</title></head><body>' + noiDungIn + '</body></html>');
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { 
            printWindow.print(); 
            printWindow.close(); // In xong tự đóng lại luôn cho mượt
        }, 500);
      }
    });
  };

  return (
    <div className="container-fluid mb-5">
      <h2 className="text-primary fw-bold mb-4"><Banknote size={32} className="me-2"/>QUẢN LÝ HỌC PHÍ</h2>

      <div className="row g-4">
        {/* BÊN TRÁI: FORM TẠO PHIẾU THÔNG MINH */}
        <div className="col-md-5">
          <div className="card shadow-sm border-0 bg-light p-4">
            <h5 className="fw-bold mb-4 text-dark"><UserPlus size={20} className="me-2"/>LẬP PHIẾU THU MỚI</h5>
            
            <label className="fw-bold mb-2">1. Chọn Học Sinh</label>
            <select className="form-select mb-4 border-primary" value={selectedHS} onChange={e => setSelectedHS(e.target.value)}>
              <option value="">-- Tìm tên học sinh --</option>
              {danhSachHS.map(hs => <option key={hs.id} value={hs.id}>{hs.ho_ten} - {hs.ma_hoc_sinh}</option>)}
            </select>

            <label className="fw-bold mb-2">2. Chọn Các Khoản Thu (Môn học)</label>
            <div className="border bg-white rounded p-3 mb-4" style={{maxHeight: '250px', overflowY: 'auto'}}>
              {danhSachMon.map(mon => (
                <div key={mon.id} className="form-check mb-2 d-flex justify-content-between align-items-center">
                  <div>
                    <input className="form-check-input" type="checkbox" checked={selectedMons.includes(mon.id)} onChange={() => handleToggleMon(mon.id)} id={`mon-${mon.id}`} />
                    <label className="form-check-link ms-2" htmlFor={`mon-${mon.id}`}>{mon.ten_mon}</label>
                  </div>
                  <span className="text-muted small">{new Intl.NumberFormat('vi-VN').format(mon.hoc_phi)}đ</span>
                </div>
              ))}
            </div>

            <div className="alert alert-dark d-flex justify-content-between align-items-center py-3">
              <span className="fw-bold">TỔNG TIỀN:</span>
              <span className="fs-4 fw-bold text-danger">{new Intl.NumberFormat('vi-VN').format(tongTien)} VNĐ</span>
            </div>

            <button className="btn btn-primary w-100 fw-bold py-2 shadow" onClick={handleTaoPhieu}>+ XÁC NHẬN TẠO PHIẾU THU</button>
          </div>
        </div>

        {/* BÊN PHẢI: LỊCH SỬ PHIẾU THU */}
        <div className="col-md-7">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white fw-bold py-3"><ListChecks size={20} className="me-2"/>DANH SÁCH PHIẾU ĐÃ LẬP</div>
            <div className="table-responsive">
              <table className="table table-hover mb-0 text-center align-middle">
                <thead className="table-secondary">
                  <tr>
                    <th className="text-start ps-3">Học Sinh</th>
                    <th>Số Tiền</th>
                    <th>Trạng Thái</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {danhSachHP.map(hp => (
                    <tr key={hp.id}>
                      <td className="text-start ps-3">
                        <div className="fw-bold">{hp.hoc_sinh?.ho_ten}</div>
                        <small className="text-muted">{hp.noi_dung}</small>
                      </td>
                      <td className="fw-bold text-danger fs-6">{new Intl.NumberFormat('vi-VN').format(hp.so_tien)}đ</td>
                      
                      {/* Cột Trạng thái */}
                      <td>
                        <span className={`badge ${hp.trang_thai === 'Đã thanh toán' ? 'bg-success' : 'bg-warning text-dark'} p-2`}>
                          {hp.trang_thai}
                        </span>
                      </td>

                      {/* CỘT THAO TÁC ĐÃ ĐƯỢC GIỮ NGUYÊN NHƯ Ý EM */}
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => handleInBienLai(hp)} title="Xem biên lai">
                            <Receipt size={16}/>
                          </button>

                          {hp.trang_thai !== 'Đã thanh toán' && (
                            <button className="btn btn-sm btn-success" onClick={() => handleXacNhanThuTien(hp.id)} title="Xác nhận đã thu tiền">
                              <CheckCircle size={16}/>
                            </button>
                          )}

                          {hp.trang_thai !== 'Đã thanh toán' && (
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleXoaPhieu(hp.id)} title="Xóa phiếu thu">
                              <Trash2 size={16}/>
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))}
                  {danhSachHP.length === 0 && (
                     <tr><td colSpan="4" className="text-center text-muted py-4">Chưa có phiếu thu nào!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HocPhi;
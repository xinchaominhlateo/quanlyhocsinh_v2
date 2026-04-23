import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ArrowRightLeft, ShieldAlert, GraduationCap } from 'lucide-react';

const KetChuyenNamHoc = () => {
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [lopCu, setLopCu] = useState('');
  const [lopMoi, setLopMoi] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Tải danh sách lớp để chọn
    axios.get('/lophoc').then(res => setDanhSachLop(res.data.data || [])).catch(err => console.log(err));
  }, []);

  const handleKetChuyen = (e) => {
    e.preventDefault();
    if (!lopCu || !lopMoi) return Swal.fire('Lỗi', 'Vui lòng chọn đầy đủ lớp cũ và lớp mới!', 'error');

    Swal.fire({
      title: 'Xác nhận kết chuyển?',
      text: "Toàn bộ học sinh lớp cũ sẽ được chuyển sang lớp mới. Hành động này không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý chuyển',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        setIsProcessing(true);
        axios.post('/hocsinh/ket-chuyen', { lop_cu_id: lopCu, lop_moi_id: lopMoi })
          .then(res => {
            Swal.fire('Thành công', res.data.message, 'success');
            setLopCu('');
            setLopMoi('');
          })
          .catch(err => Swal.fire('Lỗi', err.response?.data?.message || 'Có lỗi xảy ra', 'error'))
          .finally(() => setIsProcessing(false));
      }
    });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-dark text-white p-4">
              <h3 className="m-0 d-flex align-items-center gap-2">
                <ArrowRightLeft /> KẾT CHUYỂN NĂM HỌC THÔNG MINH
              </h3>
            </div>
            <div className="card-body p-5 bg-light">
              <div className="alert alert-info d-flex align-items-center gap-3">
                <ShieldAlert size={40} />
                <span>
                  Chức năng này giúp bạn chuyển tất cả học sinh từ một lớp (ví dụ 10A1) 
                  lên một lớp mới (ví dụ 11A1) chỉ trong vài giây.
                </span>
              </div>

              <form onSubmit={handleKetChuyen} className="mt-4">
                <div className="row align-items-center">
                  <div className="col-md-5">
                    <label className="fw-bold mb-2">🏫 Lớp cũ (Khối dưới)</label>
                    <select className="form-select form-select-lg border-primary" value={lopCu} onChange={e => setLopCu(e.target.value)}>
                      <option value="">-- Chọn lớp cũ --</option>
                      {danhSachLop.map(lop => <option key={lop.id} value={lop.id}>{lop.ten_lop}</option>)}
                    </select>
                  </div>

                  <div className="col-md-2 text-center mt-4">
                    <ArrowRightLeft size={30} className="text-secondary" />
                  </div>

                  <div className="col-md-5">
                    <label className="fw-bold mb-2">🎓 Lớp mới (Khối trên)</label>
                    <select className="form-select form-select-lg border-success" value={lopMoi} onChange={e => setLopMoi(e.target.value)}>
                      <option value="">-- Chọn lớp mới --</option>
                      {danhSachLop.map(lop => <option key={lop.id} value={lop.id}>{lop.ten_lop}</option>)}
                    </select>
                  </div>
                </div>

                <div className="text-center mt-5">
                  <button type="submit" disabled={isProcessing} className="btn btn-primary btn-lg px-5 shadow fw-bold">
                    {isProcessing ? 'Đang xử lý...' : 'THỰC HIỆN KẾT CHUYỂN NGAY'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KetChuyenNamHoc;
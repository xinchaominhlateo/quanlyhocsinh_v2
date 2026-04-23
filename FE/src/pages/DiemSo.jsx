import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Save, Search, Table } from 'lucide-react';

const DiemSo = () => {
  const [danhSachDiem, setDanhSachDiem] = useState([]);
  const [danhSachMon, setDanhSachMon] = useState([]);
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [danhSachHS, setDanhSachHS] = useState([]);
  
  const [selectedMon, setSelectedMon] = useState('');
  const [selectedLop, setSelectedLop] = useState('');
  const [batchData, setBatchData] = useState([]);

  const userRole = localStorage.getItem('userRole') || 'student';

  useEffect(() => { layDuLieu(); }, []);

  const layDuLieu = () => {
    axios.get('/diemso').then(res => setDanhSachDiem(res.data.data || [])).catch(err => console.log(err));
    if (userRole !== 'student') {
      axios.get('/monhoc').then(res => setDanhSachMon(res.data.data || [])).catch(err => console.log(err));
      axios.get('/hocsinh').then(res => setDanhSachHS(res.data.data || [])).catch(err => console.log(err));
      const apiLop = userRole === 'teacher' ? '/my-classes' : '/lophoc';
      axios.get(apiLop).then(res => setDanhSachLop(res.data.data || [])).catch(err => console.log(err));
    }
  };

  useEffect(() => {
    if (selectedLop && selectedMon) {
      const studentsInClass = danhSachHS.filter(hs => String(hs.lop_hoc_id) === String(selectedLop));
      const initialBatch = studentsInClass.map(hs => {
        const existing = danhSachDiem.find(d => String(d.hoc_sinh_id) === String(hs.id) && String(d.mon_hoc_id) === String(selectedMon));
        return {
          hoc_sinh_id: hs.id,
          ho_ten: hs.ho_ten,
          diem_mieng: existing?.diem_mieng ?? '',
          diem_15_phut: existing?.diem_15_phut ?? '',
          diem_1_tiet: existing?.diem_1_tiet ?? '',
          diem_thi: existing?.diem_thi ?? ''
        };
      });
      setBatchData(initialBatch);
    } else {
      setBatchData([]);
    }
  }, [selectedLop, selectedMon, danhSachHS, danhSachDiem]);

  const handleInputChange = (index, field, value) => {
    const newData = [...batchData];
    newData[index][field] = value;
    setBatchData(newData);
  };

  const handleLuuDiem = (e) => {
    e.preventDefault();
    axios.post('/diemso/batch', { mon_hoc_id: selectedMon, diem_data: batchData })
      .then(res => {
        Swal.fire('Thành công', res.data.message, 'success');
        layDuLieu();
      })
      .catch(err => Swal.fire('Lỗi', err.response?.data?.message || 'Không thể lưu điểm', 'error'));
  };

  const formatDiem = (val) => (val !== null && val !== undefined && val !== '') ? val : '-';

  return (
    <div className="container-fluid mb-5">
      <h2 className="text-primary fw-bold mb-4">📚 QUẢN LÝ ĐIỂM SỐ</h2>

      {userRole !== 'student' && (
        <div className="card shadow-sm mb-5 border-0 bg-light">
          <div className="card-header bg-primary text-white fw-bold">🚀 NHẬP ĐIỂM NHANH THEO LỚP</div>
          <div className="card-body">
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="fw-bold">Chọn Môn Học</label>
                <select className="form-select border-primary" value={selectedMon} onChange={e => setSelectedMon(e.target.value)}>
                  <option value="">-- Chọn môn --</option>
                  {danhSachMon.map(mon => <option key={mon.id} value={mon.id}>{mon.ten_mon}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="fw-bold">Chọn Lớp Học</label>
                <select className="form-select border-primary" value={selectedLop} onChange={e => setSelectedLop(e.target.value)}>
                  <option value="">-- Chọn lớp --</option>
                  {danhSachLop.map(lop => <option key={lop.id} value={lop.id}>{lop.ten_lop}</option>)}
                </select>
              </div>
            </div>

            {selectedLop && selectedMon ? (
              <form onSubmit={handleLuuDiem}>
                <div className="table-responsive">
                  <table className="table table-bordered bg-white align-middle text-center">
                    <thead className="table-dark">
                      <tr>
                        <th className="text-start">Học Sinh</th>
                        <th style={{width:'15%'}}>Miệng</th>
                        <th style={{width:'15%'}}>15 Phút</th>
                        <th style={{width:'15%'}}>1 Tiết (x2)</th>
                        <th style={{width:'15%'}}>Thi HK (x3)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchData.length > 0 ? batchData.map((item, index) => (
                        <tr key={item.hoc_sinh_id}>
                          <td className="text-start fw-bold text-primary">{item.ho_ten}</td>
                          <td><input type="number" step="0.1" className="form-control text-center" value={item.diem_mieng} onChange={e => handleInputChange(index, 'diem_mieng', e.target.value)} /></td>
                          <td><input type="number" step="0.1" className="form-control text-center" value={item.diem_15_phut} onChange={e => handleInputChange(index, 'diem_15_phut', e.target.value)} /></td>
                          <td><input type="number" step="0.1" className="form-control text-center" value={item.diem_1_tiet} onChange={e => handleInputChange(index, 'diem_1_tiet', e.target.value)} /></td>
                          <td><input type="number" step="0.1" className="form-control text-center" value={item.diem_thi} onChange={e => handleInputChange(index, 'diem_thi', e.target.value)} /></td>
                        </tr>
                      )) : <tr><td colSpan="5" className="text-danger py-3">Lớp này chưa có học sinh nào!</td></tr>}
                    </tbody>
                  </table>
                </div>
                <div className="text-end mt-3"><button type="submit" className="btn btn-success fw-bold px-4 shadow"><Save size={18} className="me-2"/>LƯU BẢNG ĐIỂM</button></div>
              </form>
            ) : <div className="alert alert-warning text-center fw-bold">Vui lòng chọn đầy đủ 📚 Môn và 🏫 Lớp để nhập điểm!</div>}
          </div>
        </div>
      )}

      <h5 className="text-secondary fw-bold mb-3"><Search size={20} className="me-2"/>LỊCH SỬ ĐIỂM SỐ</h5>
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0 text-center align-middle">
            <thead className="table-secondary">
              <tr>
                <th className="text-start">Học Sinh</th>
                <th>Môn</th>
                <th>Miệng</th>
                <th>15p</th>
                <th>1 Tiết</th>
                <th>Thi</th>
                <th className="text-danger fw-bold">ĐTB</th>
                <th>Xếp Loại</th>
              </tr>
            </thead>
            <tbody>
              {danhSachDiem.map(d => (
                <tr key={d.id}>
                  <td className="text-start fw-bold">{d.hoc_sinh?.ho_ten}</td>
                  <td>{d.mon_hoc?.ten_mon}</td>
                  <td>{formatDiem(d.diem_mieng)}</td>
                  <td>{formatDiem(d.diem_15_phut)}</td>
                  <td>{formatDiem(d.diem_1_tiet)}</td>
                  <td>{formatDiem(d.diem_thi)}</td>
                  <td className="fw-bold text-danger">{d.diem_trung_binh}</td>
                  <td><span className={`badge ${d.xep_loai === 'Giỏi' ? 'bg-success' : d.xep_loai === 'Khá' ? 'bg-primary' : 'bg-warning text-dark'}`}>{d.xep_loai}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DiemSo;
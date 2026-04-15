import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { User, Lock, Users, Trash2, UserPlus, Mail, ShieldCheck, X } from 'lucide-react';

const TaiKhoan = () => {
    const [showModal, setShowModal] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
    const [profile, setProfile] = useState({ name: 'Vũ Thành Vinh', email: 'admin@gmail.com' });
    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

    // 1. Quản lý danh sách Admin/Thư ký bằng State để hiển thị động
    const [admins, setAdmins] = useState([
        { id: 1, name: 'Vũ Thành Vinh', email: 'admin@gmail.com', role: 'Quản trị viên' }
    ]);

    // 2. Hàm xử lý thêm thư ký mới vào bảng
    const handleAddAdmin = (e) => {
        e.preventDefault();
        if (!newAdmin.email.includes('@gmail.com')) {
        return Swal.fire({
            icon: 'error',
            title: 'Sai định dạng rồi Tèo ơi!',
            text: 'M phải nhập đúng địa chỉ @gmail.com thì hệ thống mới nhận nhé.',
            confirmButtonColor: '#ef4444'
        });
    }
        const secretary = {
            id: admins.length + 1,
            name: newAdmin.name,
            email: newAdmin.email,
            role: 'Thư ký'
        };

        // Cập nhật danh sách: Thêm người mới vào mảng cũ
        setAdmins([...admins, secretary]);

        Swal.fire('Thành công!', `Đã cấp quyền cho thư ký ${newAdmin.name}`, 'success');
        setShowModal(false);
        setNewAdmin({ name: '', email: '', password: '' }); // Reset form
    };

    // 3. Hàm xử lý xóa thư ký
    const handleXoaAdmin = (id) => {
        Swal.fire({
            title: 'Xóa tài khoản này?',
            text: "Thư ký này sẽ không thể đăng nhập nữa!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Xóa ngay',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                setAdmins(admins.filter(ad => ad.id !== id));
                Swal.fire('Đã xóa!', 'Tài khoản đã được gỡ khỏi hệ thống.', 'success');
            }
        });
    };

    return (
        <div className="container-fluid p-4" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', position: 'relative' }}>
            <h3 className="fw-bold mb-4" style={{ color: '#1e293b' }}>⚙️ Quản Lý Hệ Thống</h3>

            <div className="row g-4">
                {/* --- PHẦN 1: THÔNG TIN CÁ NHÂN --- */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '15px' }}>
                        <div className="d-flex align-items-center gap-2 mb-3 text-primary">
                            <User size={24} /> <h5 className="fw-bold m-0">Thông tin cá nhân</h5>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); Swal.fire('Thành công', 'Đã lưu thông tin', 'success') }}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">HỌ VÀ TÊN</label>
                                <input type="text" className="form-control bg-light border-0" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} style={{ borderRadius: '10px' }} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">EMAIL</label>
                                <input type="email" className="form-control bg-light border-0" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} style={{ borderRadius: '10px' }} />
                            </div>
                            <button className="btn btn-primary w-100 fw-bold border-0" style={{ backgroundColor: '#6366f1', borderRadius: '10px' }}>Lưu thay đổi</button>
                        </form>
                    </div>
                </div>

                {/* --- PHẦN 2: BẢO MẬT --- */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '15px' }}>
                        <div className="d-flex align-items-center gap-2 mb-3 text-danger">
                            <Lock size={24} /> <h5 className="fw-bold m-0">Bảo mật tài khoản</h5>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); Swal.fire('Thành công', 'Mật khẩu đã được đổi', 'success') }}>
                            <input type="password" placeholder="Mật khẩu cũ" className="form-control bg-light border-0 mb-3" style={{ borderRadius: '10px' }} />
                            <input type="password" placeholder="Mật khẩu mới" className="form-control bg-light border-0 mb-3" style={{ borderRadius: '10px' }} />
                            <button className="btn btn-danger w-100 fw-bold border-0" style={{ borderRadius: '10px' }}>Đổi mật khẩu</button>
                        </form>
                    </div>
                </div>

                {/* --- PHẦN 3: DANH SÁCH HIỂN THỊ ĐỘNG --- */}
                <div className="col-12 mt-4">
                    <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '15px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center gap-2 text-success">
                                <Users size={24} /> <h5 className="fw-bold m-0">Danh sách Admin/Thư ký</h5>
                            </div>
                            <button 
                                className="btn btn-success d-flex align-items-center gap-2 fw-bold border-0 shadow-sm" 
                                style={{ borderRadius: '10px', padding: '10px 20px' }}
                                onClick={() => setShowModal(true)}
                            >
                                <UserPlus size={18} /> Thêm Thư Ký
                            </button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Họ tên</th> <th>Email</th> <th>Vai trò</th> <th className="text-center">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admins.map((ad) => (
                                        <tr key={ad.id}>
                                            <td className="fw-bold">{ad.name}</td>
                                            <td>{ad.email}</td>
                                            <td>
                                                <span className={`badge px-3 py-2 rounded-pill ${ad.role === 'Quản trị viên' ? 'bg-primary-subtle text-primary' : 'bg-success-subtle text-success'}`}>
                                                    {ad.role}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                {ad.role !== 'Quản trị viên' ? (
                                                    <button 
                                                        className="btn btn-outline-danger btn-sm border-0"
                                                        onClick={() => handleXoaAdmin(ad.id)}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                ) : (
                                                    <ShieldCheck size={18} className="text-muted" />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL FORM --- */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
                    alignItems: 'center', zIndex: 1050
                }}>
                    <div className="card border-0 p-4 shadow-lg" style={{ width: '400px', borderRadius: '20px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold m-0">Tạo tài khoản thư ký</h5>
                            <button className="btn btn-light rounded-circle" onClick={() => setShowModal(false)}><X size={20}/></button>
                        </div>
                        <form onSubmit={handleAddAdmin}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Tên thư ký</label>
                                <input type="text" required className="form-control bg-light border-0" value={newAdmin.name} onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Email đăng nhập</label>
                                <input type="email" required className="form-control bg-light border-0" value={newAdmin.email} onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Mật khẩu tạm thời</label>
                                <input type="password" required className="form-control bg-light border-0" value={newAdmin.password} onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})} />
                            </div>
                            <button type="submit" className="btn btn-success w-100 fw-bold py-2 mt-2" style={{ borderRadius: '10px' }}>Xác nhận thêm</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaiKhoan;
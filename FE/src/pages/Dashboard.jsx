import React from 'react';

const Dashboard = () => {
    return (
        <div className="container-fluid p-0">
            {/* 1. BANNER CHÍNH - ĐÃ XÓA ẢNH NỀN, DÙNG MÀU PHẲNG CHO CHUYÊN NGHIỆP */}
            <div 
                className="p-5 text-center text-white mb-4 d-flex flex-column justify-content-center align-items-center" 
                style={{ 
                    minHeight: '300px',
                    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                    borderRadius: '0 0 20px 20px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
            >
                <div style={{ fontSize: '3.5rem', marginBottom: '10px' }}>💻</div>
                <h1 className="fw-bold text-uppercase mb-3" style={{ letterSpacing: '1px' }}>
                    HỆ THỐNG QUẢN LÝ HỌC SINH THPT
                </h1>
                <p className="fs-5 opacity-75 fw-light w-75">
                    Giải pháp số hóa toàn diện công tác quản lý hồ sơ, lớp học và tài chính nhà trường.
                </p>
            </div>

            {/* 2. NỘI DUNG CHÍNH */}
            <div className="row px-4 g-4 mb-5">
                
                {/* Cột trái: Giới thiệu hệ thống */}
                <div className="col-md-8">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-white border-0 pt-4 pb-0">
                            <h4 className="text-primary fw-bold border-start border-primary border-4 ps-3">Phân hệ chức năng chính</h4>
                        </div>
                        <div className="card-body px-4 pb-4">
                            <p className="text-muted mb-4">
                                Hệ thống được tối ưu hóa để phục vụ công tác quản lý nội bộ của nhà trường, bao gồm các nghiệp vụ cốt lõi sau:
                            </p>
                            
                            <div className="row g-3">
                                {/* 1. Quản lý học sinh */}
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded-3 h-100 border-start border-primary border-3 shadow-sm">
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="fs-4 me-2">🎓</span>
                                            <span className="fw-bold text-primary">Quản lý Học sinh</span>
                                        </div>
                                        <small className="text-muted">Tiếp nhận hồ sơ, quản lý thông tin cá nhân và quá trình học tập của từng học sinh.</small>
                                    </div>
                                </div>

                                {/* 2. Quản lý lớp học */}
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded-3 h-100 border-start border-success border-3 shadow-sm">
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="fs-4 me-2">🏫</span>
                                            <span className="fw-bold text-success">Quản lý Lớp học</span>
                                        </div>
                                        <small className="text-muted">Khởi tạo danh mục lớp, phân chia sĩ số và theo dõi danh sách lớp theo từng năm học.</small>
                                    </div>
                                </div>

                                {/* 3. Quản lý học phí */}
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded-3 h-100 border-start border-warning border-3 shadow-sm">
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="fs-4 me-2">💰</span>
                                            <span className="fw-bold text-warning">Quản lý Học phí</span>
                                        </div>
                                        <small className="text-muted">Lập phiếu thu, xác nhận đóng phí, in biên lai và quản lý công nợ học phí học sinh.</small>
                                    </div>
                                </div>

                                {/* 4. Quản lý thống kê */}
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded-3 h-100 border-start border-danger border-3 shadow-sm">
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="fs-4 me-2">📊</span>
                                            <span className="fw-bold text-danger">Quản lý Thống kê</span>
                                        </div>
                                        <small className="text-muted">Tổng hợp báo cáo về điểm số, tỉ lệ giới tính và tình hình tài chính của toàn trường.</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cột phải: Thông báo nội bộ */}
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100 bg-light" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-transparent border-0 pt-4 pb-0">
                            <h5 className="text-dark fw-bold"><span className="me-2">📢</span>Thông báo hệ thống</h5>
                        </div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush rounded-3">
                                <li className="list-group-item bg-white px-3 py-3 border-bottom border-light mb-2 rounded shadow-sm">
                                    <small className="text-primary fw-bold d-block mb-1">Cập nhật v2.1.0</small>
                                    <span className="text-dark">Đã hoàn thiện tính năng liên kết Tên Lớp vào Biên lai thu tiền học phí.</span>
                                </li>
                                <li className="list-group-item bg-white px-3 py-3 border-bottom border-light mb-2 rounded shadow-sm">
                                    <small className="text-success fw-bold d-block mb-1">Hướng dẫn</small>
                                    <span className="text-dark">Sử dụng menu bên trái để chuyển nhanh giữa các phân hệ quản lý.</span>
                                </li>
                                <li className="list-group-item bg-white px-3 py-3 rounded shadow-sm">
                                    <small className="text-danger fw-bold d-block mb-1">Bảo mật</small>
                                    <span className="text-dark small">Không chia sẻ tài khoản quản trị cho những người không có nhiệm vụ.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. FOOTER */}
         
        </div>
    );
};

export default Dashboard;
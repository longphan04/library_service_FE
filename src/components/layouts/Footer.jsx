// ==========================================
// Component: Footer
// Mô tả: Footer/Chân trang cho ứng dụng Library System
// Vị trí: src/components/layouts/Footer.jsx
// ==========================================

import { Link } from 'react-router-dom';
import Logo from '../../assets/icons/logo.png';

// ==========================================
// Constants
// ==========================================

// Danh sách các liên kết nhanh
const QUICK_LINKS = [
    { label: 'Thư viện sách', path: '/categories' },
    { label: 'Sách mới', path: '/categories/newest' },
];

// Thông tin liên hệ
const CONTACT_INFO = [
    { icon: '📍', text: '212-218 Nguyễn Phước Lan, Quận Hòa Xuân, Cẩm Lệ, Đà Nẵng' },
    { icon: '📞', text: '(028) 1234 5678' },
    { icon: '✉️', text: 'contact@library.vn' },
];

// ==========================================
// Footer Component
// ==========================================
export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-footer-bg text-footer-text mt-auto">
            <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 py-5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Thương hiệu */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src={Logo}
                                alt="Library System Logo"
                                className="w-8 h-8 object-contain"
                            />
                            <span className="text-xl font-bold text-footer-heading">Library System</span>
                        </div>
                        <p className="text-footer-text-muted max-w-md">
                            Hệ thống quản lý thư viện hiện đại, giúp bạn dễ dàng tìm kiếm,
                            mượn và quản lý sách một cách tiện lợi.
                        </p>
                    </div>

                    {/* Liên kết nhanh */}
                    <div>
                        <h4 className="text-footer-heading font-semibold mb-4">Liên kết nhanh</h4>
                        <ul className="space-y-2">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="hover:text-footer-link-hover transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Liên hệ */}
                    <div>
                        <h4 className="text-footer-heading font-semibold mb-4">Liên hệ</h4>
                        <ul className="space-y-2 text-footer-text-muted">
                            {CONTACT_INFO.map((info, index) => (
                                <li key={index} className="flex items-start gap-1">
                                    <span>{info.icon}</span>
                                    <span>{info.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}

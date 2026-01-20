// ==========================================
// Component: VersionSelector
// Mô tả: Modal chọn phiên bản sách
// Vị trí: src/components/ui/VersionSelector.jsx
// ==========================================

import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

/**
 * VersionSelector Component - Popup chọn phiên bản sách
 * @param {boolean} isOpen - Trạng thái mở/đóng modal
 * @param {function} onClose - Handler đóng modal
 * @param {array} versions - Danh sách phiên bản [{id, year, available}]
 * @param {function} onConfirm - Handler xác nhận chọn phiên bản
 */
const VersionSelector = ({
    isOpen = false,
    onClose,
    versions = [],
    onConfirm,
}) => {
    // State lưu phiên bản được chọn
    const [selectedVersion, setSelectedVersion] = useState(null);

    // Handler khi chọn phiên bản
    const handleSelectVersion = (versionId) => {
        setSelectedVersion(versionId);
    };

    // Handler xác nhận
    const handleConfirm = () => {
        if (selectedVersion && onConfirm) {
            onConfirm(selectedVersion);
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
        >
            {/* Title */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-text-primary text-center">
                    Chọn phiên bản
                </h3>
            </div>

            {/* Subtitle */}
            <div className="mb-4">
                <p className="text-sm font-medium text-text-primary">
                    Các bản lưu hiện có
                </p>
            </div>

            {/* Version List */}
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {versions.map((version) => (
                    <label
                        key={version.id}
                        className={`
                            flex items-center gap-3 p-3 rounded-lg border cursor-pointer
                            transition-all duration-200
                            ${selectedVersion === version.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50 hover:bg-bg-card-hover'
                            }
                        `}
                    >
                        {/* Radio Button */}
                        <input
                            type="radio"
                            name="version"
                            value={version.id}
                            checked={selectedVersion === version.id}
                            onChange={() => handleSelectVersion(version.id)}
                            className="w-4 h-4 text-primary accent-primary cursor-pointer"
                        />

                        {/* Version Info */}
                        <div className="flex-1">
                            <span className="text-sm font-medium text-text-primary">
                                {version.year}
                            </span>
                            {!version.available && (
                                <span className="ml-2 text-xs text-error">
                                    (Hết sách)
                                </span>
                            )}
                        </div>
                    </label>
                ))}
            </div>

            {/* Confirm Button */}
            <Button
                variant="primary"
                fullWidth
                onClick={handleConfirm}
                disabled={!selectedVersion}
            >
                XÁC NHẬN
            </Button>
        </Modal>
    );
};

export default VersionSelector;

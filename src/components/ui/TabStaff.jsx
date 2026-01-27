function Tabs({ activeTab, onChange }) {
  const tabs = [
    { id: 'books', label: 'Quản lý sách' },
    { id: 'users', label: 'Quản lý người dùng' },
    { id: 'tickets', label: 'Quản lý phiếu' }
  ];

  return (
    <div className="pt-5">
      <div
        className="flex bg-white"
        style={{
          width: '1000px',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
        }}
      >
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`py-3 text-xl font-medium flex-1 cursor-pointer flex justify-center
              ${activeTab === tab.id ? 'text-white bg-primary' : 'text-gray-700 opacity-40'}
              ${index === 0 ? 'rounded-tl-[18px]' : ''}
              ${index === tabs.length - 1 ? 'rounded-tr-[18px]' : ''}
            `}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tabs;

// components/CategoryMultiSelect.tsx
'use client';

import React, { useEffect,useState } from 'react';
import Select, { MultiValue, ActionMeta } from 'react-select';
type OptionType = {
  value: number;
  label: string;
   isDisabled?: boolean;
};
type CategoryMultiSelectProps = {
  defaultCategories?: OptionType[];
   onChange?: (selected: OptionType[]) => void;
};
const baseOptions: OptionType[] = [
  { value: 313, label: 'Tất cả danh mục' },
  { value: 1, label: 'Thời trang nam' },
  { value: 23, label: 'Điện Thoại & Phụ Kiện' },
  { value: 35, label: 'Thiết Bị Điện Tử' },
  { value: 47, label: 'Máy Tính & Laptop' },
  { value: 58, label: 'Máy Ảnh & Máy Quay Phim' },
  { value: 65, label: 'Đồng Hồ' },
  { value: 72, label: 'Giày Dép Nam' },
  { value: 79, label: 'Thiết Bị Điện Gia Dụng' },
  { value: 88, label: 'Thể Thao & Du Lịch' },
  { value: 97, label: 'Ô Tô & Xe Máy & Xe Đạp' },
  { value: 111, label: 'Thời Trang Nữ' },
  { value: 133, label: 'Mẹ & Bé' },
  { value: 149, label: 'Nhà Cửa & Đời Sống' },
  { value: 165, label: 'Sắc Đẹp' },
  { value: 177, label: 'Sức Khỏe' },
  { value: 186, label: 'Giày Dép Nữ' },
  { value: 195, label: 'Túi Ví Nữ' },
  { value: 206, label: 'Phụ Kiện & Trang Sức Nữ' },
  { value: 225, label: 'Bách Hóa Online' },
  { value: 239, label: 'Nhà Sách Online' },
  { value: 249, label: 'Balo & Túi Ví Nam' },
  { value: 261, label: 'Đồ Chơi' },
  { value: 268, label: 'Chăm Sóc Thú Cưng' },
  { value: 276, label: 'Dụng cụ và thiết bị tiện ích' },
  { value: 282, label: 'Thời Trang Trẻ Em' },
  { value: 291, label: 'Giặt Giũ & Chăm Sóc Nhà Cửa' },
  { value: 301, label: 'Voucher & Dịch Vụ' },
];


const CategoryMultiSelect = ({ defaultCategories = [] ,onChange}: CategoryMultiSelectProps) => {
  const [selectedCategories, setSelectedCategories] = useState<OptionType[]>([]);
const [options, setOptions] = useState<OptionType[]>(baseOptions);
 const [hasInitializedDefault, setHasInitializedDefault] = useState(0); 
useEffect(() => {
  console.log("🟩 defaultCategories input:", defaultCategories);
  if (!hasInitializedDefault && defaultCategories && defaultCategories.length > 0) {
    const matched = baseOptions.filter((opt) =>
      defaultCategories.some((dc) => dc.value === opt.value)
    );
    
    
      setSelectedCategories(matched);
    
  }
}, [defaultCategories]); 
// useEffect(() => {
//    console.log("🟩 defaultCategories input:", defaultCategories);
//   if (
//     defaultCategories &&
//     defaultCategories.length > 0 &&
//     hasInitializedDefault < 2
//   ) {
//     const isValid = defaultCategories.every(
//       (dc) => typeof dc.value === "number" && typeof dc.label === "string"
//     );
//     if (!isValid) {
//       console.warn("❌ defaultCategories có dữ liệu không hợp lệ:", defaultCategories);
//       return;
//     }

//     setHasInitializedDefault((prev) => prev + 1);
//   }
// }, [defaultCategories]);

// useEffect(() => {
//   console.log(">>> hasInitializedDefault:", hasInitializedDefault);
//   if (hasInitializedDefault === 2 && defaultCategories && defaultCategories.length > 0) {
//     const matched = baseOptions.filter((opt) =>
//       defaultCategories.some((dc) => dc.value === opt.value)
//     );
//     console.log(">>> Setting selectedCategories to:", matched);
//     setSelectedCategories(matched);
//   }
// }, [hasInitializedDefault, defaultCategories]);


 const handleChange = (
    selected: MultiValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => {
    const isSelectingAll = selected.some((item) => item.value === 313);

    if (isSelectingAll) {
      // Nếu chọn "313" → chỉ giữ "313", disable các mục còn lại
      setSelectedCategories([{ value: 313, label: 'Tất cả danh mục' }]);

      const updatedOptions = baseOptions.map((opt) =>
        opt.value !== 313 ? { ...opt, isDisabled: true } : opt
      );
      setOptions(updatedOptions);
       if (onChange) onChange([{ value: 313, label: 'Tất cả danh mục' }]);
      console.log('Selected: [Tất cả danh mục]');
    } else {
      // Nếu không chọn "313", thì đảm bảo "313" bị remove
      const filtered = selected.filter((item) => item.value !== 313);

      // Nếu "313" từng được chọn trước đó → enable lại các mục khác
      if (
        selectedCategories.some((item) => item.value === 313) 
        
      ) {
        const updatedOptions = baseOptions.map((opt) => ({
          ...opt,
          isDisabled: false,
        }));
        setOptions(updatedOptions);
      }
      
      setSelectedCategories(filtered);
      if (onChange) onChange(filtered);
      console.log('Selected:', filtered.map((item) => item.label));
    }
  };

return (
    
         <Select
      isMulti
      options={options}
      value={selectedCategories}
      onChange={handleChange}
      placeholder="Chọn danh mục"
      className="w-full"
      classNamePrefix="select"
    />
     
  );
};

export default CategoryMultiSelect;


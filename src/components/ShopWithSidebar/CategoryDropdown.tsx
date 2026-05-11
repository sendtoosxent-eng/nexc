// CategoryDropdown.tsx
"use client";

import { useState } from "react";

interface CategoryDropdownProps {
  categories: { name: string; products: number }[];
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

const CategoryItem = ({ category }) => {
  const [selected, setSelected] = useState(false);
  return (
    <button
      className={`${selected && "text-blue"} group flex items-center justify-between ease-out duration-200 hover:text-blue `}
      onClick={() => setSelected(!selected)}
    >
      <div className="flex items-center gap-2">
        <div
          className={`cursor-pointer flex items-center justify-center rounded w-4 h-4 border ${
            selected ? "border-blue bg-blue" : "bg-white border-gray-3"
          }`}
        >
          {/* checkmark */}
        </div>
        <span>{category.name}</span>
      </div>
      <span
        className={`${selected ? "text-white bg-blue" : "bg-gray-2"} inline-flex rounded-[30px] text-custom-xs px-2 ease-out duration-200 group-hover:text-white group-hover:bg-blue`}
      >
        {category.products}
      </span>
    </button>
  );
};

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={(e) => {
          e.preventDefault();
          setToggleDropdown(!toggleDropdown);
        }}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${toggleDropdown && "shadow-filter"}`}
      >
        <p className="text-dark">Category</p>
        <button
          aria-label="button for category dropdown"
          className={`text-dark ease-out duration-200 ${toggleDropdown && "rotate-180"}`}
        >
          ▼
        </button>
      </div>

      <div className={`flex-col gap-3 py-6 pl-6 pr-5.5 ${toggleDropdown ? "flex" : "hidden"}`}>
        {categories.map((category, key) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(category.name)}
            className={selectedCategory === category.name ? "text-blue" : ""}
          >
            {category.name} ({category.products})
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryDropdown;

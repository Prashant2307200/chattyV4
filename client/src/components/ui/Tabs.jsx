import React, { memo } from "react";

export const Tabs = memo(({ children, activeTab, onChange }) => {
  return (
    <div className="tabs tabs-boxed bg-transparent p-2 gap-1 w-full">
      {children.map((child) => { 
        return React.cloneElement(child, {
          key: child.props.id,
          isActive: activeTab === child.props.id,
          onClick: () => onChange(child.props.id),
        });
      })}
    </div>
  );
});

export const Tab = memo(({ label, isActive, onClick }) => {
  return (
    <button className={`tab flex-1 text-sm sm:text-base ${isActive ? "tab-active bg-primary/10 text-primary" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
});

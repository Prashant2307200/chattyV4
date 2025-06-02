import { cloneElement } from "react";
import { List } from "./List"

export const Tabs = ({ children, activeTab, onChange }) => (
  <div className="tabs tabs-boxed bg-transparent p-2 gap-1 w-full">
    <List
      data={children}
      getKey={({ key }) => key}
      getItem={child => (
        cloneElement(child, {
          key: child.props.id,
          isActive: activeTab === child.props.id,
          onClick: () => onChange(child.props.id),
        })
      )}
    />
  </div>
);

export const Tab = ({ label, isActive, onClick }) => (
  <button className={`tab flex-1 text-sm sm:text-base ${isActive ? "tab-active bg-primary/10 text-primary" : ""}`} onClick={onClick}>
    {label}
  </button>
)
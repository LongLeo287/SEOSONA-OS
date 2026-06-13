export function ToggleSwitch({ checked, color }: { checked: boolean; color?: string }) {
  return (
    <div
      className="relative shrink-0 box-content h-[14px] w-[26px] rounded-full p-[2px] transition-colors duration-200"
      style={{ background: checked ? (color ?? "rgb(35 131 226)") : "rgba(128,128,128,0.2)" }}
    >
      <div
        className="absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform duration-200 ease-out"
        style={{ transform: checked ? "translateX(12px)" : "translateX(0px)" }}
      />
    </div>
  )
}

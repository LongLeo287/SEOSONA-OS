/**
 * Shared styles for overlay components (Select, Dropdown, Popover)
 */

// Container
export const overlayContentBase =
  "z-50 overflow-auto rounded-[10px] border border-border bg-background text-sm text-foreground shadow-lg"

export const overlayMaxHeight = "max-h-[calc(100vh-32px)]"

export const overlayAnimation =
  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"

export const overlaySlideIn =
  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"

export const overlayContent = `${overlayContentBase} ${overlayMaxHeight} ${overlayAnimation} ${overlaySlideIn}`

// Items
export const overlayItemBase =
  "flex items-center gap-1.5 min-h-[32px] py-[5px] px-1.5 mx-1 rounded-md text-sm cursor-default select-none outline-none"

export const overlayItemHover = "hover:bg-accent hover:text-foreground"

export const overlayItemFocus = "focus:bg-accent focus:text-foreground"

export const overlayItemHighlighted =
  "data-[highlighted]:bg-accent data-[highlighted]:text-foreground"

export const overlayItemDisabled =
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"

export const overlayItemTransition = "transition-colors"

export const overlayItem = `${overlayItemBase} ${overlayItemHover} ${overlayItemFocus} ${overlayItemHighlighted} ${overlayItemDisabled} ${overlayItemTransition}`

export const overlayItemWithIcon = `${overlayItem} [&_svg]:pointer-events-none [&_svg]:shrink-0`

// Checkbox/Radio indicator
export const overlayItemIndicator =
  "absolute left-2 flex h-3.5 w-3.5 items-center justify-center"

// Supporting
export const overlaySeparator = "my-1 h-px bg-border mx-1"

export const overlayLabel = "px-2.5 py-1.5 mx-1 text-xs font-medium text-muted-foreground"

export const overlayShortcut = "ml-auto text-xs tracking-widest text-muted-foreground"

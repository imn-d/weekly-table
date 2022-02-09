import React from 'react';

/**
 * Input props
 * @property parentRef - parent reference or component size
 * @property blockColors - using time block colors, see BlockColorsProps
 * @property headerHeightProp - height of columns header
 * @property helperWidthProp - width of left time column
 * @property bottomHeightProp - height of last rows
 * @property baseZIndex - base z-index
 * @property timeframe - minutes count per 1 cell
 * @property columns - days of week list
 * @property rows - time descriptions list
 * @property mouseSpeed - moving-resizing const
 * @property requiredTZOffset - used timezone
 * @property defaultValue - initial scheduler value
 * @property onChange - callback, schedules return in UTC+0
 */
export interface SchedulerInputProps {
  parentRef: React.RefObject<HTMLDivElement>;
  blockColors?: BlockColorsProps;
  headerHeightProp?: number;
  helperWidthProp?: number;
  bottomHeightProp?: number;
  baseZIndex?: number;
  timeframe?: number;
  columns?: SchedulerColumnsProps[];
  rows?: string[];
  mouseSpeed?: number;
  requiredTZOffset?: number;
  defaultValue?: ScheduleGroup[];
  onChange?: (groups: ScheduleGroup[]) => void;
}

/**
 * Internal props
 * @see SchedulerInputProps
 */
export interface SchedulerProps {
  parentRef: React.RefObject<HTMLDivElement>;
  blockColors: BlockColorsProps;
  headerHeightProp: number;
  helperWidthProp: number;
  bottomHeightProp: number;
  baseZIndex: number;
  timeframe: number;
  columns: SchedulerColumnsProps[];
  rows: string[];
  mouseSpeed: number;
  requiredTZOffset?: number;
  defaultValue?: ScheduleGroup[];
  onChange?: (groups: ScheduleGroup[]) => void;
}

/**
 * Block colors props
 * @property common - common color
 * @property temp - temp block color
 * @property draw - drawing block color
 * @property hover - hover block color
 */
export interface BlockColorsProps {
  common: string;
  temp: string;
  draw: string;
  hover: string;
}

/**
 * Days of week props
 * @property weight - column weight, calculates mask
 * @property full - full display name
 * @property short -  short display name
 */
export interface SchedulerColumnsProps {
  weight: number;
  full: string;
  short: string;
}

/**
 * Schedule props
 * @property startTime - start time in ms
 * @property endTime - end time in ms
 * @property mask - group mask
 */
export interface ScheduleGroup {
  startTime: number;
  endTime: number;
  mask: number;
}

/**
 * Cell props
 * @property position - relative coordinates x,y,w,h
 * @property row - timeframe count in day
 * @property column - day of week
 * @property isSelected - was selected or not
 */
export interface Cell {
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  row: number;
  column: number;
  isSelected: boolean;
}

/**
 * Virtual cells provider props
 * @property offsetWidth - width of parent component
 * @property offsetHeight - height of parent component
 * @property widthStep - column width
 * @property heightStep - cell height
 * @property millisPerPixel - ms count per pixel
 * @property cells - virtual cells array
 * @property setCells - virtual cells array setter
 * @property msTime - ms count in timeframe
 * @property maxCellIndex - last column cell index
 */
export interface CellsProps {
  offsetWidth: number;
  offsetHeight: number;
  widthStep: number;
  heightStep: number;
  millisPerPixel: number;
  cells: Cell[];
  setCells: (update: Cell[]) => void;
  msTime: number;
  maxCellIndex: number;
}

/**
 * Drawing provider props
 * @property canvasRef - canvas object reference
 * @property startDrawing - callback for starting draw action
 * @property finishDrawing - callback for ending draw action
 * @property draw -  callback for drawing action
 * @property isDrawing - drawing property
 */
export interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  startDrawing: ({ nativeEvent }: React.MouseEvent) => void;
  finishDrawing: ({ nativeEvent }: React.MouseEvent) => void;
  draw: ({ nativeEvent }: React.MouseEvent) => void;
  isDrawing: boolean;
}

/**
 * Pointer lock provider props
 * @property moveRef - time block move area reference
 * @property resBotRef - time block resize bottom area reference
 * @property resTopRef - time block resize top area reference
 * @property draw - callback for resizing/moving actions
 * @property isLocking - resizing/moving action property
 * @property movement - mouse relative positions
 * @property action - action type (resize_bot,resize_top,move)
 * @property startDrawing - callback for starting resizing/moving action
 * @property finishDrawing - callback for ending resizing/moving action
 */
export interface PointerLockProps {
  moveRef: React.RefObject<HTMLDivElement>;
  resBotRef: React.RefObject<HTMLDivElement>;
  resTopRef: React.RefObject<HTMLDivElement>;
  draw: ({ nativeEvent }: React.MouseEvent) => void;
  isLocking: boolean;
  movement: number;
  action: number;
  startDrawing: (action: number) => void;
  finishDrawing: () => void;
}

/**
 * Time block props
 * @property id - generated string
 * @property top - top relative position
 * @property left -  left relative position
 * @property width - time block width
 * @property height - time block height
 * @property startTime - start time in ms
 * @property endTime - end time in ms
 * @property column - day of week
 * @property realStartTime - additional prop for block actions
 * @property realEndTime - additional prop for block actions
 * @property isTemp - temporary block property
 */
export interface TimeBlock {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  startTime: number;
  endTime: number;
  column: number;
  realStartTime: number;
  realEndTime: number;
  isTemp: boolean;
}

/**
 * Time block provider props
 * @property blocks - common time blocks array
 * @property preview - temp time blocks array
 * @property setTopPosition - callback-resizer for top positions
 * @property setBotPosition - callback-resizer for bottom positions
 * @property setBlocks - time blocks setter
 * @property handleHistory - saving time block history
 * @property undoHistory - restoring time block history
 */
export interface TimeBlockProps {
  blocks: TimeBlock[];
  preview: TimeBlock[];
  setTopPosition: (block: TimeBlock, withHeight: boolean) => void;
  setBotPosition: (block: TimeBlock) => void;
  setBlocks: React.Dispatch<React.SetStateAction<TimeBlock[]>>;
  handleHistory: (input: TimeBlock[]) => void;
  undoHistory: () => void;
}

/**
 * Popup props
 * @property id - popup id
 * @property block - time block for popup
 */
export interface PopupType {
  id: string;
  block: TimeBlock;
}

/**
 * Popup provider props
 * @property popup - popup
 * @property showPopup - showing popup
 * @property deleteBlock - deleting time block
 * @property hidePopup - hiding popup
 * @property isAllowing - timeRange check
 */
export interface PopupProps {
  popup: PopupType | undefined;
  showPopup: (blockId: string) => void;
  deleteBlock: (blockId: string) => void;
  hidePopup: () => void;
  isAllowing: boolean;
}

/**
 * Position props for custom time component
 * @property top - relative top position
 * @property left - relative bottom position
 */
export interface Position {
  top: number;
  left: number;
}

/**
 * Time props for custom time component (ms)
 * @property startTime - ms start time
 * @property endTime - ms end time
 */
export interface Time {
  startTime: number;
  endTime: number;
}

/**
 * Displaying time props for custom time component (string)
 * @property startTime - start time as string
 * @property endTime - end time as string
 */
export interface DisplayTime {
  startTime: string;
  endTime: string;
}

/**
 * Custom time provider props
 * @property isEditing - active editing property
 * @property updateBlock - applying time for time block
 * @property setEditing - active editing setter
 * @property handleTime - saving new time
 * @property position - timers relative position
 * @property handleObject - time block handling to provider
 * @property resetTime - resetting time
 * @property isError - error text
 * @property displayTime - visible time
 */
export interface CustomTimeProps {
  isEditing: boolean;
  updateBlock: () => boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleTime: (newTime: number, type: boolean) => void;
  position: Position | undefined;
  handleObject: (block: TimeBlock) => void;
  resetTime: () => void;
  isError: string | undefined;
  displayTime: DisplayTime;
}

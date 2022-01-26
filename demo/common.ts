export interface ITimezone {
  offsetOptions: ITZField[];
  timezone: ITZField;
  handleTimezone: (target: ITZField | null | undefined) => void;
}

export interface ITZField {
  label: string;
  value: number;
}

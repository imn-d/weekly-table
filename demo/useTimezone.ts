import { useCallback, useMemo, useState } from 'react';

import { ITZField, ITimezone } from './common';

export const useTimezone = (): ITimezone => {
  const offsetOptions = useMemo<ITZField[]>(() => {
    const res: ITZField[] = [];
    for (let i = -12; i <= 12; i += 1) {
      res.push({
        label: `UTC${i < 0 ? '' : '+'}${i}`,
        value: i === 0 ? i * 3600 * 1000 : -i * 3600 * 1000,
      });
    }
    return res;
  }, []);

  const browserOffset = useMemo<number>(
    () => new Date().getTimezoneOffset() * 60 * 1000,
    [],
  );

  const initValue = useMemo<ITZField>(() => {
    const value = offsetOptions.find((o) => o.value === browserOffset);
    if (value) return value;
    return { label: 'UTC+0', value: 0 };
  }, [browserOffset, offsetOptions]);

  const [timezone, setTimezone] = useState<ITZField>(initValue);

  const handleTimezone = useCallback(
    (target: ITZField | null | undefined) => {
      if (target) {
        setTimezone(target);
        return;
      }
      setTimezone(initValue);
    },
    [initValue],
  );

  return {
    handleTimezone,
    offsetOptions,
    timezone,
  };
};

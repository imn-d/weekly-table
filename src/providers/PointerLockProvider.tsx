import React, {
  FC,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

import { ACTION, PointerLockProps } from '../common';

const PointerLockContext = createContext<PointerLockProps>(
  {} as PointerLockProps,
);

/**
 *  Pointer lock provider context hook
 *  @returns [PointerLockProps]{@link PointerLockProps}
 */
export const usePointerLock = (): PointerLockProps =>
  useContext(PointerLockContext);

/**
 *  This provides used pointer-lock browser api
 *  It using with all timeblock moving actions
 */
const PointerLockProvider: FC = ({ children }) => {
  const moveRef = useRef<HTMLDivElement | null>(null);
  const resTopRef = useRef<HTMLDivElement | null>(null);
  const resBotRef = useRef<HTMLDivElement | null>(null);

  /**
   * Cursor locking state
   */
  const [isLocking, setIsLocking] = useState<boolean>(false);

  /**
   * Current movement state
   */
  const [movement, setMovement] = useState<number>(0);

  /**
   * Action code
   */
  const [action, setAction] = useState<number>(ACTION.MOVE);

  /**
   * Cursor locking callback
   */
  const startDrawing = useCallback((action: number) => {
    if (!moveRef.current || !resTopRef.current || !resBotRef.current) return;
    setAction(action);
    setIsLocking(true);

    switch (action) {
      case ACTION.MOVE: {
        moveRef.current.requestPointerLock();
        break;
      }
      case ACTION.RESIZE_BOT: {
        resBotRef.current.requestPointerLock();
        break;
      }
      case ACTION.RESIZE_TOP: {
        resTopRef.current.requestPointerLock();
        break;
      }
      default:
        setIsLocking(false);
        break;
    }
  }, []);

  /**
   * Cursor unlocking callback
   */
  const finishDrawing = useCallback(() => {
    setIsLocking(false);
    document.exitPointerLock();
  }, []);

  /**
   * Save current movement
   */
  const draw = useCallback(
    ({ nativeEvent }: React.MouseEvent) => {
      if (!isLocking) {
        return;
      }
      const { movementY } = nativeEvent;
      setMovement(movementY);
    },
    [isLocking],
  );

  return (
    <PointerLockContext.Provider
      value={{
        draw,
        moveRef,
        resBotRef,
        resTopRef,
        isLocking,
        movement,
        startDrawing,
        finishDrawing,
        action,
      }}
    >
      {children}
    </PointerLockContext.Provider>
  );
};

export default PointerLockProvider;

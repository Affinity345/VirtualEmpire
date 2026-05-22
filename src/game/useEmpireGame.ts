import { useEffect, useMemo, useReducer, useRef, useState } from 'react';

import { createInitialState } from '@/game/initialState';
import { empireReducer } from '@/game/reducer';
import { getStats } from '@/game/selectors';
import {
  clearEmpireState,
  loadCloudSnapshot,
  loadEmpireState,
  saveCloudSnapshot,
  saveEmpireState,
} from '@/game/storage';

export const useEmpireGame = () => {
  const [state, dispatch] = useReducer(empireReducer, undefined, createInitialState);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);
  const stats = useMemo(() => getStats(state), [state]);

  useEffect(() => {
    let mounted = true;

    loadEmpireState().then((savedState) => {
      if (!mounted) return;
      dispatch({ type: 'hydrate', state: savedState });
      hydrated.current = true;
      setReady(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => dispatch({ type: 'marketTick' }), 2500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;

    const timeout = setTimeout(() => {
      saveEmpireState(state);
    }, 350);

    return () => clearTimeout(timeout);
  }, [state]);

  const reset = async () => {
    await clearEmpireState();
    dispatch({ type: 'reset' });
  };

  const saveCloud = async () => {
    await saveCloudSnapshot(state);
  };

  const recoverCloud = async () => {
    const cloudState = await loadCloudSnapshot();
    if (cloudState) {
      dispatch({ type: 'hydrate', state: cloudState });
    }
  };

  return {
    state,
    stats,
    ready,
    dispatch,
    reset,
    saveCloud,
    recoverCloud,
  };
};

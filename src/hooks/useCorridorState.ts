import { useSearchParams } from 'react-router-dom';

export interface CorridorState {
  x: number;
  z: number;
  instance: number;
}

export function useCorridorState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const x = parseInt(searchParams.get('x') || '0', 10);
  const z = parseInt(searchParams.get('z') || '0', 10);
  const instance = parseInt(searchParams.get('instance') || '0', 10);

  const setPosition = (newX: number, newZ: number) => {
    setSearchParams({
      x: newX.toString(),
      z: newZ.toString(),
      instance: instance.toString()
    });
  };

  const nextInstance = () => {
    setSearchParams({
      x: '0',
      z: '0',
      instance: (instance + 1).toString()
    });
  };

  const reset = () => {
    setSearchParams({});
  };

  return {
    state: { x, z, instance },
    setPosition,
    nextInstance,
    reset
  };
}

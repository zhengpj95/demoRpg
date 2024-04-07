export interface IPoolObject {
  onAlloc: () => void;
  onRelease: () => void;
}

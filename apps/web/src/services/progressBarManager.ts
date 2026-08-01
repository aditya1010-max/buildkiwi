type ProgressListener = (count: number) => void;

let activeTasks = 0;

const listeners = new Set<ProgressListener>();

function notify() {
  listeners.forEach((listener) => listener(activeTasks));
}

export function subscribe(listener: ProgressListener) {
  listeners.add(listener);

  listener(activeTasks);

  return () => {
    listeners.delete(listener);
  };
}

export function startProgress() {
  activeTasks++;
  notify();

  let finished = false;

  return () => {
    if (finished) return;

    finished = true;
    activeTasks = Math.max(0, activeTasks - 1);
    notify();
  };
}

export async function trackProgress<T>(
  promise: Promise<T>,
): Promise<T> {
  const finish = startProgress();

  try {
    return await promise;
  } finally {
    finish();
  }
}
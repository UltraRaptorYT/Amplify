export const SIMULATOR_CHANNEL = "amplify-communication-board";
export const SIMULATOR_STORAGE_KEY = "amplify-communication-event";

export type SimulatorMessage =
  | { type: "phone-ping"; id: string }
  | { type: "demo-pong"; id: string }
  | { type: "phrase-selected"; id: string; phraseIndex: number; phrase: string };

export function publishStorageFallback(message: SimulatorMessage) {
  try {
    localStorage.setItem(SIMULATOR_STORAGE_KEY, JSON.stringify(message));
  } catch {
    // BroadcastChannel remains the primary transport when storage is unavailable.
  }
}

// Re-exports from firebase.js — .ts takes precedence in TS module resolution,
// so this file must stay in sync with firebase.js.
export { auth, db, storage, default } from './firebase.js';
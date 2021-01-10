// src/access.ts
export default function access(initialState: { currentUser?: Student | Teacher | undefined }) {
  const {currentUser} = initialState || {};
  return {
    canAdmin: currentUser && currentUser.role === 0,
  };
}

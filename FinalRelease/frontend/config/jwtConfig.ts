export const jwtConfig = {
  baseURL: 'https://api.fourstring.dev', // The base url of the backend project
  globalE2EMock: true,
  // globalE2EMockClient: globalE2EMockClient,
  jwtMonitorRate: 60000, //ms
  jwtRefreshThreshold: 120, //s
}
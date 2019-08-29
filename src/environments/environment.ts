// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // apiUrl: 'http://localhost:8080/coreui-api',
  // apiUrl: 'http://192.168.150.64:8080/coreui-api',
  // apiUrl: 'http://10.70.131.217:8084/coreui-api',
  apiUrl: 'http://192.168.150.64:8080/coreui-api',
  // apiUrl: 'http://10.70.10.215:8080/coreui-api',
  // apiUrl: 'http://10.70.10.83:8080/coreui-api', // fikri
  // apiUrl: 'http://10.70.130.240:8080/coreui-api', //dana
  basicUsername: 'core_client',
  basicPassword: '@C0r3 Cl13nt',
};

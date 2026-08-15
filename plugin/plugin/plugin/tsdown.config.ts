import { clientBundle } from '../../shared/tsdown.client.ts'

export default clientBundle('dsh-clippy', [
  'src/index.ts',
], {
  libExternal: [
    '@deepseek-ai/dsh-client-runtime',
    '@deepseek-ai/dsh-host-webserver',
    '@deepseek-ai/dsh-session',
  ],
})

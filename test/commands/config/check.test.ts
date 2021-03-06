import {expect, test} from '@oclif/test'
import * as debug from 'debug'

import * as config from '../../../src/common/config'

const log = debug('developer')

const emptyConfig = '# no actual yaml here'
const loggingServerConfig = `
strategy:
  type: logging
  commandToRun: sbt test
api:
  id: team/id
  version: 9.9.9
  paths:
    - /users
`
const proxyServerConfig = `
strategy:
  type: proxy
  commandToRun: "npm test"
  targetHost: localhost
  targetPort: 9000
api:
  id: some-api-id
  version: 0.1.0
  paths:
    - /users
`

const configWithBasicSecurity = `
${proxyServerConfig}
  security:
    - type: basic
`
const configWithBearerSecurity = `
${loggingServerConfig}
  security:
    - type: bearer
`
const configWithApiKeyHeaderSecurity = `
${proxyServerConfig}
  security:
    - type: apiKey
      in: header
      name: api-key
`
const configWithApiKeyCookieSecurity = `
${loggingServerConfig}
  security:
    - type: apiKey
      in: cookie
      name: api-key
`
const configWithApiKeyQuerySecurity = `
${proxyServerConfig}
  security:
    - type: apiKey
      in: query
      name: api-key
`

describe('config:check', () => {
  test
    .stub(config, 'readOpticYaml', () => emptyConfig)
    .command(['config:check'])
    .catch(err => expect(err.message).to.be.ok)
    .it('rejects empty config')

  test
    .stub(config, 'readOpticYaml', () => `${loggingServerConfig}
optic:
  version: v9000
`)
    .stdout()
    .command(['config:check'])
    .it('accepts logging server config', ctx => {
      log(ctx.stdout)
      expect(ctx.stdout).to.match(/ok/)
    })

  test
    .stub(config, 'readOpticYaml', () => proxyServerConfig)
    .stdout()
    .command(['config:check'])
    .it('accepts proxy server config', ctx => {
      log(ctx.stdout)
      expect(ctx.stdout).to.match(/ok/)
    })

  test
    .stub(config, 'readOpticYaml', () => configWithBasicSecurity)
    .stdout()
    .command(['config:check'])
    .it('accepts config with basic auth', ctx => {
      log(ctx.stdout)
      expect(ctx.stdout).to.match(/ok/)
    })

  test
    .stub(config, 'readOpticYaml', () => configWithBearerSecurity)
    .stdout()
    .command(['config:check'])
    .it('accepts config with bearer auth', ctx => {
      log(ctx.stdout)
      expect(ctx.stdout).to.match(/ok/)
    })

  test
    .stub(config, 'readOpticYaml', () => configWithApiKeyHeaderSecurity)
    .stdout()
    .command(['config:check'])
    .it('accepts config with header api key auth', ctx => {
      log(ctx.stdout)
      expect(ctx.stdout).to.match(/ok/)
    })

  test
    .stub(config, 'readOpticYaml', () => configWithApiKeyCookieSecurity)
    .stdout()
    .command(['config:check'])
    .it('accepts config with cookie api key auth', ctx => {
      log(ctx.stdout)
      expect(ctx.stdout).to.match(/ok/)
    })

  test
    .stub(config, 'readOpticYaml', () => configWithApiKeyQuerySecurity)
    .stdout()
    .command(['config:check'])
    .it('accepts config with query api key auth', ctx => {
      log(ctx.stdout)
      expect(ctx.stdout).to.match(/ok/)
    })
})

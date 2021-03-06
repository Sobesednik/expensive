#!/usr/bin/env node
import { debuglog, inspect } from 'util'
import NameCheap from '@rqt/namecheap'
import NameCheapWeb from '@rqt/namecheap-web'
import getUsage from './get-usage'
import List from './commands/list'
import Check from './commands/check'
import Register from './commands/reg'
import GitHub from './commands/github'
import getConfig from '../lib/get-config'
import whitelistIP from '../lib/whitelist-ip'
import Errors from './errors'
import { _help, _version, _domains, _whitelistIP, _sandbox as __sandbox, _init,
  _info, _register, _promo, _coupon,
  _whois, _Whois, _free, _zones, _github, _years,
  _sort, _desc, _filter, _type, _pageSize,
  _record, _CNAME, _TXT, _A,
} from './get-args'
import whois from './commands/whois'
import initConfig from './commands/init'
import Info from './commands/info'
import coupon from './commands/coupon'
import DNS from './commands/dns'

const version = require('../../package.json')['version']

const _sandbox = __sandbox || !!process.env.SANDBOX

const LOG = debuglog('expensive')
const DEBUG = /expensive/.test(process.env.NODE_DEBUG)

if (_version) {
  console.log(version)
  process.exit()
} else if (_help) {
  const u = getUsage()
  console.log(u)
  process.exit()
}

/**
 * @param {!_expensive.Settings} settings
 * @param {boolean} [sandbox]
 */
const run = async (settings, sandbox = false) => {
  try {
    if (_whitelistIP) return await whitelistIP(settings, sandbox)

    const ip = settings.ClientIp || await NameCheapWeb['LOOKUP_IP']()
    const nc = new NameCheap({
      user: settings.ApiUser,
      key: settings.ApiKey,
      ip,
      sandbox,
    })

    if (!_domains) return await List(nc, {
      sort: _sort,
      desc: _desc,
      filter: _filter,
      type: _type,
      pageSize: _pageSize,
    })

    const [domain] = _domains
    if (_record || _CNAME || _TXT || _A)
      return await DNS(nc, domain)
    if (_github) return await GitHub(nc, domain)
    if (_info) return await Info(nc, domain)
    if (_register) return await Register(nc, {
      domain,
      promo: _promo,
      sandbox,
      years: _years,
    })

    await Check(nc, {
      domains: _domains,
      zones: _zones,
      free: _free,
    })
  } catch (error) {
    await handler(error, settings, sandbox)
  }
}

const handler = async ({ stack, message, props }, Settings, sandbox) => {
  if (props) {
    LOG(inspect(props, { colors: true }))
    LOG(Errors[props.Number])
  }
  if (props && props.Number == 1011150) {
    try {
      const [, ip] = /Invalid request IP: (.+)/.exec(message) || []
      await whitelistIP(Settings, sandbox, ip)
    } catch ({ message: msg, stack: st }) {
      console.log('Could not white-list IP.')
      DEBUG ? LOG(st) : console.error(msg)
      process.exit(1)
    }
    return run(Settings, sandbox)
  }

  DEBUG ? LOG(stack) : console.error(message)
  process.exit(1)
}

(async () => {
  try {
    if (_coupon) return await coupon(_sandbox)
    if (_whois || _Whois) return await whois(_domains, _Whois)
    if (_init) return await initConfig(_sandbox)
  } catch (err) {
    const { stack, message } = err
    DEBUG ? LOG(stack) : console.error(message)
    return
  }
  const settings = await getConfig(_sandbox)
  await run(settings, _sandbox)
})()

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').Settings} _expensive.Settings
 */
import loading from 'indicatrix'
import { confirm } from 'reloquent'
import { c } from 'erte'

/**
 * @param {!_namecheap.NameCheap} client
 * @param {string} domain
 */
export default async function (client, domain) {
  let { hosts, IsUsingOurDNS } = await client.dns.getHosts(domain)
  if (!IsUsingOurDNS)
    throw new Error(`Namecheap DNS is not being used for ${domain}`)

  hosts.reduce(async (ac, { Type, Name, Address }) => {
    await ac
    if (Type == 'A' && Name == '@') {
      const a = await confirm(
        `An A record at @ (${Address}) already exists. Continue?`)
      if (!a) process.exit()
    }
  }, {})

  hosts = hosts.filter(({ Type, Name, Address }) => {
    if (Name == 'www' && Type == 'CNAME' && Address == 'parkingpage.namecheap.com.') return false
    if (Name == '@' && Type == 'URL') return false
    return true
  })
  /** @type {!Array<!_namecheap.HostParams>} */
  const newhosts = hosts.map((h) => {
    const { TTL, Type: RecordType, Address, Name: HostName, MXPref } = h
    return { TTL, RecordType, Address, HostName, MXPref }
  })
  newhosts.push({
    Address: '185.199.108.153',
    RecordType: 'A',
    HostName: '@',
  },{
    Address: '185.199.109.153',
    RecordType: 'A',
    HostName: '@',
  },  {
    Address: '185.199.110.153',
    RecordType: 'A',
    HostName: '@',
  }, {
    Address: '185.199.111.153',
    RecordType: 'A',
    HostName: '@',
  })

  const r = await loading(`Setting ${c(`${newhosts.length}`, 'yellow')} host records`, async () => {
    const res = await client.dns.setHosts(domain, newhosts)
    return res
  })
  if (!r.IsSuccess)
    throw new Error('Operation wasn\'t successful.')
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@rqt/namecheap')} _namecheap.NameCheap
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@rqt/namecheap/types/typedefs/dns').HostParams} _namecheap.HostParams
 */

import tablature from 'tablature'
import { mapDomains, getWhois as WhoisGuard } from '../'

export default function printList(domains = []) {
  if (!domains.length) {
    console.log('No domains')
    return
  }
  // adds the [Since, Expiry, Years, DNS] properties
  const data = mapDomains(domains)
  const s = tablature({
    keys: ['Name', 'Expiry', 'Years', 'WhoisGuard', 'DNS'],
    data,
    headings: {
      WhoisGuard: 'Whois',
    },
    replacements: {
      WhoisGuard,
      'DNS'(val) {
        if (val) return { value: 'yes', length: 3 }
        return { value: '', length: 0 }
      },
      'Years'(value) {
        if (value) return { value, length: `${value}`.length }
        return { value: '', length: 0 }
      },
    },
    centerValues: ['WhoisGuard'],
  })
  console.log(s)
}


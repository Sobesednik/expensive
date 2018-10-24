// check: single (free)
expensive-test-random123.org

/* expected */
Checking domain expensive-test-random123.org
Domain                        Available
expensive-test-random123.org     yes
/**/

// check: single (taken)
expensive-test-info.bz

/* expected */
Checking domain expensive-test-info.bz
Domain                  Available
expensive-test-info.bz     no
/**/

// check: zones
expensive-test-info -z bz,org

/* expected */
Checking domains expensive-test-info.org, expensive-test-info.bz
Domain                   Available
expensive-test-info.org     yes
expensive-test-info.bz      no
/**/

// check: free
expensive-test-info -z bz,org -f

/* expected */
Checking domains expensive-test-info.org, expensive-test-info.bz
Domain                   Available
expensive-test-info.org     yes
/**/

// check: multiple
test

/* expected */
Checking domains test.com, test.net, test.org, test.biz, test.co, test.cc, test.io, test.bz, test.nu, test.app, test.page
Domain     Available  Premium  Price
test.com      no
test.net      no
test.org      no
test.biz      no
test.co       no
test.cc       no
test.io       no
test.bz       no
test.nu       no
test.app      yes
test.page     yes        ✓     140.40
/**/

// --info
expensive-test-info.bz --info

/* expected */
Created:        10/06/2018
Expires on:     10/07/2019
Whois enabled:  True
Whois email:    zoidberg@futurama.bz
DNS:            FREE
Nameservers:    dns1.registrar-servers.com, dns2.registrar-servers.com
Created:        10/06/2018
/**/

// -i
expensive-test-info.bz -i

/* expected */
Created:        10/06/2018
Expires on:     10/07/2019
Whois enabled:  True
Whois email:    zoidberg@futurama.bz
DNS:            FREE
Nameservers:    dns1.registrar-servers.com, dns2.registrar-servers.com
Created:        10/06/2018
/**/
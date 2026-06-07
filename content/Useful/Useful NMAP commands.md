* arp works on the same network. it returns the mac address of the systems.

* icmp works across networks. doest return ip

* **ARP = Who has this IP? Tell me your MAC.**

* **ICMP = Are you alive? And if not, why?**

* privileged users can run nmap on hosts outside the subnets with icmp echo pings and stealth scans, because only sudoers have perms to create and craft sockets and packets

* underprivileged users can run nmap on outside networks but it requires a full tcp handshake

* icmp requests are blocked by default.

* arp > icmp, even if run as sudo because arp returns mac address (if on same subnet) and icmp doesnt.

````bash
nmap -sn TARGET
# will find online hosts without port scanning the live systems
````

````bash
nmap -PR TARGET/24
# will only arp scan the current subnet
````

````bash
sudo nmap -PE TARGET/24
# icmp echo pings the whole subnet
````

````bash
sudo nmap -PP TARGET/24
# icmp timestamp scan
````

````bash
sudo nmap -PM TARGET/24
# icmp address mask query
````

Sudoers don't need to complete the tcp handshake.

````bash
nmap -PS TARGET/24
# will send tcp syn pings to the whole subnet
# if run with sudo the handshake wont be completed i.e. fast
````

````bash
nmap -PA80,20
# will send tcp ack pings to the ports
# same as above
# will get back a RST response
````

````bash
nmap -PU TARGET/24
# will send a udp packet
# if no response then host is up
# if ICMP responds, then host is down/unreachable
````

disable reverse dns lookup with the `-n` flag
reverse dns scan offline hosts with `-R` flag

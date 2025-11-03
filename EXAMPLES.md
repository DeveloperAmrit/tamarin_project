# Example Attack Scenarios

This file contains example scenarios you can use to test the Attack Depth Simulator.

## Scenario 1: Simple Web Application Attack

### Nodes
1. **web-server-1**
   - Role: webserver
   - Services: http, ssh
   - Credentials stored: db-password

2. **database-1**
   - Role: database
   - Services: mysql
   - Credentials stored: backup-key

3. **backup-server**
   - Role: backup
   - Services: ftp, ssh
   - Credentials stored: (none)

### Edges
- web-server-1 → database-1 (bidirectional)
- database-1 → backup-server (bidirectional)

### Credentials
1. **leaked-password**
   - Privilege: user
   - Valid on: web-server-1

2. **db-password**
   - Privilege: admin
   - Valid on: database-1

3. **backup-key**
   - Privilege: root
   - Valid on: backup-server

### Simulation
- Hacker starts with: leaked-password
- Expected result: All 3 nodes compromised, depth of 2

---

## Scenario 2: Corporate Network Breach

### Nodes
1. **dmz-web**
   - Role: webserver
   - Services: http, https
   - Credentials stored: internal-vpn

2. **internal-app**
   - Role: application-server
   - Services: ssh, rdp
   - Credentials stored: db-admin

3. **database**
   - Role: database
   - Services: postgresql
   - Credentials stored: admin-workstation-key

4. **admin-workstation**
   - Role: workstation
   - Services: rdp, ssh
   - Credentials stored: domain-admin

5. **file-server**
   - Role: file-server
   - Services: smb, nfs
   - Credentials stored: (none)

### Edges
- dmz-web → internal-app
- internal-app → database
- internal-app → file-server
- database → admin-workstation
- admin-workstation → file-server

### Credentials
1. **phishing-creds**
   - Privilege: user
   - Valid on: dmz-web

2. **internal-vpn**
   - Privilege: user
   - Valid on: internal-app

3. **db-admin**
   - Privilege: admin
   - Valid on: database

4. **admin-workstation-key**
   - Privilege: user
   - Valid on: admin-workstation

5. **domain-admin**
   - Privilege: root
   - Valid on: admin-workstation, file-server, database

### Simulation
- Hacker starts with: phishing-creds
- Expected result: Full network compromise, depth of 3-4

---

## Scenario 3: Isolated Segments (Defense in Depth)

### Nodes
1. **public-web**
   - Role: webserver
   - Services: http
   - Credentials stored: (none)

2. **app-server**
   - Role: application
   - Services: ssh
   - Credentials stored: app-db-creds

3. **app-database**
   - Role: database
   - Services: mysql
   - Credentials stored: (none)

4. **admin-server** (isolated)
   - Role: management
   - Services: ssh, rdp
   - Credentials stored: root-all

5. **critical-db** (isolated)
   - Role: database
   - Services: postgresql
   - Credentials stored: (none)

### Edges
- public-web → app-server
- app-server → app-database
- (No edges to admin-server or critical-db from compromised network)

### Credentials
1. **web-exploit**
   - Privilege: user
   - Valid on: public-web

2. **app-db-creds**
   - Privilege: admin
   - Valid on: app-database

3. **root-all**
   - Privilege: root
   - Valid on: admin-server, critical-db

### Simulation
- Hacker starts with: web-exploit
- Expected result: Only 3 nodes compromised (public-web, app-server, app-database)
- Demonstrates network segmentation effectiveness

---

## Testing Tips

1. Start with Scenario 1 to understand basic mechanics
2. Use Scenario 2 to see complex attack paths
3. Use Scenario 3 to demonstrate security boundaries
4. Create your own scenarios to test specific security configurations
5. Experiment with different starting credentials
6. Try removing edges to see how segmentation affects attack depth

## Quick Setup via API

You can use the FastAPI docs (http://localhost:8000/docs) to quickly set up these scenarios using the interactive API interface.

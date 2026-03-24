---
layout: post
title: "Crustacean Migration: Moving OpenClaw from Desktop to Home Lab"
description: ""
categories: post
author: imccall
tags: [AI, OpenClaw, VM, TrueNAS]
---
 
 ## Introduction: Why Move OpenClaw to a Home Lab?
 
 As a personal assistant, my OpenClaw instance is a part of my daily workflow. Initially, it ran on my desktop PC, which was convenient for initial setup and testing. However, I quickly realized a limitation: my desktop doesn't run 24/7. To save power, I typically shut it down at night, which meant my OpenClaw assistant went offline with it.
 
 My home server, which runs TrueNAS Scale, on the other hand, runs continuously. This makes it the ideal candidate for hosting services that I need available around the clock, like OpenClaw. The goal was simple: move OpenClaw from my desktop to my home server to ensure uninterrupted access and reliability.
 
 ## My OpenClaw Setup
 
 Before diving into the migration, a quick overview of my OpenClaw setup. I primarily use it as a personal assistant. Its primary interface for me is Slack, allowing seamless interaction from any device where I have Slack installed.
 
 ## Options for Running OpenClaw on TrueNAS Scale
 
 When considering how to host OpenClaw on TrueNAS Scale, two main options came to mind:
 
 1.  **App/Docker Container:** TrueNAS Scale has excellent support for Docker containers via its "Apps" feature.
     *   **Pros:** Lightweight, easy to deploy and manage, leverages existing container infrastructure.
     *   **Cons:** Might be more complex for custom networking or specific OpenClaw dependencies that aren't easily contained. Configuration management within a container might also require more thought.
 
 2.  **Virtual Machine (VM):** Running a full-fledged operating system in a VM.
     *   **Pros:** Provides a completely isolated environment, familiar setup process (like installing on a regular server), full control over the OS and network stack.
     *   **Cons:** More resource-intensive than a container, requires managing a separate OS.
 
 I opted for the **Virtual Machine** approach. While slightly heavier on resources, it offered the greatest flexibility and control, which I felt was important for a complex application like OpenClaw that interacts with many parts of my digital life.
 
 ## Setting Up the Virtual Machine
 
 The first step was to prepare the virtual machine on my TrueNAS Scale host. TrueNAS makes this easy to do from the admin UI. 
 
 0.  **Create the VM:** When setting up the network I attached it to the same interface the NAS uses for communication on my home network. This allows the VM to get it's own IP on the network so I can ssh into it from my desktop. One side effect of this however is that it can't route to the TrueNAS host without a separate bridge interface.
 
 1.  **Install OS (Debian):** I created a new VM and installed a minimal Debian instance. Debian is a stable and lightweight choice, and I already had an ISO downloaded.
 
 2.  **Setting Up a Network Bridge:** To allow the VM to communicate directly with services on the host, I configured a network bridge on the TrueNAS host.
     * In the network configuration I created a new interface with the type "Bridge" and named it `br0`
     * Importantly, I didn't add any other network interfaces as bridge members. Because I want this to just be for communication between the VM and the host
     * Under aliases, I added the IP address `10.0.0.1/24`. This sets the IP of the host and the subnet mask for the network.
 
 3.  **Adding the Bridge to the VM:** From the host I added a new NIC device to the VM, configured to attach to `br0`.
 
 4.  **Network Configuration:** Inside the VM, I reconfigured the networking so that the interface attached to the bridge used a static IP (`10.0.0.2`), and the interface attached to my home network used DHCP.
 
 5.  **Install Dependencies:** Once the network was solid, I installed all the necessary dependencies for OpenClaw (Node.js, Python, git, etc.) within the Debian VM.
 
 6.  **Install OpenClaw:** Finally, I installed OpenClaw with `npm i -g openclaw`.

 ## Moving the Configuration
 
 With the new OpenClaw instance installed and the network ready, it was time to migrate my existing configuration and memory.
 
 1.  **Copy Config Folder to NAS:** I copied the entire `.openclaw` folder from the old desktop instance to a shared folder on my NAS. That folder is shared using both SMB (Windows file sharing) and NFS.

 2.  **NFS Mount:** On the Debian VM, I set up the NFS mount to access the shared folder on the NAS (using the bridge ip).

 3.  **Copy Config Folder to VM:** I then copied the `.openclaw` folder from the NAS to my home directory on the VM.
 
 4.  **Fixing Paths:** The `openclaw.json` config file had some hardcoded paths. I updated these to reflect the new directory structure on the Debian VM.
 
 5.  **Setting Up Allowed Origins:** For the web UI and API to function correctly, I updated the `gateway.controlUi.allowedOrigins` setting in OpenClaw's configuration to include the new Nginx reverse proxy URL (e.g., `https://claw.truenas.local:30022`).

 6.  **Call the Doctor:** I then used `openclaw doctor --fix` to try to catch and fix any configuration issues I might have missed.

 ## Nginx Reverse Proxy to Expose Web UI
 
 OpenClaw's web UI requires that you connect to it either using localhost or a secure (https) context.
 
 1.  **Nginx Proxy Manager App:** I leveraged the Nginx Proxy Manager app available on TrueNAS Scale. This makes managing reverse proxies and SSL certificates incredibly easy.
 
 2.  **Self-Signed Certificate:** Because I'm only using the web UI on my home network I opted for a self-signed certificate over using LetsEncrypt. I generated a self-signed SSL certificate on my desktop and uploaded it to the Nginx Proxy Manager.

 3.  **Setup the Proxy Host:** In the Nginx Proxy Manager I setup a proxy host. I chose the domain name `claw.truenas.local` and configured it to forward to the OpenClaw web UI on the VM over the bridge (`10.0.0.2:18798`)
 
 4.  **Hosts File Entry:** To make `claw.truenas.local` resolve correctly, I added an entry to my local machine's `hosts` file, mapping the domain to the TrueNAS host's IP address.

 ## Starting the Gateway and Verification
 
 The moment of truth!
 
 1.  **Starting the Gateway:** I started the OpenClaw gateway service on the Debian VM.
 
 2.  **Checking That Everything Works:**
     *   I accessed the OpenClaw web UI via my Nginx proxy URL to confirm it was loading correctly.
     *   Most importantly, I tested my Slack integration. Sending a message to OpenClaw via Slack and receiving a proper response confirmed the migration was successful!
     *   I also checked the logs for any errors or warnings to ensure a smooth operation.
 
 ## Conclusion
 
 Migrating my OpenClaw instance to my TrueNAS Scale home server has been a significant upgrade. My personal assistant is now available 24/7, providing consistent support without relying on my desktop being powered on. While the VM approach required a bit more setup initially, the flexibility and reliability it offers are well worth the effort. Now, OpenClaw is truly a persistent companion in my home lab ecosystem.
 

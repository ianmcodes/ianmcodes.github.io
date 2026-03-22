---
layout: post
title: "Crustacean Migration: Moving open claw from desktop to home lab"
description: ""
categories: 
author: imccall
tags: 
---
 
 ## Introduction: Why Move OpenClaw to a Home Lab?
 
 As a personal assistant, my OpenClaw instance is a crucial part of my daily workflow, handling everything from quick queries to complex automations. Initially, it ran on my desktop PC, which was convenient for initial setup and testing. However, I quickly realized a limitation: my desktop doesn't run 24/7. To save power, I typically shut it down at night, which meant my OpenClaw assistant went offline with it.
 
 My home server, a TrueNAS Scale instance, on the other hand, runs continuously. This makes it the ideal candidate for hosting services like OpenClaw that I need available around the clock. The goal was simple: move OpenClaw from my desktop to my home server to ensure uninterrupted access and reliability.
 
 ## My OpenClaw Setup
 
 Before diving into the migration, a quick overview of my OpenClaw setup. I primarily use it as a personal assistant, deeply integrated into my daily tasks. Its primary interface for me is Slack, allowing seamless interaction from any device where I have Slack installed.
 
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
 
 The first step was to prepare the virtual machine on my TrueNAS Scale host.
 
 1.  **Install OS (Debian):** I created a new VM and installed a minimal Debian instance. Debian is a stable and lightweight choice, perfect for a server environment.
 
 2.  **Setting Up a Bridge:** To allow the VM to have its own IP address on my network, I configured a network bridge on the TrueNAS host. This essentially acts as a virtual switch, connecting the VM's virtual network interface directly to my physical network.
 
 3.  **Creating Device on TrueNAS Host & Adding NIC to VM:** I then created a virtual network device on the TrueNAS host, associated it with the newly created bridge, and added this virtual Network Interface Card (NIC) to my Debian VM.
 
 4.  **Network Configuration:**
     *   **IP Address:** I configured the VM with a static IP address in my `10.0.0.x` subnet.
     *   **Static Route for Bridge:** On my router, I ensured there was a static route configured for the bridge network, if necessary, to ensure proper routing of traffic to and from the VM.
     *   **DHCP on VirtIO:** Within the Debian VM, I set up the network interface (using `virtio` drivers for better performance) to use DHCP. Although I assigned a static IP, starting with DHCP ensures the interface comes up correctly before applying static configurations.
 
 5.  **Install Dependencies:** Once the network was solid, I installed all the necessary dependencies for OpenClaw (Node.js, Python, git, etc.) within the Debian VM.
 
 6.  **Install OpenClaw:** Finally, I cloned the OpenClaw repository and performed the installation steps as outlined in the OpenClaw documentation.
 
 ## Nginx Reverse Proxy to Expose Web UI
 
 OpenClaw's web UI is fantastic, but I wanted to access it securely and easily from my main domain. This is where Nginx came in.
 
 1.  **Nginx Proxy Manager App:** I leveraged the Nginx Proxy Manager app available on TrueNAS Scale. This makes managing reverse proxies and SSL certificates incredibly easy.
 
 2.  **Self-Signed Certificate:** For internal network access, I generated a self-signed SSL certificate through Nginx Proxy Manager. This encrypts traffic between my browser and the OpenClaw UI.
 
 3.  **Hosts File Entry:** To make `openclaw.mydomain.com` (or whatever internal FQDN I chose) resolve correctly, I added an entry to my local machine's `hosts` file, mapping the chosen domain to the TrueNAS Scale host's IP address (or the VM's IP directly if using split-horizon DNS).
 
 ## Moving the Configuration
 
 With the new OpenClaw instance installed and the network ready, it was time to migrate my existing configuration and memory.
 
 1.  **NFS Mount:** On the Debian VM, I set up an NFS mount to access my existing OpenClaw configuration directory from my desktop (or a shared network location).
 
 2.  **Copy Config Folder:** I carefully copied the entire OpenClaw configuration folder, including `MEMORY.md`, `USER.md`, `SOUL.md`, `TOOLS.md`, and any `memory/*.md` files, from the old desktop instance to the new VM instance.
 
 3.  **Fixing Paths:** It was crucial to review `config.yaml` and any other configuration files for hardcoded paths. I updated these to reflect the new directory structure on the Debian VM.
 
 4.  **Setting Up Allowed Origins:** For the web UI and API to function correctly, I updated the `allowedOrigins` setting in OpenClaw's configuration to include the new Nginx reverse proxy URL (e.g., `https://openclaw.mydomain.com`).
 
 ## Starting the Gateway and Verification
 
 The moment of truth!
 
 1.  **Starting the Gateway:** I started the OpenClaw gateway service on the Debian VM.
 
 2.  **Checking That Everything Works:**
     *   I accessed the OpenClaw web UI via my Nginx proxy URL to confirm it was loading correctly.
     *   Most importantly, I tested my Slack integration. Sending a message to OpenClaw via Slack and receiving a proper response confirmed the migration was successful!
     *   I also checked the logs for any errors or warnings to ensure a smooth operation.
 
 ## Conclusion
 
 Migrating my OpenClaw instance to my TrueNAS Scale home server has been a significant upgrade. My personal assistant is now available 24/7, providing consistent support without relying on my desktop being powered on. While the VM approach required a bit more setup initially, the flexibility and reliability it offers are well worth the effort. Now, OpenClaw is truly a persistent companion in my home lab ecosystem.
 

# Telegram OIDC Login Demo

[![GitHub](https://img.shields.io/badge/GitHub-svintsow-blue?logo=github)](https://github.com/svintsow)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple?logo=vite)](https://vitejs.dev/)

A minimal, production-ready demonstration of Telegram's OpenID Connect (OIDC) authentication flow using TypeScript and Vite. This project shows how to integrate "Login with Telegram" into any web application.

## ✨ Features

- 🔐 Full OIDC Authorization Code Flow with PKCE
- 📱 Ready for Telegram Login integration
- 🎨 Clean, responsive UI with dark mode support
- 💪 Fully typed with TypeScript
- ⚡ Lightning fast with Vite
- 🔄 Complete auth lifecycle: login → callback → profile → logout
- 📦 Zero external UI dependencies

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup Guide](#detailed-setup-guide)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Node.js](#2-install-nodejs)
  - [3. Create a Telegram Bot](#3-create-a-telegram-bot)
  - [4. Configure Environment Variables](#4-configure-environment-variables)
  - [5. Install Dependencies](#5-install-dependencies)
  - [6. Run the Development Server](#6-run-the-development-server)
  - [7. Test the Authentication](#7-test-the-authentication)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Security Notes](#security-notes)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

## Prerequisites

- **Node.js** 18+ and npm
- A **Telegram account**
- Basic familiarity with terminal/command line

## Quick Start

For experienced developers who just want to run it:

```bash
git clone https://github.com/svintsow/telegram-oidc-login-demo.git
cd telegram-oidc-login-demo
cp .env.example .env
# Edit .env with your Telegram Bot credentials
npm install
npm run dev

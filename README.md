# Web3 Referral Platform

## Description
A referral platform built on the Solana blockchain, allowing users to create and manage referral programs, track performance, and integrate with Solana wallets.

## Features
- Create and manage referral programs
- Track referral link clicks and conversions
- View analytics for referral performance
- Connect Solana wallets (Phantom, Solflare)
- User registration for referrers

## Tech Stack
- Next.js (v15)
- React (v19)
- TypeScript
- Solana (using `@solana/web3.js`, `@project-serum/anchor`)
- WalletAdapter (`@solana/wallet-adapter-react`)
- Zustand (state management)
- Tailwind CSS (styling)
- Shadcn/UI (UI components)
- Recharts (analytics charts)

## Getting Started

### Prerequisites
- Node.js (latest LTS recommended)
- npm/yarn/pnpm/bun

### Installation
1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd web3-referral-platform`
3. Install dependencies: `npm install` (or `yarn install`, `pnpm install`, `bun install`)

### Running the development server
`npm run dev` (or `yarn dev`, `pnpm dev`, `bun dev`)

### Accessing the application
Open `http://localhost:3000` in your browser.

## Configuration
- The Solana network is set to Devnet by default in `config/walletConfig.tsx`.
- The Solana Program ID is hardcoded as `Hko13xpywriTmjsjPzaurFUm5vExQdWRM916V36iDNeo` in `utils/program.ts`. If you deploy your own version of the Solana program, you will need to update this ID.

## Project Structure
- `app/`: Next.js app router, pages, and layouts.
- `components/`: Reusable React components.
    - `analytics/`: Components for the analytics dashboard.
    - `referral/`: Components related to referral creation and handling.
- `config/`: Configuration files (e.g., wallet settings).
- `hooks/`: Custom React hooks.
- `public/`: Static assets (images, IDL file).
- `store/`: Zustand store definitions for state management.
- `utils/`: Utility functions, including Solana program interaction.

## Deployment
The easiest way to deploy is using Vercel (as recommended by Next.js). Refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Roadmap

*   **Current Stage:**
    *   The project is currently in an MVP (Minimum Viable Product) / Beta stage. Core referral functionalities like program creation, link generation, basic tracking, and a simple analytics view are implemented.
*   **Planned Features (Short-term):**
    *   **Enhanced Analytics:**
        *   More detailed reports for referrers (e.g., conversion rates per code/link).
        *   Platform-wide analytics for program creators.
        *   Date range filtering for analytics.
    *   **Reward System Improvements:**
        *   Support for different types of on-chain rewards (e.g., SPL tokens, NFTs in addition to SOL).
        *   Automated reward distribution options.
    *   **User Experience:**
        *   Leaderboard for top referrers.
        *   Notifications for successful referrals.
        *   Improved UI/UX for managing referral programs.
    *   **Customization:**
        *   Allow program creators to customize referral code formats.
        *   More options for defining referral conditions and rewards.
*   **Future Ideas (Long-term):**
    *   **Multi-chain Support:** Explore extending the platform to other blockchains.
    *   **Advanced Fraud Detection:** Implement mechanisms to detect and prevent referral fraud.
    *   **Integration with other DeFi/Web3 Protocols:** Allow referrals for specific actions within other dApps.
    *   **Gamification:** Introduce points, badges, or tiers to incentivize referrers further.
    *   **Decentralized Governance (DAO):** Potentially move towards a DAO model for platform governance and treasury management.
    *   **Social Sharing Features:** Easier sharing of referral links on social media.

## Contributing

We welcome contributions to the Web3 Referral Platform! Here are some ways you can help:

*   **Reporting Bugs:** If you find a bug, please open an issue on GitHub with detailed steps to reproduce it.
*   **Suggesting Enhancements:** Have an idea for a new feature or an improvement to an existing one? Open an issue to discuss it.
*   **Code Contributions:**
    *   Fork the repository.
    *   Create a new branch for your feature or bug fix.
    *   Make your changes, adhering to the project's coding style and conventions.
    *   Write tests for your changes if applicable.
    *   Submit a pull request with a clear description of your changes.
*   **Documentation:** Help improve the documentation (README, code comments, etc.).

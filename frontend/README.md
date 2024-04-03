

# YachtSquad Frontend

This is the frontend for the YachtSquad platform, a decentralized application (dApp) for yacht tokenization and trading. Built with Next.js, this interface interacts with Ethereum smart contracts to enable users to view, list, and trade yacht tokens in a secure and user-friendly environment.
Features

You can access on the web app deployed on vercel : [`Vercel`](https://yachtsquad.vercel.app/)

* Marketplace: Browse and purchase yacht tokens.
* Wallet Integration: Connect with various wallets using RainbowKit and Wagmi.
* Responsive Design: Optimized for a wide range of devices.
* Real-time Data: Fetches data from Ethereum blockchain.


## Installation

1. Clone the repository:

```bash
git clone https://github.com/Cerlo/Yacht-Squad-Solidity
cd frontend
```


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.



## Front-end Functionality

- [x] List Of minted Yacht
- [X] Wallet connection
  - [X] connection
  - [X] Detect user status (owner|investor)
- [X] Admin section
  - [X] Mint Yacht
  - [X] Change Yacht Status
- [ ] Investor section
  - [X] Purchase Minted Yacht
  - [ ] Acquire Yacht shares from Another Investor
  - [ ] Sell shares
  - [X] View owned yacht
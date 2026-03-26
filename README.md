# Midnight Network Integration

> Privacy-preserving smart contracts, Data DAOs, and NFT-gated access control for Cardano/Midnight ecosystem

---

## Overview

This integration connects the **Midnight Network** (privacy blockchain) with **MosAic Companion** (AI agent orchestration) through:

- **HyperSharePass NFT Gate** - CIP-30 wallet authentication
- **Data DAOs** - Privacy-preserving data sharing
- **Metadata Delegation** - Midnight node delegation interface

---

## Features

### 🔐 Access Control
- Cardano wallet connection (Eternl, Lace, Nami, Yoroi, Flint)
- NFT-gated access levels:
  - **1+ NFT** → Chat + 1 AI Agent
  - **10+ NFTs** → Full compute access

### 🌐 Network Components
- **Creator Portal** - Dashboard for Midnight creators
- **Validator Dashboard** - Node validation interface
- **Governance Dashboard** - DAO governance UI
- **Wallet Connector** - Multi-wallet support

### 📜 Smart Contracts
- `HyperSharePassDelegation.hs` - Haskell smart contract for NFT delegation

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Blockfrost API key
```

### 3. Run Development

```bash
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/verify` | Verify wallet + get access rights |
| GET | `/api/delegation/:address` | Get user's delegation status |
| GET | `/api/node-factories` | List all node factories |

---

## Project Structure

```
midnight-mosaic-integration/
├── src/
│   ├── CreatorPortal.tsx      # Main dashboard
│   ├── HyperSharePassConnector.tsx  # NFT gate UI
│   ├── cardano-wallet.ts      # CIP-30 wallet service
│   ├── metadata-delegation.ts  # Midnight delegation
│   └── index.ts               # Exports
├── contracts/
│   └── HyperSharePassDelegation.hs  # Haskell contract
├── types.ts                   # TypeScript definitions
├── governance-dashboard.ts    # Governance UI
├── validator-dashboard.ts      # Validator UI
└── wallet-connector.ts        # Multi-wallet support
```

---

## Integration with MosAic

This module integrates with the main MosAic Companion app:

1. Import the wallet connector
2. Check NFT holdings via Cardano wallet
3. Grant access based on NFT count
4. Enable Midnight features for authorized users

```typescript
import { CardanoWalletService } from './cardano-wallet';
import { HyperSharePassConnector } from './HyperSharePassConnector';

const wallet = new CardanoWalletService();
const nftCount = await wallet.getNFTCount(policyId);
const accessLevel = nftCount >= 10 ? 'full' : nftCount >= 1 ? 'basic' : 'none';
```

---

## Policy ID

HyperSharePass NFT Collection:
```
a222abf06e562a5acc7d5bb3bec3d0b29414082e6fe5650026f92d46
```

---

## Resources

- [Midnight Network Docs](https://docs.midnight.network)
- [Cardano CIP-30](https://cips.cardano.org/cip/CIP-0030)
- [MosAic Companion](https://github.com/hypercycle-development/mosaic-companion)

---

## License

MIT

---

## Maintainers

- HPEC DAO Team
- Orbit (AI Assistant)

*Last updated: March 2026*
# Midnight MosAic Integration

HyperSharePass NFT-gated access to MosAic AI agents for midnight.city

---

## Quick Start

### 1. Install Dependencies

```bash
cd projects/midnight-mosaic-integration
npm install
```

### 2. Configure Environment

```bash
# Create .env file
cp .env.example .env

# Add Blockfrost API key (optional for dev)
BLOCKFROST_PROJECT_ID=your_key_here
PORT=3001
```

### 3. Run the Server

```bash
npm run dev
```

Server runs on `http://localhost:3001`

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/verify` | Verify wallet + get access rights |
| GET | `/api/delegation/:address` | Get user's delegation status |

### Node Factories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/node-factories` | List all node factories |
| GET | `/api/node-factories?type=eth` | Filter by type |
| GET | `/api/node-factories?available=true` | Only available |

### Delegation (Creator Portal)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/delegation/delegate` | Delegate node factories |
| POST | `/api/delegation/undelegate` | Remove delegation |

### AI Agents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agents/:wallet` | List user's agents |
| POST | `/api/agents/create` | Create new agent |
| DELETE | `/api/agents/:agentId` | Delete agent |

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/session` | Create chat session |

---

## Usage Examples

### Verify Wallet & Get Access

```bash
curl -X POST http://localhost:3001/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "address": "addr1...",
    "wallet": "eternl"
  }'
```

Response:
```json
{
  "success": true,
  "hyperSharePassCount": 5,
  "access": {
    "canChat": true,
    "canCreateAgents": 5,
    "canDelegate": true,
    "canRentCompute": false
  },
  "maxAgents": 5
}
```

### Delegate Node Factories

```bash
curl -X POST http://localhost:3001/api/delegation/delegate \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "addr1...",
    "nodeFactoryIds": [1, 2, 3]
  }'
```

### Create AI Agent

```bash
curl -X POST http://localhost:3001/api/agents/create \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "addr1...",
    "name": "My Agent",
    "nodeFactoryId": 1
  }'
```

---

## Frontend Integration

### HyperSharePass Connector (React)

```tsx
import { HyperSharePassConnector } from './src/HyperSharePassConnector';

function App() {
  const handleConnect = (state) => {
    console.log('Connected:', state.walletName);
    console.log('Access:', state.access);
  };

  return (
    <HyperSharePassConnector onConnect={handleConnect} />
  );
}
```

### Creator Portal

```tsx
import { CreatorPortal } from './src/CreatorPortal';

function App() {
  return <CreatorPortal apiBase="http://localhost:3001" />;
}
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     midnight.city                           │
│                    (AI Agent Visualizer)                    │
└────────────────────────────┬────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API Server   │
                    │   (Port 3001)  │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼───────┐    ┌──────▼──────┐    ┌──────▼──────┐
│   CIP-30      │    │  Node       │    │   AI Agent  │
│   Connector   │    │  Factory    │    │   Manager   │
│               │    │  Registry   │    │             │
└───────┬───────┘    └─────────────┘    └─────────────┘
        │
        ▼
┌───────────────────────────────────────────────┐
│         Cardano Blockchain                    │
│  Policy: a222abf06e562a5acc7d5bb3bec3d0b...   │
│  Collection: HyperSharePass (999 NFTs)        │
└───────────────────────────────────────────────┘
```

---

## Access Rights

| HyperSharePass | Chat | AI Agents | Delegate | Rent Compute |
|---------------|------|-----------|----------|--------------|
| 1 | ✅ | 1 | ✅ | ❌ |
| 5 | ✅ | 5 | ✅ | ❌ |
| 10 | ✅ | 10 | ✅ | ✅ |
| 50+ | ✅ | 50+ | ✅ | ✅ |

---

## Files

```
projects/midnight-mosaic-integration/
├── src/
│   ├── index.ts                    # API Server
│   ├── cardano-wallet.ts           # CIP-30 connector
│   ├── metadata-delegation.ts      # NFT metadata delegation
│   ├── HyperSharePassConnector.tsx # React wallet connector
│   └── CreatorPortal.tsx           # Node delegation portal
├── contracts/
│   └── HyperSharePassDelegation.hs # Plutus validator (optional)
├── package.json
└── tsconfig.json
```

---

## Beta Testing

1. Run server: `npm run dev`
2. Open Creator Portal at `http://localhost:3001/portal`
3. Connect wallet (Eternl/Lace/Nami)
4. Verify HyperSharePass NFTs detected
5. Select node factories to delegate
6. Create AI agents

Report issues to: [Your feedback channel]

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3001 | Server port |
| BLOCKFROST_PROJECT_ID | - | Blockfrost API key (optional) |
| NODE_ENV | development | dev or production |

---

## License

HPEC DAO - 2026
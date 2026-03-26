# AI Agent Services Specification

## Midnight/MosAIc Integration

**Date:** 2026-03-24
**Purpose:** Define AI agent services for the MosAIc Companion Midnight integration

---

## Overview

This document specifies three AI agent services that operate within the MosAIc Companion ecosystem to help users interact with the Midnight Network. These agents leverage the Midnight governance phases (Hilo, Kūkolu, Mōhalu, Hua) and provide intelligent automation for delegation, governance, and risk management.

---

## Agent 1: Governance Analysis Agent

### Purpose
Analyze Midnight governance proposals and provide actionable insights for voting decisions.

### Capabilities
- **Proposal Parsing**: Extract key information from governance proposals
- **Impact Assessment**: Analyze potential effects on network, stakeholders, and token holders
- **Historical Analysis**: Compare with previous proposals and outcomes
- **Voting Recommendations**: Generate informed voting suggestions based on user preferences
- **Proposal Tracking**: Monitor and notify about new proposals

### System Prompt

```
You are the Governance Analysis Agent for Midnight Network on MosAIc Companion. Your role is to help delegators make informed voting decisions.

## Context
Midnight Network uses a governance system with four phases:
- **Hilo**: Proposal submission and initial discussion
- **Kūkolu**: Technical review and feedback
- **Mōhalu**: Voting period
- **Hua**: Implementation and execution

## Your Capabilities
1. Parse proposal content and extract key points
2. Assess impact on network parameters, tokenomics, and stakeholders
3. Provide balanced analysis of pros and cons
4. Generate voting recommendations based on user-defined preferences
5. Track proposal status and notify users of important updates

## Guidelines
- Always present balanced analysis
- Never provide financial advice
- Cite sources when available
- Flag potential conflicts of interest
- Consider both short-term and long-term impacts

## Output Format
Provide responses in structured format:
- Executive Summary
- Key Points
- Impact Analysis
- Recommendation with confidence level
- Supporting Data
```

### Input/Output Formats

**Input:**
```typescript
interface GovernanceAnalysisRequest {
  proposalId: string;
  userPreferences?: {
    focusAreas: string[];
    riskTolerance: 'low' | 'medium' | 'high';
  };
}
```

**Output:**
```typescript
interface GovernanceAnalysisResponse {
  proposalId: string;
  summary: string;
  keyPoints: string[];
  pros: string[];
  cons: string[];
  impactAssessment: 'positive' | 'negative' | 'neutral';
  recommendation: 'vote_yes' | 'vote_no' | 'abstain';
  confidence: number; // 0-100
}
```

### Integration Points
- Governance API: Fetch proposals, vote counts, proposal details
- Wallet API: Check delegation status for voting power
- Notification System: Alert users about proposal updates

---

## Agent 2: Stake Optimization Agent

### Purpose
Optimize staking rewards through intelligent validator selection and rebalancing.

### Capabilities
- **Validator Monitoring**: Track validator performance, uptime, and reliability
- **Reward Calculation**: Estimate and track expected staking rewards
- **Diversification**: Recommend optimal stake distribution across validators
- **Auto-Rebalancing**: Suggest or execute stake redistribution based on performance
- **Pool Comparison**: Compare validators across multiple metrics

### System Prompt

```
You are the Stake Optimization Agent for Midnight Network on MosAIc Companion. Your role is to maximize staking rewards while managing risk.

## Context
Midnight Network uses a permissioned validator set. Validators are evaluated on:
- Uptime (target: >99%)
- Blocks produced
- Commission rate
- Security and infrastructure quality

## Your Capabilities
1. Monitor validator performance metrics
2. Calculate expected rewards based on stake amount and validator selection
3. Recommend optimal delegation strategy
4. Suggest rebalancing when validators underperform
5. Track historical performance for informed decisions

## Risk Management
- Never recommend a validator with <95% uptime
- Consider diversification across multiple validators
- Flag validators approaching saturation
- Monitor for any slashing events

## Output Format
Provide responses with:
- Current delegation status
- Performance metrics
- Recommendations
- Expected impact on rewards
```

### Input/Output Formats

**Input:**
```typescript
interface StakeOptimizationRequest {
  walletAddress: string;
  totalStake: bigint;
  currentDelegations?: DelegationInfo[];
  preferences?: {
    focusOn: 'max_return' | 'safety' | 'decentralization';
    autoRebalance: boolean;
  };
}
```

**Output:**
```typescript
interface StakeOptimizationResponse {
  currentDelegations: DelegationInfo[];
  totalExpectedApy: number;
  recommendations: {
    action: 'maintain' | 'increase' | 'decrease' | 'migrate';
    fromValidator?: string;
    toValidator?: string;
    amount: bigint;
    reason: string;
    expectedImpact: number; // % change in rewards
  }[];
  diversificationScore: number; // 0-100
}
```

### Integration Points
- Validator API: Fetch validator metrics, performance data
- Wallet API: Check current delegations, balance
- Transaction API: Prepare delegation transactions
- Notification System: Alert about rebalancing opportunities

---

## Agent 3: Risk Assessment Agent

### Purpose
Assess and monitor risks associated with validator delegation and network participation.

### Capabilities
- **Validator Risk Scoring**: Evaluate validators on security, reliability, and operational quality
- **Historical Analysis**: Check for past incidents, penalties, or slashing
- **Geographic Distribution**: Analyze validator diversity and location risks
- **Security Posture**: Evaluate infrastructure and operational security
- **Network Risk Monitoring**: Track overall network health and decentralization

### System Prompt

```
You are the Risk Assessment Agent for Midnight Network on MosAIc Companion. Your role is to identify and communicate risks related to staking and network participation.

## Risk Categories
1. **Validator Risk**: Operational failures, security issues, poor performance
2. **Network Risk**: Centralization, governance attacks, protocol vulnerabilities
3. **Smart Contract Risk**: Code bugs, exploits (for dApp users)
4. **Liquidity Risk**: Token liquidity, delegation lock-up periods
5. **Regulatory Risk**: Jurisdiction-specific concerns

## Your Capabilities
1. Analyze validator history and incident reports
2. Monitor for slashing events or penalties
3. Assess geographic distribution of validators
4. Evaluate network decentralization metrics
5. Provide risk scores and mitigation recommendations

## Risk Levels
- 🟢 LOW: Normal operation, no concerns
- 🟡 MEDIUM: Minor issues, watch closely
- 🔴 HIGH: Significant concerns, consider action
- ⚫ CRITICAL: Immediate action recommended

## Guidelines
- Always provide actionable recommendations
- Explain the reasoning behind risk scores
- Update scores based on new information
- Prioritize user fund safety
```

### Input/Output Formats

**Input:**
```typescript
interface RiskAssessmentRequest {
  validatorIds: string[];
  walletAddress?: string;
  includeNetworkRisk?: boolean;
}
```

**Output:**
```typescript
interface RiskAssessmentResponse {
  validatorRisks: {
    validatorId: string;
    riskScore: number; // 0-100 (lower is safer)
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    factors: {
      category: string;
      score: number;
      description: string;
    }[];
    recommendations: string[];
  }[];
  networkRisk?: {
    decentralizationScore: number;
    top10StakePercent: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    concerns: string[];
  };
  overallRisk: number;
}
```

### Integration Points
- Validator API: Fetch validator details, history
- Network API: Fetch chain parameters, stake distribution
- Monitor APIs: Track incident reports, slashing events
- Wallet API: Check user's delegation exposure

---

## Agent Communication

### Message Format
Agents communicate using a standardized message format:

```typescript
interface AgentMessage {
  agentId: string;
  type: 'request' | 'response' | 'alert';
  payload: unknown;
  timestamp: Date;
}
```

### Events
- **proposal_update**: New governance proposal detected
- **validator_alert**: Validator performance issue detected
- **reward_update**: Staking rewards milestone reached
- **risk_alert**: Risk score changed significantly

---

## Implementation Notes

1. **Phase 1** (Current): Static analysis and recommendations
2. **Phase 2**: API integration for real-time data
3. **Phase 3**: Automated transaction execution (optional)
4. **Phase 4**: Machine learning for predictive analysis

---

## References
- Midnight Network Docs: https://docs.midnight.network
- MosAIc Companion: https://github.com/hypercycle-development/mosaic-companion
- Midnight Governance: https://forum.midnight.network
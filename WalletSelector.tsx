/**
 * WalletSelector Component
 * React component for selecting and connecting Cardano wallets in MosAIc
 */

import React, { useState, useEffect, useCallback } from 'react';
import { detectWallets, WalletConnector, createWalletConnector, type WalletName, type WalletState, type DetectedWallet } from './wallet-connector';
import type { ConnectionStatus } from './types';

// ============================================================================
// Styles
// ============================================================================

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    maxWidth: '400px',
    margin: '0 auto',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#333',
  },
  walletList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  walletButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  walletButtonInstalled: {
    cursor: 'pointer',
  },
  walletButtonNotInstalled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  walletIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  },
  walletInfo: {
    flex: 1,
    textAlign: 'left' as const,
  },
  walletName: {
    fontWeight: '500',
    fontSize: '14px',
  },
  walletStatus: {
    fontSize: '12px',
    color: '#666',
  },
  connectedBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '500',
    background: '#e8f5e9',
    color: '#2e7d32',
  },
  connectingBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '500',
    background: '#fff3e0',
    color: '#ef6c00',
  },
  disconnectButton: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    background: '#ffebee',
    color: '#c62828',
    cursor: 'pointer',
    fontSize: '12px',
  },
  error: {
    padding: '12px',
    borderRadius: '8px',
    background: '#ffebee',
    color: '#c62828',
    fontSize: '13px',
    marginTop: '12px',
  },
  balance: {
    marginTop: '16px',
    padding: '12px',
    borderRadius: '8px',
    background: '#f5f5f5',
    fontSize: '13px',
  },
};

// ============================================================================
// Component
// ============================================================================

interface WalletSelectorProps {
  onConnect?: (state: WalletState) => void;
  onDisconnect?: () => void;
  supportedWallets?: WalletName[];
}

export const WalletSelector: React.FC<WalletSelectorProps> = ({
  onConnect,
  onDisconnect,
  supportedWallets = ['lace', 'eternal'],
}) => {
  const [detectedWallets, setDetectedWallets] = useState<DetectedWallet[]>([]);
  const [connectedWallet, setConnectedWallet] = useState<WalletName | null>(null);
  const [walletState, setWalletState] = useState<WalletState | null>(null);
  const [connector, setConnector] = useState<WalletConnector | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Detect wallets on mount
  useEffect(() => {
    const wallets = detectWallets();
    setDetectedWallets(wallets);
  }, []);

  // Connect to a wallet
  const handleConnect = useCallback(async (walletName: WalletName) => {
    setError(null);
    
    try {
      const newConnector = createWalletConnector(walletName);
      setConnector(newConnector);

      // Listen for events
      newConnector.on('connected', (event: any) => {
        const state = newConnector.getState();
        setWalletState(state);
        setConnectedWallet(walletName);
        onConnect?.(state);
      });

      newConnector.on('error', (event: any) => {
        setError(event.payload.error);
      });

      // Connect
      const state = await newConnector.connect();
      setWalletState(state);
      setConnectedWallet(walletName);
      onConnect?.(state);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      setError(message);
    }
  }, [onConnect]);

  // Disconnect
  const handleDisconnect = useCallback(() => {
    connector?.disconnect();
    setConnectedWallet(null);
    setWalletState(null);
    setConnector(null);
    onDisconnect?.();
  }, [connector, onDisconnect]);

  // Filter wallets
  const displayWallets = detectedWallets.filter((w) => 
    supportedWallets.includes(w.name)
  );

  const getStatusBadge = (installed: boolean, isConnected: boolean, isConnecting: boolean) => {
    if (isConnected) {
      return <span style={styles.connectedBadge}>Connected</span>;
    }
    if (isConnecting) {
      return <span style={styles.connectingBadge}>Connecting...</span>;
    }
    return <span style={styles.walletStatus}>{installed ? 'Click to connect' : 'Not installed'}</span>;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Connect Wallet</h2>

      <div style={styles.walletList}>
        {displayWallets.map((wallet) => {
          const isConnected = connectedWallet === wallet.name;
          const isConnecting = walletState?.status === 'connecting';
          
          return (
            <button
              key={wallet.name}
              style={{
                ...styles.walletButton,
                ...(wallet.installed ? styles.walletButtonInstalled : styles.walletButtonNotInstalled),
              }}
              onClick={() => wallet.installed && !isConnected && handleConnect(wallet.name)}
              disabled={!wallet.installed || isConnected}
            >
              <div style={styles.walletIcon}>
                {wallet.displayName.charAt(0)}
              </div>
              <div style={styles.walletInfo}>
                <div style={styles.walletName}>{wallet.displayName}</div>
                {getStatusBadge(wallet.installed, isConnected, isConnecting && connectedWallet === wallet.name)}
              </div>
              {isConnected && (
                <button 
                  style={styles.disconnectButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDisconnect();
                  }}
                >
                  Disconnect
                </button>
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {walletState?.balance && (
        <div style={styles.balance}>
          <strong>Balance:</strong> {walletState.balance.formattedAda} ADA
        </div>
      )}
    </div>
  );
};

export default WalletSelector;
import { useState, useEffect } from 'react';
import { xionService, GameSessionData, ZkTLSProof, ProofVerificationResult, XionTransaction } from '../services/xionService';
import { WalletConnection, BiometricAuthResult } from '../lib/xion-dave-toolkit';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import toast from 'react-hot-toast';

export const useXion = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<XionTransaction[]>([]);

  useEffect(() => {
    initializeXion();
  }, []);

  const initializeXion = async () => {
    try {
      setLoading(true);
      await xionService.initialize();
      
      // Check if wallet is already connected
      const wallet = await xionService.getWalletInfo();
      if (wallet?.isConnected) {
        setWalletAddress(wallet.address);
        setIsConnected(true);
        await loadTransactions();
      }
      
      // Check biometrics availability (mobile only)
      setBiometricsEnabled(Capacitor.isNativePlatform());
      
    } catch (error) {
      console.error('Failed to initialize XION:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize XION');
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const wallet = await xionService.connectWallet();
      setWalletAddress(wallet.address);
      setIsConnected(true);
      
      await loadTransactions();
      
      toast.success('XION Wallet connected successfully!');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async (): Promise<void> => {
    try {
      setLoading(true);
      
      await xionService.disconnectWallet();
      setWalletAddress(null);
      setIsConnected(false);
      setTransactions([]);
      
      toast.success('Wallet disconnected');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to disconnect wallet';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    if (!biometricsEnabled) {
      toast.error('Biometrics not available - please use a mobile device');
      return false;
    }

    try {
      setLoading(true);
      
      const result = await xionService.authenticateWithBiometrics();
      
      if (result.success) {
        toast.success('Biometric authentication successful!');
        await loadTransactions();
      } else {
        toast.error(result.error || 'Biometric authentication failed');
      }
      
      return result.success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Biometric authentication failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createGameProof = async (gameData: Partial<GameSessionData>): Promise<ZkTLSProof | null> => {
    if (!isConnected) {
      toast.error('Please connect your XION wallet first');
      return null;
    }

    try {
      setLoading(true);
      
      toast.loading('Generating zkTLS proof...', { duration: 3000 });
      
      const proof = await xionService.createGameProof(gameData);
      
      if (proof) {
        toast.success('zkTLS proof generated successfully!');
        await loadTransactions();
      } else {
        toast.error('Failed to generate proof');
      }
      
      return proof;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create proof';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const verifyAchievement = async (proof: ZkTLSProof): Promise<boolean> => {
    try {
      setLoading(true);
      
      toast.loading('Verifying achievement with zkTLS...', { duration: 1500 });
      
      const result = await xionService.verifyAchievement(proof);
      
      if (result.isValid) {
        toast.success(`Achievement verified! (${(result.confidence * 100).toFixed(1)}% confidence)`);
        await loadTransactions();
      } else {
        toast.error(`Verification failed: ${result.errors?.join(', ') || 'Unknown error'}`);
      }
      
      return result.isValid;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify achievement';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const txs = await xionService.getTransactions();
      setTransactions(txs);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const getAllProofs = async (): Promise<ZkTLSProof[]> => {
    try {
      return await xionService.getAllProofs();
    } catch (error) {
      console.error('Failed to get proofs:', error);
      return [];
    }
  };

  return {
    isConnected,
    walletAddress,
    loading,
    biometricsEnabled,
    error,
    transactions,
    connectWallet,
    disconnectWallet,
    authenticateWithBiometrics,
    createGameProof,
    verifyAchievement,
    getAllProofs,
    loadTransactions,
  };
};
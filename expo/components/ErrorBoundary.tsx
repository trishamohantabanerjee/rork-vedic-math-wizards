import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ErrorBoundaryState { hasError: boolean; errorMessage?: string; }

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return { hasError: true, errorMessage: msg };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.log('[ErrorBoundary] Caught error', { error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container} testID="error-boundary">
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>Please close and reopen the screen. If the issue persists, contact support.</Text>
          {this.state.errorMessage ? (
            <Text style={styles.details}>Details: {this.state.errorMessage}</Text>
          ) : null}
        </View>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  message: { fontSize: 14, textAlign: 'center' },
  details: { fontSize: 12, marginTop: 8, color: '#6B7280', textAlign: 'center' },
});
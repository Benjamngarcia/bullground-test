import React from 'react';
import { Image, StyleSheet } from 'react-native';

export function HeaderLogo() {
  return (
    <Image
      source={{ uri: 'https://bullground.app/logo-white.png' }}
      style={styles.logo}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 120,
    height: 32,
  },
});

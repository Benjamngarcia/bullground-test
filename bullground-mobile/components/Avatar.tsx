import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme-bullground';

interface AvatarProps {
  email?: string;
  size?: number;
  fontSize?: number;
}

export function Avatar({ email, size = 36, fontSize = 14 }: AvatarProps) {
  const getInitial = () => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  return (
    <LinearGradient
      colors={[Colors.gradient.emeraldStart, Colors.gradient.emeraldEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <Text style={[styles.initial, { fontSize }]}>{getInitial()}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initial: {
    color: Colors.text.primary,
    fontWeight: '600' as '600',
  },
});

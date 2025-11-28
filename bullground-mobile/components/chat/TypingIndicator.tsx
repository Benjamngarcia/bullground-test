// Typing indicator component - matching web frontend with WiMA branding
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { IconRobot } from '@tabler/icons-react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/theme-bullground';

export default function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0.5)).current;
  const dot2 = useRef(new Animated.Value(0.5)).current;
  const dot3 = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.5,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animation = Animated.parallel([
      animate(dot1, 0),
      animate(dot2, 200),
      animate(dot3, 400),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        {/* Robot icon avatar */}
        <View style={styles.assistantAvatar}>
          <IconRobot size={16} color={Colors.brand.accent} />
        </View>

        <View style={styles.content}>
          {/* WiMA label */}
          <Text style={styles.wimaLabel}>WiMA</Text>

          {/* Typing indicator bubble */}
          <View style={styles.bubble}>
            <View style={styles.dotsContainer}>
              <Animated.View style={[styles.dot, { opacity: dot1 }]} />
              <Animated.View style={[styles.dot, { opacity: dot2 }]} />
              <Animated.View style={[styles.dot, { opacity: dot3 }]} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    maxWidth: '90%',
  },
  assistantAvatar: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.zinc[900],
    borderWidth: 1,
    borderColor: Colors.zinc[800],
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
  },
  wimaLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: '500' as '500',
    color: Colors.text.primary,
    marginBottom: 6,
  },
  bubble: {
    backgroundColor: Colors.zinc[900],
    borderWidth: 1,
    borderColor: Colors.zinc[800],
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignSelf: 'flex-start',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.zinc[600],
  },
});

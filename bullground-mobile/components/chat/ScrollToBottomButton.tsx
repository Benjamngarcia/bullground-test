// Scroll to bottom button - matching web frontend design
import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { IconChevronDown } from '@tabler/icons-react-native';
import { Colors, Spacing, Shadows } from '../../constants/theme-bullground';

interface ScrollToBottomButtonProps {
  visible: boolean;
  onPress: () => void;
}

export default function ScrollToBottomButton({
  visible,
  onPress,
}: ScrollToBottomButtonProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: visible ? 1 : 0.9,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  }, [visible, opacity, scale]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <IconChevronDown
          size={20}
          color={Colors.text.secondary}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 150, // Above the input area
    alignSelf: 'center',
    zIndex: 10,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.zinc[800],
    borderWidth: 1,
    borderColor: Colors.zinc[700],
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
});

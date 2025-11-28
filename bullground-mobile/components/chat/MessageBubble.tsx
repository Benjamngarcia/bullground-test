// Message bubble component - matching the web frontend design
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconRobot } from '@tabler/icons-react-native';
import { Message } from '../../types';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/theme-bullground';

interface MessageBubbleProps {
  message: Message;
  isGrouped?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

// Strip markdown symbols for clean display
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1')     // Italic
    .replace(/`(.*?)`/g, '$1')       // Inline code
    .replace(/#{1,6}\s/g, '')        // Headers
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    .replace(/^[-*+]\s/gm, '')       // List bullets
    .replace(/^\d+\.\s/gm, '');      // Numbered lists
}

export default function MessageBubble({
  message,
  isGrouped = false,
  isFirst = true,
  isLast = true,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const cleanContent = stripMarkdown(message.content);

  // User message layout (right-aligned, simple)
  if (isUser) {
    return (
      <View style={styles.container}>
        <View style={styles.userMessageContainer}>
          <View style={styles.userBubble}>
            <Text style={styles.userText}>{cleanContent}</Text>
          </View>
        </View>
      </View>
    );
  }

  // Assistant message layout (left-aligned, with WiMA branding)
  return (
    <View style={styles.container}>
      <View style={styles.assistantMessageContainer}>
        {/* Robot icon avatar */}
        <View style={styles.assistantAvatar}>
          <IconRobot size={16} color={Colors.brand.accent} />
        </View>

        <View style={styles.assistantContent}>
          {/* WiMA label */}
          <Text style={styles.wimaLabel}>WiMA</Text>

          {/* Message text */}
          <Text style={styles.assistantText}>{cleanContent}</Text>
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

  // User message styles
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  userBubble: {
    backgroundColor: Colors.message.user.background,
    borderWidth: 1,
    borderColor: Colors.message.user.border,
    borderRadius: 16,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    maxWidth: '80%',
  },
  userText: {
    fontSize: Typography.sizes.sm,
    color: Colors.message.user.text,
    lineHeight: 20,
  },

  // Assistant message styles
  assistantMessageContainer: {
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
  assistantContent: {
    flex: 1,
  },
  wimaLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: '500' as '500',
    color: Colors.text.primary,
    marginBottom: 6,
  },
  assistantText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.assistant,
    lineHeight: 20,
  },
});

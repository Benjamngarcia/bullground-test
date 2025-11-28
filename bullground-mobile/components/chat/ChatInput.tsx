// Chat input component - matching web frontend glassmorphic design
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { IconPaperclip, IconArrowUp } from '@tabler/icons-react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/theme-bullground';

interface ChatInputProps {
  onSend: (message: string) => void;
  isSending?: boolean;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  isSending = false,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isSending && !disabled) {
      onSend(trimmedMessage);
      setMessage('');
    }
  };

  const canSend = message.trim().length > 0 && !isSending && !disabled;

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        {/* Main input container with glassmorphic effect */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask WiMA anything you want..."
            placeholderTextColor={Colors.zinc[500]}
            value={message}
            onChangeText={setMessage}
            multiline={true}
            maxLength={2000}
            editable={!disabled && !isSending}
            returnKeyType="default"
            blurOnSubmit={false}
          />

          {/* Action buttons container */}
          <View style={styles.actionsContainer}>
            {/* Attachment button (optional) */}
            <TouchableOpacity
              style={styles.attachButton}
              activeOpacity={0.7}
              disabled
            >
              <IconPaperclip
                size={18}
                color={Colors.text.secondary}
              />
            </TouchableOpacity>

            {/* Send button */}
            <TouchableOpacity
              style={[
                styles.sendButton,
                canSend && styles.sendButtonActive,
              ]}
              onPress={handleSend}
              disabled={!canSend}
              activeOpacity={0.8}
            >
              {isSending ? (
                <ActivityIndicator size="small" color={Colors.text.primary} />
              ) : (
                <IconArrowUp
                  size={18}
                  color={canSend ? Colors.text.primary : Colors.zinc[600]}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.zinc[800],
    paddingBottom: 34, // Account for safe area on iOS
  },
  inputWrapper: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  inputContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.background.cardBorder,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    minHeight: 80,
  },
  input: {
    fontSize: Typography.sizes.base,
    color: Colors.text.secondary,
    lineHeight: 22,
    maxHeight: 120,
    paddingRight: 100, // Space for action buttons
  },
  actionsContainer: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  attachButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.zinc[800],
  },
  sendButtonActive: {
    backgroundColor: Colors.zinc[700],
  },
});

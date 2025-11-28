import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Text,
} from 'react-native';
import { Message } from '../../types';
import { sendMessage, getConversations, getConversation } from '../../api/chatApi';
import MessageBubble from '../../components/chat/MessageBubble';
import TypingIndicator from '../../components/chat/TypingIndicator';
import ChatInput from '../../components/chat/ChatInput';
import ScrollToBottomButton from '../../components/chat/ScrollToBottomButton';
import { Colors, Spacing } from '../../constants/theme-bullground';

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flatListRef = useRef<FlatList>(null);
  const isNearBottom = useRef(true);

  // Load initial conversation
  useEffect(() => {
    loadConversation();
  }, []);

  const loadConversation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get most recent conversation
      const conversationsData = await getConversations(1, 0);

      if (conversationsData.conversations.length > 0) {
        const latestConv = conversationsData.conversations[0];
        setConversationId(latestConv.id);

        // Load messages for this conversation
        const messagesData = await getConversation(latestConv.id);
        setMessages(messagesData.messages);
      }
    } catch (err: any) {
      console.error('Failed to load conversation:', err);
      setError('Failed to load messages. Pull to refresh.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (messageText: string) => {
    try {
      setIsSending(true);
      setError(null);

      // Optimistically add user message
      const tempUserMessage: Message = {
        id: `temp-${Date.now()}`,
        conversationId: conversationId || '',
        role: 'user',
        content: messageText,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, tempUserMessage]);
      scrollToBottom(true);

      // Show typing indicator
      setIsTyping(true);

      // Send message to API
      const response = await sendMessage({
        conversationId,
        message: messageText,
      });

      // Update conversation ID if this was the first message
      if (!conversationId) {
        setConversationId(response.conversationId);
      }

      // Replace temp message with real messages
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== tempUserMessage.id);
        return [...filtered, response.userMessage, response.assistantMessage];
      });

      setIsTyping(false);
      scrollToBottom(true);
    } catch (err: any) {
      setIsTyping(false);
      const errorMessage = err.response?.data?.error?.message || 'Failed to send message';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);

      // Remove temp message on error
      setMessages((prev) =>
        prev.filter((msg) => !msg.id.startsWith('temp-'))
      );
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = (animated: boolean = true) => {
    const anim = !!animated;
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: anim });
    }
  };

  const handleScroll = useCallback((event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const distanceFromBottom =
      contentSize.height - layoutMeasurement.height - contentOffset.y;

    // Show button if user scrolled up more than 100px from bottom
    const nearBottom = distanceFromBottom < 100;
    isNearBottom.current = nearBottom;
    setShowScrollButton(Boolean(!nearBottom && messages.length > 5));
  }, [messages.length]);

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;

    const isGrouped = !!(prevMessage && prevMessage.role === item.role);
    const isFirst = !isGrouped;
    const isLast = !nextMessage || nextMessage.role !== item.role;

    return (
      <MessageBubble
        message={item}
        isGrouped={isGrouped}
        isFirst={isFirst}
        isLast={isLast}
      />
    );
  };

  const renderFooter = () => {
    if (isTyping) {
      return <TypingIndicator />;
    }
    return <View style={styles.listFooter} />;
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.brand.primary} />
          <Text style={styles.loadingText}>Loading conversation...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Welcome!</Text>
              <Text style={styles.emptyText}>
                Ask your financial advisor anything about your portfolio,
                strategies, or market insights.
              </Text>
            </View>
          }
          onContentSizeChange={() => {
            if (isNearBottom.current) {
              scrollToBottom(false);
            }
          }}
          onLayout={() => {
            if (messages.length > 0) {
              scrollToBottom(false);
            }
          }}
        />

        <ScrollToBottomButton
          visible={showScrollButton}
          onPress={() => scrollToBottom(true)}
        />

        <ChatInput
          onSend={handleSend}
          isSending={isSending}
          disabled={isLoading || isTyping}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messageList: {
    paddingTop: Spacing.md,
    flexGrow: 1,
  },
  listFooter: {
    height: Spacing.md,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  loadingText: {
    color: Colors.text.secondary,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
    paddingTop: Spacing.xxxl * 2,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600' as '600',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

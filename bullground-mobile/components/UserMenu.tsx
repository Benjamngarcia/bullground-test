import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { IconLogout } from '@tabler/icons-react-native';
import { Avatar } from './Avatar';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Spacing, Typography, Shadows } from '../constants/theme-bullground';
import { router } from 'expo-router';

export function UserMenu() {
  const { user, logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleSignOut = () => {
    setMenuVisible(false);
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        activeOpacity={0.8}
        style={styles.avatarButton}
      >
        <Avatar email={user?.email} size={32} fontSize={13} />
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={styles.menu}>
                <View style={styles.userInfo}>
                  <Avatar email={user?.email} size={40} fontSize={16} />
                  <View style={styles.userDetails}>
                    <Text style={styles.username} numberOfLines={1}>
                      {user?.email?.split('@')[0] || 'User'}
                    </Text>
                    <Text style={styles.email} numberOfLines={1}>
                      {user?.email}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleSignOut}
                  activeOpacity={0.7}
                >
                  <IconLogout
                    size={18}
                    color={Colors.status.error}
                  />
                  <Text style={styles.menuItemText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  avatarButton: {
    marginRight: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.ui.overlay,
  },
  menuContainer: {
    position: 'absolute',
    top: 50,
    right: Spacing.lg,
    minWidth: 250,
  },
  menu: {
    backgroundColor: Colors.zinc[900],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.zinc[800],
    ...Shadows.lg,
    overflow: 'hidden',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  userDetails: {
    flex: 1,
    minWidth: 0,
  },
  username: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600' as '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  email: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.tertiary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.zinc[800],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  menuItemText: {
    fontSize: Typography.sizes.sm,
    color: Colors.status.error,
    fontWeight: '500' as '500',
  },
});

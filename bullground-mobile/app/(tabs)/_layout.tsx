import { Stack } from 'expo-router';
import React from 'react';
import { UserMenu } from '../../components/UserMenu';
import { HeaderLogo } from '../../components/HeaderLogo';
import { Colors } from '../../constants/theme-bullground';

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.zinc[900],
        },
        headerTintColor: Colors.text.primary,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: Colors.background.primary,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => <HeaderLogo />,
          headerRight: () => <UserMenu />,
        }}
      />
    </Stack>
  );
}

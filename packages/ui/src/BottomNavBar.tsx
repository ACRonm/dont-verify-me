import React from 'react';
import { XStack, YStack, Button, useMedia } from 'tamagui';
import { LayoutGrid, Bike, Plus, Bookmark, Settings } from '@tamagui/lucide-icons';
import { useRouter } from 'next/navigation';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  isActive: boolean;
  onPress: () => void;
}

const NavItem = ({ icon: Icon, isActive, onPress }: NavItemProps) => (
  <Button
    chromeless
    onPress={onPress}
    height="100%"
    circular
    icon={() => (
      <YStack padding="$3" alignItems="center" gap="$1">
        <Icon color={isActive ? '$accent' : '$color8'} />
        {isActive && (
          <YStack
            height={4}
            width={4}
            backgroundColor="$accent"
            borderRadius="$4"
          />
        )}
      </YStack>
    )}
  />
);

export function BottomNavBar() {
  const router = useRouter();
  const activePath = '/dashboard'; // This should be dynamic based on the current route
  const media = useMedia();

  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/dashboard' },
    { icon: Bike, label: 'Garage', path: '/garage' },
    { icon: Bookmark, label: 'Saved', path: '/saved' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  if (media.gtMd) {
    return null;
  }

  return (
    <YStack
      // @ts-ignore
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      alignItems="center"
      paddingBottom={media.gtSm ? "$4" : "$2"}
    >
      <XStack
        width={media.gtSm ? "50%" : "90%"}
        height="$6"
        alignItems="center"
        justifyContent="space-around"
        position="relative"
      >
        <XStack
          backgroundColor="$navbarBackground"
          // @ts-ignore
          backdropFilter="blur(10px)"
          borderRadius="$10"
          paddingHorizontal="$3"
          alignItems="center"
          justifyContent="space-around"
          elevation="$4"
          shadowColor="$shadowColor"
          flex={1}
          height="100%"
        >
          {navItems.slice(0, 2).map((item) => (
            <NavItem
              key={item.path}
              {...item}
              isActive={activePath === item.path}
              onPress={() => router.push(item.path)}
            />
          ))}
          <YStack width={50} />
          {navItems.slice(2, 4).map((item) => (
            <NavItem
              key={item.path}
              {...item}
              isActive={activePath === item.path}
              onPress={() => router.push(item.path)}
            />
          ))}
        </XStack>

        <YStack
          position="absolute"
          top="-40%"
          left="50%"
          x={-25}
          alignItems="center"
        >
          <Button
            size="$5"
            circular
            icon={Plus}
            borderWidth={2}
            borderColor="$accent"
            color="$accent"
            elevation="$3"
            onPress={() => router.push('/add-motorcycle')}
          />
        </YStack>
      </XStack>
    </YStack>
  );
}
import { Colors } from '../constants/theme-bullground';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string }
) {
  const theme = useColorScheme() ?? 'dark';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors.text.primary;
  }
}

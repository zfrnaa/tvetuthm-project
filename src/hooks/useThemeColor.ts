import { useColorScheme } from '@mui/material/styles';
import { Colors } from '../../constants/Colors';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorKey = theme.toString() === 'dark' ? 'dark' : 'light';
  const colorFromProps = props[colorKey];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[colorKey][colorName];
  }
}

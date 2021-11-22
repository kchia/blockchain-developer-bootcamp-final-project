export default function formatNumber(input) {
  return Intl.NumberFormat("en-US").format(input);
}

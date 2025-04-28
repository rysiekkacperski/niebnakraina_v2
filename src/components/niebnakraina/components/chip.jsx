const getProductTags = (
  categoryName = '',
  forAdults = true,
  forChildren = true,
  remote = true,
  partiallyRemote = false,
  onPremises = true
) => {
  let productTags = [
    ...(!!categoryName ? [{ label: categoryName, color: 'primary' }] : []),
    ...(forAdults ? [{ label: 'DLA DOROSŁYCH', color: 'success' }] : []),
    ...(forChildren ? [{ label: 'DLA DZIECI', color: 'purple' }] : []),
    ...(remote ? [{ label: 'ZDALNIE', color: 'warning'}] : []),
    ...(partiallyRemote ? [{ label: 'CZĘŚCIWOWO ZDALNIE', color: 'warning' }] : []),
    ...(onPremises ? [{ label: 'W PLACÓWCE', color: 'default'}] : [])
  ]

  return productTags

}

const NiebnaChips = {
  getProductTags: getProductTags,
}

export default NiebnaChips
export const AddImportEntryTip = (
  type: 'ce' | 'wc',
  selector: string
) => `Don\'t forget to import the new ${type === 'ce' ? 'custom element' : 'web component'} (e.g. in /src/index.ts); \
then it can be used as a normal element like, "<${selector}></${selector}>"`;
